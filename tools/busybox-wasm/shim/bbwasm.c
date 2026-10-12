/*
 * busybox-wasm process shim.
 *
 * Emscripten's libc assumes a single process: getpid() returns 42, wait4()
 * is ENOSYS, signals are delivered only within the module, and nanosleep()
 * busy-waits. This file replaces those pieces with imports from the "bbw"
 * module, which the JS kernel (src/linux/kernel) implements. Strong
 * definitions here win over Emscripten's weak stubs at link time.
 *
 * Imports marked BLOCKING may suspend the instance with Asyncify; they must be
 * listed in ASYNCIFY_IMPORTS in build.sh.
 */
#define _GNU_SOURCE
#include <errno.h>
#include <fcntl.h>
#include <signal.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <sched.h>
#include <time.h>
#include <unistd.h>
#include <sys/resource.h>
#include <sys/sysinfo.h>
#include <sys/times.h>
#include <sys/utsname.h>
#include <sys/wait.h>

#define BBW(name) __attribute__((import_module("bbw"), import_name(#name)))

/* BLOCKING: returns twice (0 in the child, child pid in the parent). */
BBW(vfork) int bbw_vfork(void);
/* BLOCKING */
BBW(wait4) int bbw_wait4(int pid, int *status, int options, struct rusage *ru);
/* BLOCKING: sleeps; returns 0 or -EINTR, writing the remainder to *rem_ns. */
BBW(nanosleep) int bbw_nanosleep(int64_t ns, int64_t *rem_ns);
/* BLOCKING: waits for a signal with the given mask installed. */
BBW(sigsuspend) int bbw_sigsuspend(uint64_t mask);
BBW(execve) int bbw_execve(const char *path, char *const argv[], char *const envp[]);
BBW(getpid) int bbw_getpid(void);
BBW(getppid) int bbw_getppid(void);
BBW(getpgid) int bbw_getpgid(int pid);
BBW(setpgid) int bbw_setpgid(int pid, int pgid);
BBW(getsid) int bbw_getsid(int pid);
BBW(setsid) int bbw_setsid(void);
BBW(kill) int bbw_kill(int pid, int sig);
/* Tells the kernel how a signal is handled: 0 default, 1 ignore, 2 handler,
 * 3 handler with SA_RESTART. */
BBW(sigdisp) void bbw_sigdisp(int sig, int disp);
/* Tells the kernel the new blocked mask; may deliver pending signals. */
BBW(sigmask) void bbw_sigmask(uint64_t mask);
BBW(sysinfo) int bbw_sysinfo(struct sysinfo *info);
BBW(sethostname) int bbw_sethostname(const char *name, size_t len);
BBW(alarm) unsigned bbw_alarm(unsigned seconds);
BBW(uname) int bbw_uname(struct utsname *buf);
/* Fills *buf (if not NULL) with CPU times in 1/100 s; returns elapsed ticks. */
BBW(times) int bbw_times(struct tms *buf);

static int ret(int r)
{
	if (r < 0) {
		errno = -r;
		return -1;
	}
	return r;
}

/* ---- processes ---- */

pid_t vfork(void) { return ret(bbw_vfork()); }
pid_t fork(void) { errno = ENOSYS; return -1; }

int execve(const char *path, char *const argv[], char *const envp[])
{
	return ret(bbw_execve(path, argv, envp));
}

/* Emscripten's system() and popen() can't start processes. These run
 * "/bin/sh -c cmd" with vfork + exec, which the kernel implements. */

int system(const char *cmd)
{
	struct sigaction ign, oldint, oldquit;
	sigset_t chld, oldmask;
	pid_t pid;
	int status = -1;

	if (!cmd)
		return 1; /* a shell is available */
	memset(&ign, 0, sizeof(ign));
	ign.sa_handler = SIG_IGN;
	sigaction(SIGINT, &ign, &oldint);
	sigaction(SIGQUIT, &ign, &oldquit);
	sigemptyset(&chld);
	sigaddset(&chld, SIGCHLD);
	sigprocmask(SIG_BLOCK, &chld, &oldmask);

	pid = vfork();
	if (pid == 0) {
		sigaction(SIGINT, &oldint, NULL);
		sigaction(SIGQUIT, &oldquit, NULL);
		sigprocmask(SIG_SETMASK, &oldmask, NULL);
		execl("/bin/sh", "sh", "-c", cmd, (char *)NULL);
		_exit(127);
	}
	if (pid > 0) {
		while (waitpid(pid, &status, 0) < 0) {
			if (errno != EINTR) {
				status = -1;
				break;
			}
		}
	}
	sigaction(SIGINT, &oldint, NULL);
	sigaction(SIGQUIT, &oldquit, NULL);
	sigprocmask(SIG_SETMASK, &oldmask, NULL);
	return status;
}

