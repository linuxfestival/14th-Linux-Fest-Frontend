// Text content of the root filesystem. Kept in English and ASCII: xterm.js
// does not shape or reorder right-to-left text.
const MOTD = `
  _     _                    _____          _
 | |   (_)_ __  _   ___  __ |  ___|__  ___| |_
 | |   | | '_ \\| | | \\ \\/ / | |_ / _ \\/ __| __|
 | |___| | | | | |_| |>  <  |  _|  __/\\__ \\ |_
 |_____|_|_| |_|\\__,_/_/\\_\\ |_|  \\___||___/\\__|  15

 Welcome to the 15th Linux Fest, Amirkabir University of Technology.

 This is a real BusyBox shell compiled to WebAssembly, running in your
 browser. Nothing leaves your machine, and you are root here: break things.

 Try:  ls /bin     neofetch     cat README     top     vi notes.txt
       fortune | cowsay         ps             help
`;

const MOTD_SMALL = `
 Linux Fest 15 · Amirkabir University

 A real BusyBox shell in WebAssembly,
 running in your browser. You are root.

 Try: ls /bin, neofetch, top, ps,
      fortune | cowsay, vi notes.txt
`;

export const ETC_FILES: Record<string, string> = {
  "/etc/passwd": "root:x:0:0:root:/root:/bin/sh\nnobody:x:65534:65534:nobody:/:/bin/false\n",
  "/etc/group": "root:x:0:\nnogroup:x:65534:\n",
  "/etc/shadow": "root:*:20000:0:99999:7:::\n",
  "/etc/hostname": "linuxfest\n",
  "/etc/hosts": "127.0.0.1\tlocalhost\n127.0.1.1\tlinuxfest\n",
  "/etc/shells": "/bin/sh\n/bin/hush\n/bin/bash\n",
  "/etc/issue": "Linux Fest 15 \\n \\l\n\n",
  "/etc/os-release":
    'NAME="Linux Fest"\nPRETTY_NAME="Linux Fest 15 (BusyBox in WebAssembly)"\nID=linuxfest\n' +
    'VERSION_ID=15\nHOME_URL="https://linux-fest.ir/"\n',
  "/etc/motd": MOTD,
  "/etc/motd.small": MOTD_SMALL,
  "/etc/profile": `# /etc/profile: read by the login shell
export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
export PS1='\\[\\e[1;32m\\]\\u@\\h\\[\\e[0m\\]:\\[\\e[1;34m\\]\\w\\[\\e[0m\\]\\$ '
export EDITOR=vi PAGER=less HISTFILE=/root/.ash_history
# hush has no aliases; functions do the same job
ll() { ls -alF "$@"; }
la() { ls -A "$@"; }
l() { ls -CF "$@"; }
cls() { clear; }
cols=$(stty size 2>/dev/null | cut -d' ' -f2)
if [ "\${cols:-80}" -ge 78 ]; then cat /etc/motd; else cat /etc/motd.small; fi
unset cols
`,
};

export const ROOT_FILES: Record<string, string> = {
  "/root/README": `This terminal runs BusyBox 1.37 (the hush shell and about 130 applets),
compiled to WebAssembly, on a small Linux-like kernel written in TypeScript.

Every command is a real process: \`ls | wc -l\` starts two BusyBox processes
connected by a pipe. Job control works (^C, ^Z, fg, bg, &), as do /proc,
signals, FIFOs, vi, top and tar.

There is no network. The filesystem lives in memory and resets when you
close the page.

Things to try:
  neofetch                 who am I running on?
  ps; top                  processes
  seq 1 10 | awk '{s+=$1} END {print s}'
  vi hello.sh              write a script, then: sh hello.sh
  cat /proc/self/status    the kernel's view of a process
  help                     hush's built-in commands
`,
  "/root/notes.txt": "",
};

const FORTUNES = [
  "Talk is cheap. Show me the code. -- Linus Torvalds",
  "Software is like sex: it's better when it's free. -- Linus Torvalds",
  "Unix is simple. It just takes a genius to understand its simplicity. -- Dennis Ritchie",
  "Those who do not understand Unix are condemned to reinvent it, poorly. -- Henry Spencer",
  "Free software is a matter of liberty, not price. -- Richard Stallman",
  "Given enough eyeballs, all bugs are shallow. -- Eric S. Raymond",
  "Write programs that do one thing and do it well. -- Doug McIlroy",
  "There's no place like 127.0.0.1",
  "rm -rf / is a valid command here. Go on. Then reload the page.",
  "In the beginning was the command line. -- Neal Stephenson",
  "Simplicity is prerequisite for reliability. -- Edsger W. Dijkstra",
  "The best way to predict the future is to implement it. -- David Heinemeier Hansson",
];

