import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { HiMagnifyingGlass } from "react-icons/hi2";
import Penguin from "../../assets/images/pinguin.webp";
import { digitsToPersian } from "../../utils/digitsToPersian";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
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
  // { label: "پکیج‌ها", value: PresentationService.PACKAGE },
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
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("SORT_BY_DATE");
  const [format, setFormat] = useState("ALL");
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
  const days = useMemo(
    () => [
      ...new Map(
        [...workshops]
          .sort((a, b) => a.start.localeCompare(b.start))
          .map((item) => [item.day, item.dateLabel]),
      ).entries(),
    ],
    [workshops],
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
            {loading ? "در حال دریافت…" : loadError ? "دریافت انجام نشد" : `${digitsToPersian(visible.length.toString())} ارائه`}
          </p>
          {loading ? (
            <p role="status" className="py-16 text-center text-dark-gray">
              در حال دریافت ارائه‌ها…
            </p>
          ) : loadError ? (
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
          ) : visible.length ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((item) => (
                <WorkshopCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
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
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WorkshopsList;