#define MAX_POPEN 16
static struct {
	FILE *f;
	pid_t pid;
} popen_children[MAX_POPEN];

FILE *popen(const char *cmd, const char *mode)
{
	int fds[2], i, slot = -1;
	int reading = mode[0] == 'r';
	pid_t pid;
	FILE *f;

	if ((mode[0] != 'r' && mode[0] != 'w') || (mode[1] && mode[1] != 'e')) {
		errno = EINVAL;
		return NULL;
	}
	for (i = 0; i < MAX_POPEN; i++) {
		if (!popen_children[i].f) {
			slot = i;
			break;
		}
	}
	if (slot < 0) {
		errno = EMFILE;
		return NULL;
	}
	if (pipe2(fds, O_CLOEXEC) < 0)
		return NULL;

	pid = vfork();
	if (pid == 0) {
		/* The child's end becomes stdin or stdout; both ends are
		 * close-on-exec, and dup2 clears that flag on the copy. */
		int end = reading ? fds[1] : fds[0];
		int target = reading ? 1 : 0;
		/* POSIX: streams from earlier popen() calls are closed in the
		 * child, or their readers would never see end of file. */
		for (i = 0; i < MAX_POPEN; i++)
			if (popen_children[i].f)
				close(fileno(popen_children[i].f));
		if (end == target)
			fcntl(end, F_SETFD, 0);
		else
			dup2(end, target);
		execl("/bin/sh", "sh", "-c", cmd, (char *)NULL);
		_exit(127);
	}
	if (pid < 0) {
		close(fds[0]);
		close(fds[1]);
		return NULL;
	}
	close(reading ? fds[1] : fds[0]);
	f = fdopen(reading ? fds[0] : fds[1], reading ? "r" : "w");
	if (!f) {
		close(reading ? fds[0] : fds[1]);
		waitpid(pid, NULL, 0);
		return NULL;
	}
	if (mode[1] != 'e')
		fcntl(fileno(f), F_SETFD, 0);
	popen_children[slot].f = f;
	popen_children[slot].pid = pid;
	return f;
}

int pclose(FILE *f)
{
	int i, status;
	pid_t pid = -1;

	for (i = 0; i < MAX_POPEN; i++) {
		if (popen_children[i].f == f) {
			pid = popen_children[i].pid;
			popen_children[i].f = NULL;
			break;
		}
	}
	if (pid < 0) {
		errno = ECHILD;
		return -1;
	}
	fclose(f);
	while (waitpid(pid, &status, 0) < 0) {
		if (errno != EINTR)
			return -1;
	}
	return status;
}

pid_t wait4(pid_t pid, int *status, int options, struct rusage *ru)
{
	return ret(bbw_wait4(pid, status, options, ru));
}
pid_t waitpid(pid_t pid, int *status, int options) { return wait4(pid, status, options, NULL); }
pid_t wait(int *status) { return wait4(-1, status, 0, NULL); }
pid_t wait3(int *status, int options, struct rusage *ru) { return wait4(-1, status, options, ru); }

pid_t getpid(void) { return bbw_getpid(); }
pid_t getppid(void) { return bbw_getppid(); }
pid_t getpgid(pid_t pid) { return ret(bbw_getpgid(pid)); }
pid_t getpgrp(void) { return bbw_getpgid(0); }
int setpgid(pid_t pid, pid_t pgid) { return ret(bbw_setpgid(pid, pgid)); }
pid_t getsid(pid_t pid) { return ret(bbw_getsid(pid)); }
pid_t setsid(void) { return ret(bbw_setsid()); }

int sysinfo(struct sysinfo *info) { return ret(bbw_sysinfo(info)); }
/* Emscripten's times() reports all zeros (hush's "times" builtin uses it).
 * Its definition is not weak, so build.sh links with --wrap=times and every
 * call comes here instead. */
