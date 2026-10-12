import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiArrowLeft, HiMagnifyingGlass } from "react-icons/hi2";
import Penguin from "../../assets/images/pinguin.webp";
import { digitsToPersian } from "../../utils/digitsToPersian";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import BundleCard from "./components/BundleCard";
import { getBundles } from "../../core/bundles/bundles.api";
import type { BundleDto } from "../../core/bundles/bundles.types";
import WorkshopCard from "./components/WorkshopCard";
import WorkshopsFilter, { type Sort } from "./components/WorkshopsFilter";
import { useAppDispatch } from "../../store";
import { getAllPresentationsThunk } from "../../core/presentations/presentations.thunk";
import {
  selectIsPresentationLoading,
  selectPresentationsState,
} from "../../core/presentations/presentations.selector";
import { PresentationService } from "../../core/presentations/presentations.dto";
import { toWorkshopItem } from "./workshops.adapter";
import { selectIsAuthenticated } from "../../core/auth/auth.selector";
import { getCartThunk } from "../../core/cart/cart.thunk";

const formats = [
  { label: "همه ارائه‌ها", value: "ALL" },
  { label: "کارگاه‌ها", value: PresentationService.WORKSHOP },
  { label: "ارائه‌ها", value: PresentationService.TALK },
  { label: "بسته‌ها", value: "BUNDLE" },
];
const normalize = (value: string) =>
  value
    .toLocaleLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\u200c/g, " ")
    .trim();

