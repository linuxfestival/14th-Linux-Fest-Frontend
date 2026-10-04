import { HiMagnifyingGlass, HiArrowPath } from "react-icons/hi2";

export type Sort = "SORT_BY_DATE" | "SORT_BY_PRICE" | "SORT_BY_NAME";

interface Props {
  search: string;
  sort: Sort;
  availableOnly: boolean;
  isFiltered: boolean;
  onSearch: (value: string) => void;
  onSortSelect: (value: Sort) => void;
  onAvailabilityChange: (value: boolean) => void;
  onReset: () => void;
}

const WorkshopsFilter = ({
  search,
  sort,
  availableOnly,
  isFiltered,
  onSearch,
  onSortSelect,
  onAvailabilityChange,
  onReset,
}: Props) => (
  <div
    className="flex flex-col gap-4 rounded-xl bg-white p-5 sm:flex-row sm:flex-wrap sm:items-center"
    role="region"
    aria-label="جست‌وجو و فیلتر ارائه‌ها"
  >
    <div className="relative min-w-0 flex-1 sm:basis-64">
      <HiMagnifyingGlass
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-dark-gray"
      />
      <input
        type="search"
        aria-label="جست‌وجوی ارائه‌ها"
        placeholder="جست‌وجوی ارائه، موضوع یا مدرس…"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
        className="h-11 w-full rounded-lg border border-primary/15 bg-text-white pr-11 pl-4 text-sm text-primary placeholder:text-dark-gray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      />
    </div>
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <select
          aria-label="مرتب‌سازی"
          value={sort}
          onChange={(event) => onSortSelect(event.target.value as Sort)}
          className="h-11 rounded-lg border border-primary/15 bg-white px-3 text-sm text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <option value="SORT_BY_DATE">نزدیک‌ترین زمان</option>
          <option value="SORT_BY_PRICE">کمترین قیمت</option>
          <option value="SORT_BY_NAME">نام ارائه</option>
        </select>
      </div>
      <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-dark-gray">
        <input
          type="checkbox"
          checked={availableOnly}
          onChange={(event) => onAvailabilityChange(event.target.checked)}
          className="size-4 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        />
        فقط ظرفیت‌دار
      </label>
      {isFiltered && (
        <button
          type="button"
          onClick={onReset}
          aria-label="بازنشانی فیلترها"
          className="flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm text-dark-gray hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <HiArrowPath aria-hidden="true" className="size-4" />
          بازنشانی
        </button>
      )}
    </div>
  </div>
);

export default WorkshopsFilter;