clock_t __wrap_times(struct tms *buf) { return bbw_times(buf); }

/* Emscripten's weak stub reports "Emscripten"; uname(), gethostname() use this. */
int __syscall_uname(intptr_t buf) { return bbw_uname((struct utsname *)buf); }
int sethostname(const char *name, size_t len) { return ret(bbw_sethostname(name, len)); }

int sched_getaffinity(pid_t pid, size_t size, cpu_set_t *set)
{
	(void)pid;
	memset(set, 0, size);
	CPU_SET(0, set);
	return 0;
}

/* ---- time ---- */

int clock_nanosleep(clockid_t clk, int flags, const struct timespec *req, struct timespec *rem)
{
	int64_t ns = (int64_t)req->tv_sec * 1000000000 + req->tv_nsec;
	int64_t left = 0;
	int r;

	if (flags & TIMER_ABSTIME) {
		struct timespec now;
		clock_gettime(clk, &now);
		ns -= (int64_t)now.tv_sec * 1000000000 + now.tv_nsec;
		if (ns < 0)
			ns = 0;
	}
	r = bbw_nanosleep(ns, &left);
	if (r < 0 && rem && !(flags & TIMER_ABSTIME)) {
		rem->tv_sec = left / 1000000000;
		rem->tv_nsec = left % 1000000000;
	}
	return -r; /* clock_nanosleep returns the error number */
}
int __clock_nanosleep(clockid_t clk, int flags, const struct timespec *req, struct timespec *rem)
	__attribute__((alias("clock_nanosleep")));

int nanosleep(const struct timespec *req, struct timespec *rem)
{
	int e = clock_nanosleep(CLOCK_REALTIME, 0, req, rem);
	if (e) {
		errno = e;
		return -1;
	}
	return 0;
}

int usleep(useconds_t us)
{
	struct timespec ts = { us / 1000000, (us % 1000000) * 1000 };
	return nanosleep(&ts, NULL);
}

unsigned sleep(unsigned seconds)
{
	struct timespec ts = { seconds, 0 }, rem = { 0, 0 };
	if (nanosleep(&ts, &rem) < 0)
		return rem.tv_sec + (rem.tv_nsec > 0);
	return 0;
}

unsigned alarm(unsigned seconds) { return bbw_alarm(seconds); }

/* ---- signals ----
 * Dispositions and the blocked mask live here (the handlers are wasm function
 * pointers); the kernel is told about every change so it can apply default
 * actions itself and knows when a handler can run. The kernel runs handlers by
 * calling the exported bbw_deliver().
 */

struct sigaction __sig_actions[_NSIG];
sigset_t __sig_pending; /* unused: pending signals are queued in the kernel */
static uint64_t sig_mask;

static uint64_t set_to_mask(const sigset_t *set)
{
	uint64_t m;
	memcpy(&m, set, sizeof(m));
	return m;
}

static void mask_to_set(uint64_t m, sigset_t *set)
{
	memset(set, 0, sizeof(*set));
	memcpy(set, &m, sizeof(m));
}

static int disp_of(const struct sigaction *sa)
{
	if (!(sa->sa_flags & SA_SIGINFO)) {
		if (sa->sa_handler == SIG_DFL)
			return 0;
		if (sa->sa_handler == SIG_IGN)
			return 1;
	}
	return sa->sa_flags & SA_RESTART ? 3 : 2;
}

int __sigaction(int sig, const struct sigaction *restrict sa, struct sigaction *restrict old)
{
	if (sig <= 0 || sig >= _NSIG || ((sig == SIGKILL || sig == SIGSTOP) && sa)) {
		errno = EINVAL;
		return -1;
	}
	if (old)
		*old = __sig_actions[sig];
	if (sa) {
		__sig_actions[sig] = *sa;
		bbw_sigdisp(sig, disp_of(sa));
	}
	return 0;
}
int sigaction(int sig, const struct sigaction *restrict sa, struct sigaction *restrict old)
	__attribute__((alias("__sigaction")));

bool __sig_is_blocked(int sig)
{
	return sig > 0 && sig <= 64 && (sig_mask >> (sig - 1)) & 1;
}

