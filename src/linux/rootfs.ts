// The root filesystem image: BusyBox and its applet links, /etc, /root.
import applets from "./applets.ts";
import { S } from "./kernel/constants.ts";
import { Inode, type Vfs } from "./kernel/vfs.ts";
import { ETC_FILES, ROOT_FILES, SCRIPTS, SHARE_FILES } from "./content.ts";

const SBIN = new Set(["mount", "umount", "ifconfig", "route", "reboot", "poweroff", "halt", "init", "mdev", "sysctl", "swapon", "swapoff", "losetup", "mkswap", "chroot", "hwclock", "fdisk", "mkfs.ext2", "blkid", "switch_root", "pivot_root"]);

export function buildRoot(vfs: Vfs) {
  for (const d of ["bin", "sbin", "usr/bin", "usr/sbin", "usr/local/bin", "usr/share", "etc", "root", "home", "tmp", "var/log", "var/tmp", "mnt", "opt", "srv"]) {
    vfs.mkdirp("/" + d);
  }
  vfs.resolve(vfs.root, "/tmp").inode.mode = S.IFDIR | 0o1777;
  vfs.resolve(vfs.root, "/root").inode.mode = S.IFDIR | 0o700;

  const bin = vfs.resolve(vfs.root, "/bin").inode;
  const bb = new Inode(S.IFREG | 0o755);
  bb.exe = true;
  bb.size = 934 * 1024; // what `ls -l` shows; the content is never read
  vfs.link(bin, "busybox", bb);

  for (const name of applets) {
    if (name === "busybox") continue;
    vfs.addSymlink(SBIN.has(name) ? `/sbin/${name}` : `/bin/${name}`, SBIN.has(name) ? "../bin/busybox" : "busybox");
  }
  vfs.addSymlink("/bin/bash", "busybox");

  for (const [path, content] of Object.entries(ETC_FILES)) vfs.writeFile(path, content);
  for (const [path, content] of Object.entries({ ...ROOT_FILES, ...SHARE_FILES })) vfs.writeFile(path, content);
  for (const [name, content] of Object.entries(SCRIPTS)) vfs.writeFile("/usr/local/bin/" + name, content, 0o755);
}
