import re,sys
frag=[l.strip() for l in open(sys.argv[1]) if l.strip().startswith("CONFIG_")]
cfg=open(".config").read().splitlines()
want={}
for l in frag:
    k,v=l.split("=",1); want[k]=v
out=[];seen=set()
for l in cfg:
    m=re.match(r"# (CONFIG_\w+) is not set",l) or re.match(r"(CONFIG_\w+)=",l)
    if m and m.group(1) in want:
        k=m.group(1);seen.add(k);v=want[k]
        out.append(f"# {k} is not set" if v=="n" else f"{k}={v}")
    else: out.append(l)
for k,v in want.items():
    if k not in seen: out.append(f"# {k} is not set" if v=="n" else f"{k}={v}")
open(".config","w").write("\n".join(out)+"\n")