int pthread_sigmask(int how, const sigset_t *restrict set, sigset_t *restrict old)
{
	if (old)
		mask_to_set(sig_mask, old);
	if (set) {
		uint64_t m = set_to_mask(set);
		switch (how) {
		case SIG_SETMASK: sig_mask = m; break;
		case SIG_BLOCK: sig_mask |= m; break;
		case SIG_UNBLOCK: sig_mask &= ~m; break;
		default: return EINVAL;
		}
		sig_mask &= ~((1ULL << (SIGKILL - 1)) | (1ULL << (SIGSTOP - 1)));
		bbw_sigmask(sig_mask);
	}
	return 0;
}

int sigprocmask(int how, const sigset_t *restrict set, sigset_t *restrict old)
{
	int r = pthread_sigmask(how, set, old);
	if (r) {
		errno = r;
		return -1;
	}
	return 0;
}

int sigpending(sigset_t *set)
{
	/* Pending signals are delivered as soon as they are unblocked. */
	sigemptyset(set);
	return 0;
}

int sigsuspend(const sigset_t *mask)
{
	uint64_t saved = sig_mask;
	sig_mask = set_to_mask(mask);
	bbw_sigsuspend(sig_mask);
	sig_mask = saved;
	bbw_sigmask(sig_mask);
	errno = EINTR;
	return -1;
}

/* A vfork child runs in its parent's memory, so a sigaction() in the child
 * would overwrite the parent's handlers. The kernel saves this state when
 * vfork starts and restores it before the parent resumes. A vfork child may
 * vfork again (daemonizing does), so the saved states form a stack. */
#define MAX_VFORK_DEPTH 4
static struct sigaction saved_actions[MAX_VFORK_DEPTH][_NSIG];
static uint64_t saved_mask[MAX_VFORK_DEPTH];
static int saved_depth;

__attribute__((export_name("bbw_sigsave")))
void bbw_sigsave(void)
{
	if (saved_depth >= MAX_VFORK_DEPTH)
		return; /* the kernel refuses deeper vforks */
	memcpy(saved_actions[saved_depth], __sig_actions, sizeof(saved_actions[0]));
	saved_mask[saved_depth] = sig_mask;
	saved_depth++;
}

__attribute__((export_name("bbw_sigrestore")))
void bbw_sigrestore(void)
{
	if (saved_depth <= 0)
		return;
	saved_depth--;
	memcpy(__sig_actions, saved_actions[saved_depth], sizeof(saved_actions[0]));
	sig_mask = saved_mask[saved_depth];
}

/* Called by the kernel before main(): the blocked mask and ignored signals
 * survive execve. */
__attribute__((export_name("bbw_setup")))
void bbw_setup(uint64_t mask, uint64_t ignored)
{
	sig_mask = mask;
	for (int sig = 1; sig < _NSIG && sig <= 64; sig++)
		if ((ignored >> (sig - 1)) & 1)
			__sig_actions[sig].sa_handler = SIG_IGN;
}

/* Called by the kernel to run a handler. Only called for unblocked signals
 * whose disposition is a handler. */
__attribute__((export_name("bbw_deliver")))
void bbw_deliver(int sig)
{
	struct sigaction *sa = &__sig_actions[sig];
	uint64_t saved = sig_mask;
	uint64_t during = sig_mask | set_to_mask(&sa->sa_mask);

	if (!(sa->sa_flags & SA_NODEFER))
		during |= 1ULL << (sig - 1);
	if (during != sig_mask) {
		sig_mask = during;
		bbw_sigmask(sig_mask);
	}
	if (sa->sa_flags & SA_SIGINFO) {
		siginfo_t info;
		memset(&info, 0, sizeof(info));
		info.si_signo = sig;
		sa->sa_sigaction(sig, &info, NULL);
	} else {
		void (*h)(int) = sa->sa_handler;
		if (sa->sa_flags & SA_RESETHAND) {
			sa->sa_handler = SIG_DFL;
			bbw_sigdisp(sig, 0);
		}
		h(sig);
	}
	if (sig_mask != saved) {
		sig_mask = saved;
		bbw_sigmask(sig_mask);
	}
}

int raise(int sig) { return kill(getpid(), sig); }

int kill(pid_t pid, int sig) { return ret(bbw_kill(pid, sig)); }

int killpg(pid_t pgrp, int sig)
{
	if (pgrp < 0) {
		errno = EINVAL;
		return -1;
	}
	return kill(-pgrp, sig);
}
