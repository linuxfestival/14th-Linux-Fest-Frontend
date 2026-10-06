// Headless tests for the BusyBox terminal kernel: boots the system in Node
// with a fake terminal and checks the output of real shell commands.
// Run: node tests/linux.test.mjs [filter]
import { readFileSync } from "node:fs";
import { createSystem } from "../src/linux/system.ts";

const wasm = process.env.BUSYBOX_WASM ?? new URL("../src/linux/busybox.wasm", import.meta.url).pathname;
const module = new WebAssembly.Module(readFileSync(wasm));
const dec = new TextDecoder();

export function boot() {
  let out = "";
  const waiters = [];
  const k = createSystem({
    module,
    host: {
      output: (b) => {
        out += dec.decode(b, { stream: true });
        for (const w of [...waiters]) w();
      },
      outputReady: () => true,
    },
    onLogout: () => false,
    rows: 24,
    cols: 500,
  });
  const sys = {
    k,
    get out() {
      return out;
    },
    clear() {
      out = "";
    },
    type(s) {
      k.tty.input(s);
    },
    /** Waits until the output matches re (or times out). */
    waitFor(re, ms = 5000) {
      return new Promise((resolve, reject) => {
        const check = () => {
          const m = typeof re === "string" ? out.includes(re) : re.test(out);
          if (m) {
            waiters.splice(waiters.indexOf(check), 1);
            clearTimeout(t);
            resolve(out);
          }
        };
        const t = setTimeout(() => {
          waiters.splice(waiters.indexOf(check), 1);
          reject(new Error(`timeout waiting for ${re}; output:\n${JSON.stringify(out.slice(-600))}`));
        }, ms);
        waiters.push(check);
        check();
      });
    },
    /** Runs a command line; resolves with its output (between command and next prompt). */
    async run(cmd, ms = 5000) {
      const mark = `__done_${Math.random().toString(36).slice(2)}__`;
      out = "";
      k.tty.input(`${cmd}; echo ${mark}$?\r`);
      const re = new RegExp(`${mark}(\\d+)`);
      await sys.waitFor(re, ms);
      const m = re.exec(out);
      const body = out.slice(out.indexOf("\n") + 1, m.index).replace(/\r\n/g, "\n");
      return { out: body, status: Number(m[1]) };
    },
  };
  return sys;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// [command, check(out, status) → true | message]
const eq = (want, code = 0) => (out, st) => (out === want && st === code) || `want ${JSON.stringify(want)}/${code}`;
const has = (want, code = 0) => (out, st) => (out.includes(want) && st === code) || `want …${JSON.stringify(want)}…/${code}`;
const match = (re, code = 0) => (out, st) => (re.test(out) && st === code) || `want ${re}/${code}`;

const CASES = [
  ["echo hi", eq("hi\n")],
  ["echo hi | wc -c", eq("3\n")],
  ["ls /bin | head -3", match(/^\S+\n\S+\n\S+\n$/)],
  ["seq 1 100000 | tail -1", eq("100000\n")],
  ["yes | head -3", eq("y\ny\ny\n")],
  ["sleep 0.2", eq("")],
  ["false; echo $?", eq("1\n")],
  ["(cd /tmp; pwd); pwd", eq("/tmp\n/root\n")],
  ["echo `echo a` $(echo b)", eq("a b\n")],
  ["echo one > /tmp/f; echo two >> /tmp/f; cat < /tmp/f", eq("one\ntwo\n")],
  ["ls /nonexistent 2>&1 | wc -l", eq("1\n")],
  ["exec 3>/tmp/g; echo three >&3; exec 3>&-; cat /tmp/g", eq("three\n")],
  ["find / -name motd", eq("/etc/motd\n")],
  ["mkdir -p /tmp/t/a && echo x > /tmp/t/a/f && tar czf /tmp/t.tgz -C /tmp t && rm -r /tmp/t && tar xzf /tmp/t.tgz -C /tmp && cat /tmp/t/a/f", eq("x\n")],
  ["printf '#!/bin/sh\\necho script $1\\n' > /tmp/s.sh && chmod +x /tmp/s.sh && /tmp/s.sh ok && sh /tmp/s.sh ok2", eq("script ok\nscript ok2\n")],
  ["printf 'echo noshebang\\n' > /tmp/n.sh && chmod +x /tmp/n.sh && /tmp/n.sh", eq("noshebang\n")],
  ["sleep 5 & kill -9 $!; wait $!; echo $?", match(/\n137\n$/)],
  ["sleep 0.1 & wait; echo done", match(/\ndone\n$/)],
  ["uname -a", match(/^Linux linuxfest .* wasm32/)],
  ["ps", has("PID")],
  ["top -n 1 -b | head -1", match(/^Mem:/)],
  ["df / | tail -1", match(/\/$/m)],
  ["free | head -2 | tail -1", match(/^Mem:/)],
  ["uptime", match(/up/)],
  ["cat /dev/null; head -c 4 /dev/zero | wc -c", eq("4\n")],
  ["echo abc | cat /dev/stdin", eq("abc\n")],
  ["ls -l /proc/self/exe", has("/bin/busybox")],
  ["readlink /proc/self/fd/1", eq("/dev/tty1\n")],
  ["for i in 1 2 3; do echo $i; done | sort -r | tr '\\n' ' '", eq("3 2 1 ")],
  ["x=$(cat /etc/hostname); echo ${x}", eq("linuxfest\n")],
  ["ln -s /etc/hostname /tmp/l && cat /tmp/l && mv /tmp/l /tmp/m && ls /tmp/m | cat", eq("linuxfest\n/tmp/m\n")],
  ["mkfifo /tmp/fifo && (echo via-fifo > /tmp/fifo &) && cat /tmp/fifo", eq("via-fifo\n")],
  ["echo 'a b c' | awk '{print $2}'", eq("b\n")],
  ["echo hello | sed s/hello/bye/", eq("bye\n")],
  ["echo 3+4 | bc 2>/dev/null || echo $((3+4))", eq("7\n")],
  ["date +%Y | grep -c 20", eq("1\n")],
  ["sh -c 'exit 3'; echo $?", eq("3\n")],
  ["trap 'echo trapped' USR1; kill -USR1 $$; echo after", eq("trapped\nafter\n")],
  ["test -d /tmp && [ -f /etc/passwd ] && echo yes", eq("yes\n")],
  ["cat /etc/passwd | grep root | cut -d: -f1", eq("root\n")],
  ["seq 3 | xargs echo", eq("1 2 3\n")],
  ["echo $PPID $$ | wc -w", eq("2\n")],
  ["gzip -c /etc/passwd | gunzip | head -c 4", eq("root")],
  ["dd if=/dev/zero bs=1k count=64 2>/dev/null | md5sum", eq("fcd6bcb56c1689fcef28b57c22475bad  -\n")],
  ["true | false | true; echo $?", eq("0\n")],
  ["cd /proc && ls -d 1 self >/dev/null && echo ok", eq("ok\n")],
  ["neofetch | grep -c Kernel", eq("1\n")],
  ["fortune | cowsay | tail -1", match(/\|\|     \|\|/)],
  ["sudo echo hi 2>/dev/null", eq("hi\n")],
  ["apt install vim; echo $?", match(/no network[\s\S]*\n1\n$/)],
  ["/bin/busybox | head -1", match(/^BusyBox v1\.37/)],
  // system() and popen() (awk, watch and vi use them)
  ["awk 'BEGIN { system(\"echo from-system\") }'", eq("from-system\n")],
  ["awk 'BEGIN { print system(\"exit 3\") }'", eq("3\n")],
  ["awk 'BEGIN { \"echo piped\" | getline x; print x }'", eq("piped\n")],
  ["awk 'BEGIN { print \"z\" | \"sort\"; print \"a\" | \"sort\" }'", eq("a\nz\n")],
  ["timeout 2 watch -n 0.5 -t 'fortune | cowsay' | grep -c '(oo)'", match(/^[1-9]\d*\n$/)],
  ["timeout 1 sleep 5; echo $?", match(/\n?143\n$/)],
  // libc functions that Emscripten stubs out (see tools/busybox-wasm/analyze.mjs)
  // second line of `times` is the children's CPU time: must not be zero
  ["seq 1 200000 | md5sum >/dev/null; times", match(/^\S+ \S+\n(?!0m0\.000s )\S+ \S+\n$/)],
  ["hostname -i", eq("127.0.1.1\n")],
];

async function interactive(sys) {
  const fails = [];
  // ^C during sleep
  sys.clear();
  sys.type("sleep 10\r");
  await sleep(300);
  sys.type("\x03");
  await sys.waitFor(/\^C[\s\S]*# $/, 3000).catch((e) => fails.push("^C: " + e.message));
  // ^Z + fg (hush reports a stopped job as "[1] <pid> <cmd>")
  sys.clear();
  sys.type("sleep 1\r");
  await sleep(150);
  sys.type("\x1a");
  await sys.waitFor(/\[1\] \d+ sleep 1[\s\S]*# $/, 3000).catch((e) => fails.push("^Z: " + e.message));
  const st = await sys.run("ps -o stat,comm | grep sleep");
  if (!/^T/.test(st.out)) fails.push("^Z state: " + JSON.stringify(st.out));
  sys.clear();
  const t0 = Date.now();
  sys.type("fg\r");
  await sys.waitFor(/# $/, 4000).catch((e) => fails.push("fg: " + e.message));
  const jobs = await sys.run("jobs");
  if (jobs.out !== "") fails.push("jobs after fg: " + JSON.stringify(jobs.out) + " after " + (Date.now() - t0) + "ms");
  // vi start and quit
  sys.clear();
  sys.type("vi /tmp/vi.txt\r");
  await sleep(500);
  sys.type("ihello vi");
  await sleep(100);
  sys.type("\x1b");
  await sleep(200);
  sys.type(":wq\r");
  await sys.waitFor(/# $/, 4000).catch((e) => fails.push("vi: " + e.message));
  const r = await sys.run("cat /tmp/vi.txt");
  if (r.out !== "hello vi\n") fails.push("vi content: " + JSON.stringify(r.out));
  return fails;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const filter = process.argv[2];
  const sys = boot();
  await sys.waitFor(/# $/);
  let failed = 0;
  for (const [cmd, check] of CASES) {
    if (filter && !cmd.includes(filter)) continue;
    let res;
    try {
      const r = await sys.run(cmd, 8000);
      res = check(r.out, r.status);
      if (res !== true) res += ` got ${JSON.stringify(r.out)}/${r.status}`;
    } catch (e) {
      res = e.message;
    }
    if (res === true) console.log("ok  ", cmd);
    else {
      failed++;
      console.log("FAIL", cmd, "\n     ", res);
    }
  }
  if (!filter || filter === "interactive") {
    const fails = await interactive(sys);
    for (const f of fails) console.log("FAIL", f);
    if (!fails.length) console.log("ok   interactive (^C, ^Z/fg, vi)");
    failed += fails.length;
  }
  sys.k.shutdown();
  console.log(failed ? `${failed} failed` : "all passed");
  process.exit(failed ? 1 : 0);
}