const NO_NETWORK = (name: string) => `#!/bin/sh
echo "${name}: this machine has no network, so there is nothing to install." >&2
echo "Everything that exists is already in /bin: ls /bin" >&2
exit 1
`;

export const SCRIPTS: Record<string, string> = {
  neofetch: `#!/bin/sh
up=$(cut -d. -f1 /proc/uptime)
mem_total=$(awk '/MemTotal/ {print int($2/1024)}' /proc/meminfo)
mem_free=$(awk '/MemAvailable/ {print int($2/1024)}' /proc/meminfo)
procs=$(ls -d /proc/[0-9]* | wc -l)
c='\\033[1;33m'; b='\\033[1;34m'; r='\\033[0m'
printf "$c        .--.      $b root$r@$b$(hostname)$r\\n"
printf "$c       |o_o |     $r ----------------\\n"
printf "$c       |:_/ |     $b OS:$r Linux Fest 15 (BusyBox $(busybox | head -1 | cut -d' ' -f2))\\n"
printf "$c      //   \\\\ \\\\    $b Kernel:$r $(uname -r)\\n"
printf "$c     (|     | )   $b Arch:$r $(uname -m)\\n"
printf "$c    /'\\\\_   _/\\\`\\\\   $b Uptime:$r $((up / 60)) min $((up % 60)) s\\n"
printf "$c    \\\\___)=(___/   $b Shell:$r hush\\n"
printf "                  $b Processes:$r $procs\\n"
printf "                  $b Memory:$r $((mem_total - mem_free)) MiB / $mem_total MiB\\n"
printf "                  $b Terminal:$r xterm.js $(stty size 2>/dev/null | awk '{print $2"x"$1}')\\n\\n"
`,
  fortune: `#!/bin/sh
# $RANDOM, not $$ or the time: awk truncates the seed to 32 bits, and
# larger seeds all become the same number.
awk -v seed="$RANDOM" 'BEGIN { srand(seed) } { l[NR] = $0 } END { print l[int(rand() * NR) + 1] }' /usr/share/fortunes
`,
  cowsay: `#!/bin/sh
if [ $# -gt 0 ]; then msg="$*"; else msg=$(cat); fi
echo "$msg" | awk '
  { lines[NR] = $0; if (length($0) > w) w = length($0) }
  END {
    bar = ""; for (i = 0; i < w + 2; i++) bar = bar "-"
    print " " bar
    for (i = 1; i <= NR; i++) printf "| %-" w "s |\\n", lines[i]
    print " " bar
  }'
cat <<'COW'
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
COW
`,
  sudo: `#!/bin/sh
echo "You are already root. With great power comes great responsibility." >&2
[ $# -gt 0 ] && exec "$@"
`,
  apt: NO_NETWORK("apt"),
  "apt-get": NO_NETWORK("apt-get"),
  pacman: NO_NETWORK("pacman"),
  dnf: NO_NETWORK("dnf"),
  yum: NO_NETWORK("yum"),
  pip: NO_NETWORK("pip"),
  npm: NO_NETWORK("npm"),
  ssh: `#!/bin/sh\necho "ssh: no network in this sandbox" >&2\nexit 255\n`,
  ping: `#!/bin/sh\necho "ping: no network in this sandbox" >&2\nexit 2\n`,
  curl: `#!/bin/sh\necho "curl: (6) no network in this sandbox" >&2\nexit 6\n`,
  wget: `#!/bin/sh\necho "wget: no network in this sandbox" >&2\nexit 4\n`,
  sl: `#!/bin/sh
# A small train.
w=$(stty size 2>/dev/null | cut -d' ' -f2); w=\${w:-80}
i=$w
printf '\\033[?25l'
while [ $i -gt -40 ]; do
  printf '\\033[2J\\033[5;1H'
  pad=""; [ $i -gt 0 ] && pad=$(printf "%\${i}s" "")
  printf "%s      ====        ________                ___________\\n" "$pad"
  printf "%s  _D _|  |_______/        \\\\__I_I_____===__|_________|\\n" "$pad"
  printf "%s   |(_)---  |   H\\\\________/ |   |        =|___ ___|\\n" "$pad"
  printf "%s   /     |  |   H  |  |     |   |         ||_| |_||\\n" "$pad"
  printf "%s  |      |  |   H  |__--------------------| [___] |\\n" "$pad"
  printf "%s  | ________|___H__/__|_____/[][]~\\\\_______|       |\\n" "$pad"
  printf "%s  |/ |   |-----------I_____I [][] []  D   |=======|__\\n" "$pad"
  i=$((i - 3))
  usleep 50000
done
printf '\\033[?25h\\033[2J\\033[H'
`,
};

export const SHARE_FILES: Record<string, string> = {
  "/usr/share/fortunes": FORTUNES.join("\n") + "\n",
};
