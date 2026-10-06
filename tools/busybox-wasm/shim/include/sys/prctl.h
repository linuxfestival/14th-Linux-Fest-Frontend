/* busybox-wasm: no prctl in the browser kernel; PR_SET_NAME etc. are no-ops. */
#ifndef BBWASM_SYS_PRCTL_H
#define BBWASM_SYS_PRCTL_H
#define PR_SET_PDEATHSIG 1
#define PR_SET_NAME 15
#define PR_GET_NAME 16
static inline int prctl(int option, ...) { (void)option; return 0; }
#endif
