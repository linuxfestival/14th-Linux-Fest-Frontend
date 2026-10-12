import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBundles } from "../../../core/bundles/bundles.api";
import type { BundleDto } from "../../../core/bundles/bundles.types";
import BundleCard from "./BundleCard";
import Loading from "../../Common/icons/Loading";

const BundlesList = () => {
  const [bundles, setBundles] = useState<BundleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    getBundles().then(response => { if (active) setBundles(response.data); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [revision]);
  return (
    <section aria-label="فهرست بسته‌ها">
      {loading ? (
        <div role="status" className="flex min-h-40 items-center justify-center">
          <Loading aria-hidden="true" className="size-10 text-secondary motion-safe:animate-spin" />
          <span className="sr-only">در حال دریافت بسته‌ها…</span>
        </div>
      ) : error ? (
        <div role="alert" className="rounded-xl border border-primary/15 p-5">
          <p className="text-sm leading-7">دریافت بسته‌ها انجام نشد. دوباره تلاش کن.</p>
          <button type="button" onClick={() => setRevision(value => value + 1)} className="mt-3 min-h-11 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">تلاش دوباره</button>
        </div>
      ) : bundles.length ? <div className="space-y-5">{bundles.map(bundle => <BundleCard key={bundle.id} bundle={bundle} onChanged={() => setRevision(value => value + 1)} />)}</div> : (
        <div className="rounded-xl border border-primary/15 bg-white px-6 py-12 text-center sm:py-16">
          <h2 className="text-xl font-extrabold">هنوز بسته‌ای برای انتخاب نیست.</h2>
          <p className="mt-3 text-sm leading-7 text-dark-gray">می‌تونی کارگاه‌ها و ارائه‌ها رو جداگانه انتخاب کنی.</p>
          <Link to="/workshops" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">دیدن ارائه‌ها و کارگاه‌ها</Link>
        </div>
      )}
    </section>
  );
};
export default BundlesList;
