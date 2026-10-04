import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { HiMagnifyingGlass } from "react-icons/hi2";
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
  { label: "کارگاه ها", value: PresentationService.WORKSHOP },
  { label: "ارائه ها", value: PresentationService.TALK },
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
  const reset = () => {
    setSearch("");
    setSort("SORT_BY_DATE");
    setFormat("ALL");
    setDay("ALL");
    setAvailableOnly(false);
  };
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
          className="mx-auto max-w-7xl scroll-mt-28 px-6 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10"
        >
          <WorkshopsFilter
            search={search}
            sort={sort}
            availableOnly={availableOnly}
            onSearch={setSearch}
            onSortSelect={setSort}
            onAvailabilityChange={setAvailableOnly}
            onReset={reset}
            isFiltered={sort !== "SORT_BY_DATE" || availableOnly}
          />
          <div className="my-5 flex flex-col gap-4 border-b border-primary/15 pb-5 lg:flex-row lg:items-center lg:justify-between">
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="نوع ارائه"
            >
              {formats.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={format === item.value}
                  onClick={() => setFormat(item.value)}
                  className={`min-h-11 rounded-lg px-4 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${format === item.value ? "bg-primary text-white" : "text-dark-gray hover:bg-primary/5 hover:text-primary"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="روز برگزاری"
            >
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
          {loading ? (
            <p role="status" className="py-16 text-center text-dark-gray">
              در حال دریافت ارائه‌ها…
            </p>
          ) : loadError ? (
            <div role="alert" className="py-16 text-center">
              <h3 className="text-xl font-extrabold">
                دریافت ارائه‌ها انجام نشد.
              </h3>
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
              <h3 className="text-xl font-extrabold">
                {isFiltered
                  ? "ارائه‌ای با این انتخاب پیدا نشد."
                  : "ارائه‌ها به‌زودی اینجا هستند."}
              </h3>
              <p className="mt-3 text-sm leading-7 text-dark-gray">
                {isFiltered
                  ? "یک عبارت دیگر جست‌وجو کن یا فیلترها را بردار."
                  : "برای دیدن ارائه‌های تازه، کمی بعد دوباره سر بزن."}
              </p>
              <button
                type="button"
                onClick={
                  isFiltered ? reset : () => dispatch(getAllPresentationsThunk())
                }
                className="mt-6 rounded-lg bg-primary px-6 py-3 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dark-gray"
              >
                {isFiltered ? "پاک کردن فیلترها" : "دریافت دوباره ارائه‌ها"}
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WorkshopsList;
