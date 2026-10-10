import { useState } from "react";
import { HiMagnifyingGlass, HiAdjustmentsHorizontal, HiChevronDown } from "react-icons/hi2";

export type Sort = "SORT_BY_DATE" | "SORT_BY_PRICE" | "SORT_BY_NAME";

interface Props {
  search: string;
  sort: Sort;
  availableOnly: boolean;
  onSearch: (value: string) => void;
  onSortSelect: (value: Sort) => void;
  onAvailabilityChange: (value: boolean) => void;
}

const WorkshopsFilter = ({ search, sort, availableOnly, onSearch, onSortSelect, onAvailabilityChange }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const secondaryActive = sort !== "SORT_BY_DATE" || availableOnly;
  const selectClass = "h-11 w-full min-w-0 rounded-lg border border-primary/15 bg-white px-3 text-sm text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

  return (
    <div role="region" aria-label="جست‌وجو و فیلتر ارائه‌ها" className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-0 flex-1 basis-40 lg:basis-64">
        <HiMagnifyingGlass aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-dark-gray" />
        <input type="search" aria-label="جست‌وجوی ارائه‌ها" placeholder="موضوع یا ارائه‌دهنده…" value={search} onChange={(event) => onSearch(event.target.value)} className="h-12 w-full min-w-0 rounded-xl border border-primary/20 bg-white pr-11 pl-4 text-base text-primary caret-orange-ink placeholder:text-dark-gray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
      </div>
      <button type="button" aria-expanded={expanded} aria-controls="catalog-filters" onClick={() => setExpanded(!expanded)} className={`inline-flex min-h-12 items-center gap-2 rounded-lg px-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden ${secondaryActive ? "bg-primary text-white" : "bg-indigo/20 text-primary"}`}>
        <HiAdjustmentsHorizontal className="size-5" aria-hidden="true" />
        فیلترها
        <HiChevronDown aria-hidden="true" className={`size-4 transition-transform motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`} />
      </button>
      <div id="catalog-filters" className={`${expanded ? "flex" : "hidden"} w-full flex-wrap items-end gap-3 rounded-xl bg-indigo/10 p-4 lg:flex lg:w-auto lg:flex-1 lg:items-center lg:bg-transparent lg:p-0`}>
        <label className="min-w-0 flex-1 basis-36 text-xs font-bold text-dark-gray lg:basis-36">
          <span className="mb-1.5 block lg:sr-only">مرتب‌سازی</span>
          <select value={sort} onChange={(event) => onSortSelect(event.target.value as Sort)} className={selectClass}>
            <option value="SORT_BY_DATE">نزدیک‌ترین زمان</option>
            <option value="SORT_BY_PRICE">کمترین قیمت</option>
            <option value="SORT_BY_NAME">نام ارائه</option>
          </select>
        </label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm text-dark-gray">
          <input type="checkbox" checked={availableOnly} onChange={(event) => onAvailabilityChange(event.target.checked)} className="size-4 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
          فقط ظرفیت‌دار
        </label>
      </div>
    </div>
  );
};

export default WorkshopsFilter;