const WorkshopsList = () => {
  const dispatch = useAppDispatch();
  const loading = useSelector(selectIsPresentationLoading);
  const { list, loadedFirstTime } = useSelector(selectPresentationsState);
  const authenticated = useSelector(selectIsAuthenticated);
  const [loadError, setLoadError] = useState(false);
  const [bundles, setBundles] = useState<BundleDto[]>([]);
  const [bundlesLoading, setBundlesLoading] = useState(true);
  const [bundlesError, setBundlesError] = useState(false);
  const [bundleRevision, setBundleRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setBundlesLoading(true);
    setBundlesError(false);
    getBundles().then(response => { if (active) setBundles(response.data); })
      .catch(() => { if (active) setBundlesError(true); })
      .finally(() => { if (active) setBundlesLoading(false); });
    return () => { active = false; };
  }, [bundleRevision]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("SORT_BY_DATE");
  const [searchParams, setSearchParams] = useSearchParams();
  const format = searchParams.get("format") === "bundles" ? "BUNDLE" : searchParams.get("format") === "workshops" ? PresentationService.WORKSHOP : searchParams.get("format") === "talks" ? PresentationService.TALK : "ALL";
  const setFormat = (value: string) => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous);
      if (value === "ALL") next.delete("format");
      else next.set("format", value === "BUNDLE" ? "bundles" : value === PresentationService.WORKSHOP ? "workshops" : "talks");
      return next;
    }, { replace: true });
  };
  const [day, setDay] = useState("ALL");
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    if (!loadedFirstTime) {
      dispatch(getAllPresentationsThunk()).then((result) =>
        setLoadError(result.meta.requestStatus === "rejected"),
      );
    }
  }, [dispatch, loadedFirstTime]);

  useEffect(() => {
    if (authenticated) dispatch(getCartThunk());
  }, [dispatch, authenticated]);

  const workshops = useMemo(() => list.map(toWorkshopItem), [list]);
  const bundleItems = useMemo(() => bundles.map(bundle => ({ bundle, members: bundle.presentations.map(toWorkshopItem) })), [bundles]);
  const visibleBundles = useMemo(() => bundleItems.filter(({ bundle, members }) =>
    (format === "ALL" || format === "BUNDLE") &&
    (day === "ALL" || members.some(member => member.day === day)) &&
    (!availableOnly || bundle.is_available) &&
    normalize([bundle.name, bundle.description, ...bundle.tags.map(tag => tag.fa_name || tag.name || tag.en_name), ...members.flatMap(member => [member.title, member.englishTitle, member.description, member.presenter, ...member.tags])].join(" ")).includes(normalize(search))
  ).sort((a, b) => {
    const availabilityOrder = Number(!a.bundle.is_available) - Number(!b.bundle.is_available);
    if (availabilityOrder) return availabilityOrder;
    if (sort === "SORT_BY_PRICE") return Number(a.bundle.price) - Number(b.bundle.price);
    if (sort === "SORT_BY_NAME") return a.bundle.name.localeCompare(b.bundle.name, "fa");
    const earliest = (members: typeof a.members) => members.map(member => member.start).sort()[0] || "";
    return earliest(a.members).localeCompare(earliest(b.members));
  }), [bundleItems, format, day, availableOnly, search, sort]);
  const days = useMemo(
    () => [
      ...new Map(
        [...workshops, ...bundleItems.flatMap(item => item.members)]
          .sort((a, b) => a.start.localeCompare(b.start))
          .map((item) => [item.day, item.dateLabel]),
      ).entries(),
    ],
    [workshops, bundleItems],
  );
  const visible = useMemo(
    () =>
      workshops
        .filter(
          (item) =>
            (format === "ALL" || item.service === format) &&
            (day === "ALL" || item.day === day) &&
            (!availableOnly ||
              (item.remaining > 0 && item.registrationActive)) &&
            normalize(
              [
                item.title,
                item.englishTitle,
                item.description,
                item.presenter,
                ...item.tags,
              ].join(" "),
            ).includes(normalize(search)),
        )
        .sort((a, b) => {
          const capacityOrder =
            Number(a.remaining === 0) - Number(b.remaining === 0);
          if (capacityOrder) return capacityOrder;
          if (sort === "SORT_BY_PRICE") return a.price - b.price;
          if (sort === "SORT_BY_NAME")
            return a.title.localeCompare(b.title, "fa");
          return a.start.localeCompare(b.start);
        }),
    [workshops, format, day, availableOnly, search, sort],
  );
  const isFiltered =
    search !== "" ||
    format !== "ALL" ||
    day !== "ALL" ||
    availableOnly ||
    sort !== "SORT_BY_DATE";

  return (
    <>
      <main className="min-h-dvh bg-text-white text-primary" dir="rtl">
        <Header />

        <section
          id="workshop-catalog"
          aria-labelledby="catalog-heading"
          className="mx-auto max-w-7xl scroll-mt-28 px-5 pb-20 pt-24 sm:px-8 sm:pt-32 lg:px-10"
        >
          <div className="relative mb-5 flex items-center justify-between gap-8 sm:mb-9">
            <div className="min-w-0">
              <h1 id="catalog-heading" className="text-3xl font-black leading-snug text-balance sm:text-5xl lg:text-6xl">
                چی دوست داری <span className="text-orange-ink">یاد بگیری؟</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-dark-gray sm:mt-4 sm:text-base sm:leading-7">
                ارائه‌ها و کارگاه‌ها رو ببین، از آدم‌ها یاد بگیر و خودت دست‌به‌کار شو.
              </p>
            </div>
            <img src={Penguin} alt="" aria-hidden="true" className="hidden w-44 shrink-0 -rotate-6 object-contain md:block lg:w-52" />
          </div>
          <h2 className="mb-5 text-2xl font-black sm:text-3xl">ارائه‌ها و کارگاه‌ها</h2>
          <WorkshopsFilter
            search={search}
            sort={sort}
            availableOnly={availableOnly}
            onSearch={setSearch}
            onSortSelect={setSort}
            onAvailabilityChange={setAvailableOnly}
          />
          <div className="my-4 flex flex-col gap-3 border-b border-primary/15 pb-4 sm:my-5 lg:flex-row lg:items-center lg:justify-between">
            <div
              className="flex flex-wrap gap-1"
              role="group"
              aria-label="نوع ارائه"
            >
              {formats.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={format === item.value}
                  onClick={() => setFormat(item.value)}
                  className={`min-h-11 rounded-lg px-3 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4 ${format === item.value ? "bg-primary text-white" : "text-dark-gray hover:bg-primary/5 hover:text-primary"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="روز برگزاری">
              {[["ALL", "همه روزها"], ...days].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={day === value}
                  onClick={() => setDay(value)}
                  className={`min-h-11 border-b-2 px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${day === value ? "border-secondary font-bold text-orange-ink" : "border-transparent text-dark-gray hover:text-primary"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p role="status" aria-live="polite" aria-atomic="true" className="mb-4 text-xs text-dark-gray sm:text-sm">
            {loading ? "در حال دریافت…" : loadError ? "دریافت انجام نشد" : format === "BUNDLE" ? `${digitsToPersian(visibleBundles.length.toString())} بسته` : `${digitsToPersian(visible.length.toString())} ارائه`}
          </p>
          {bundlesError && <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-primary/15 p-4">
            <p className="text-sm text-dark-gray">دریافت بسته‌ها انجام نشد.</p>
            <button type="button" onClick={() => setBundleRevision(value => value + 1)} className="min-h-11 rounded-lg px-3 text-sm font-bold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-primary">دریافت دوباره بسته‌ها</button>
          </div>}
          {loading && (
            <p role="status" className="py-16 text-center text-dark-gray">
              در حال دریافت ارائه‌ها…
            </p>
          )}
          {loadError && (
            <div role="alert" className="py-16 text-center">
              <h2 className="text-xl font-extrabold">
                دریافت ارائه‌ها انجام نشد.
              </h2>
              <p className="mt-3 text-sm text-dark-gray">
                اتصال اینترنت را بررسی کن و دوباره تلاش کن.
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoadError(false);
                  dispatch(getAllPresentationsThunk()).then((result) =>
                    setLoadError(result.meta.requestStatus === "rejected"),
                  );
                }}
                className="mt-6 rounded-lg bg-primary px-6 py-3 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dark-gray"
              >
                تلاش دوباره
              </button>
            </div>
          )}
          {format === "ALL" && !bundlesLoading && visibleBundles.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-y border-indigo/40 bg-indigo/10 px-4 py-3 text-sm sm:mb-5 sm:px-5">
              <p className="text-dark-gray"><span className="font-bold text-primary">{digitsToPersian(visibleBundles.length.toString())} بسته</span> برای انتخاب یک‌جا آماده است.</p>
              <button type="button" onClick={() => setFormat("BUNDLE")} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 font-bold text-orange-ink underline underline-offset-4 transition-colors hover:bg-secondary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                دیدن بسته‌ها
                <HiArrowLeft aria-hidden="true" className="size-4" />
              </button>
            </div>
          )}
          {format === "BUNDLE" && visibleBundles.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleBundles.map(({ bundle }) => <BundleCard key={`bundle-${bundle.id}`} bundle={bundle} compact onChanged={() => setBundleRevision(value => value + 1)} />)}
            </div>
          ) : format !== "BUNDLE" && visible.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((item) => <WorkshopCard key={item.id} item={item} />)}
            </div>
          ) : !loading && !bundlesLoading && !loadError && !bundlesError ? (
            <div className="flex flex-col items-center py-16 text-center">
              <HiMagnifyingGlass
                className="mb-4 size-10 text-dark-gray"
                aria-hidden="true"
              />
              <h2 className="text-xl font-extrabold">
                {isFiltered
                  ? "ارائه‌ای با این انتخاب پیدا نشد."
                  : "ارائه‌ها به‌زودی اینجا هستند."}
              </h2>
              <p className="mt-3 text-sm leading-7 text-dark-gray">
                {isFiltered
                  ? "عبارت جست‌وجو یا انتخاب‌ها رو تغییر بده."
                  : "برای دیدن ارائه‌های تازه، کمی بعد دوباره سر بزن."}
              </p>
              {!isFiltered && <button
                type="button"
                onClick={() => dispatch(getAllPresentationsThunk())}
                className="mt-6 rounded-lg bg-primary px-6 py-3 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dark-gray"
              >
                دریافت دوباره ارائه‌ها
              </button>}
            </div>
          ) : null}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WorkshopsList;
