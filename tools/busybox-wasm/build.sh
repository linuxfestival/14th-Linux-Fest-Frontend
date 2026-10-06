#!/usr/bin/env bash
# Builds busybox.wasm for the Linux Fest browser terminal.
# Needs emsdk (source emsdk_env.sh first) and gcc for busybox's kconfig.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
BB_VER=1.37.0
SRC="$HERE/busybox-$BB_VER"
OUT="${OUT:-$HERE/out}"

if [ ! -d "$SRC" ]; then
  curl -fsSL "https://busybox.net/downloads/busybox-$BB_VER.tar.bz2" | tar xj -C "$HERE"
fi

cd "$SRC"
for p in "$HERE"/patches/*.patch; do
  patch -p1 -N -s --dry-run < "$p" >/dev/null 2>&1 && patch -p1 -N -s < "$p"
done
make allnoconfig >/dev/null
sed "s|@SHIM_INCLUDE@|$HERE/shim/include|" "$HERE/cfg/fragment.config" > "$HERE/cfg/.fragment.resolved"
for _ in 1 2 3; do
  python3 "$HERE/cfg/apply.py" "$HERE/cfg/.fragment.resolved"
  (yes "" | make oldconfig >/dev/null 2>&1) || true
done

make -j"$(nproc)" CC=emcc AR=emar HOSTCC=gcc SKIP_STRIP=y busybox_unstripped >/dev/null 2>&1 || true
# busybox's trylink can't drive wasm-ld; link ourselves from the built archives.
LIBS=$(echo */built-in.o */*/built-in.o */lib.a */*/lib.a | tr ' ' '\n' | grep -v '^\*' | sort -u)

emcc -Oz -c "$HERE/shim/bbwasm.c" -o "$HERE/shim/bbwasm.o"

ASYNC_IMPORTS='bbw.yield,bbw.vfork,bbw.wait4,bbw.nanosleep,bbw.sigsuspend,wasi_snapshot_preview1.fd_read,wasi_snapshot_preview1.fd_write,env.__syscall_poll,env.__syscall__newselect,env.__syscall_pselect6,env.invoke_*'

# Only busybox.wasm is used; the JS kernel in src/linux/kernel replaces
# Emscripten's busybox.js glue and implements every import itself.
# -g3 keeps import/export names unminified (the kernel binds by name); the
# debug info it adds is stripped below. Undefined symbols are the bbw.*
# imports from shim/bbwasm.c.
mkdir -p "$OUT"
emcc -Oz -o "$OUT/busybox.js" \
  "$HERE/shim/bbwasm.o" applets/built-in.o \
  -Wl,--start-group $LIBS -Wl,--end-group -lm \
  -Wl,--wrap=times \
  -sASYNCIFY=1 -sASYNCIFY_IMPORTS="[$ASYNC_IMPORTS]" \
  -sALLOW_MEMORY_GROWTH=1 -sINITIAL_MEMORY=4MB -sSTACK_SIZE=256KB \
  -sEXIT_RUNTIME=1 -sSUPPORT_LONGJMP=emscripten \
  -sEXPORTED_FUNCTIONS=_main,_malloc,_free \
  -sENVIRONMENT=worker -sFILESYSTEM=1 -sERROR_ON_UNDEFINED_SYMBOLS=0 -Wno-undefined -g3
# Keep a copy with function names for tools/busybox-wasm/analyze.mjs.
cp "$OUT/busybox.wasm" "$OUT/busybox.symbols.wasm"
"$EMSDK/upstream/bin/wasm-opt" --strip-debug --strip-producers --enable-bulk-memory --enable-bulk-memory-opt --enable-nontrapping-float-to-int --enable-sign-ext --enable-mutable-globals --enable-multivalue --enable-reference-types "$OUT/busybox.wasm" -o "$OUT/busybox.wasm"
[ "${KEEP_GLUE:-0}" = 1 ] || rm -f "$OUT/busybox.js"   # KEEP_GLUE=1 keeps it as an ABI reference
# Fails if an applet can reach an Emscripten stub nobody has reviewed.
node "$HERE/analyze.mjs" "$OUT/busybox.symbols.wasm" --report "$HERE/stub-report.md"
ls -la "$OUT/busybox.wasm"
