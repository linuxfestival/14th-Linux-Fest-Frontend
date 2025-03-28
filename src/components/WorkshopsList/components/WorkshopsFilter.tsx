import React, { useState } from "react";
import { FaSortNumericDownAlt } from "react-icons/fa";
import { MdOutlineFilterAltOff, MdOutlineSort } from "react-icons/md";

export type Sort = "SORT_BY_DATE" | "SORT_BY_PRICE" | "SORT_BY_NAME";

interface Props {
  onSortSelect: (sortType: Sort) => void;
  onSearch: (searchText: string) => void;
  onReset: () => void;
}

const WorkshopsFilter = ({ onSortSelect, onSearch, onReset }: Props) => {
  const [selectedSort, setSelectedSort] = useState<Sort>("SORT_BY_DATE");
  const [searchText, setSearchText] = useState("");

  const handleReset = () => {
    setSearchText("");
    onSearch("");
    onSortSelect("SORT_BY_DATE");
    setSelectedSort("SORT_BY_DATE");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    onSearch(e.target.value);
  };

  const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as Sort;
    onSortSelect(selected);
    setSelectedSort(selected);
    console.log("!@ salm");
  };

  return (
    <div className="w-full flex justify-between items-center bg-[#2C2C2C] rounded-full px-8 py-4 select-none">
      <div className="flex items-center gap-2 relative">
        <MdOutlineSort size={24} className="cursor-pointer" />
        <select
          onChange={handleSortSelect}
          value={selectedSort}
          className="pr-4 pl-2 py-2 rounded-full border-2 border-white/10 bg-[#2C2C2C] text-white outline-none cursor-pointer appearance-none"
        >
          <option
            value="SORT_BY_DATE"
            className="bg-[#2C2C2C] text-white border-0"
          >
            ترتیب بر اساس زمان
          </option>
          <option
            value="SORT_BY_PRICE"
            className="bg-[#2C2C2C] text-white border-0"
          >
            ترتیب بر اساس قیمت
          </option>
          <option
            value="SORT_BY_NAME"
            className="bg-[#2C2C2C] text-white border-0"
          >
            ترتیب بر اساس نام
          </option>
        </select>
      </div>

      <input
        type="text"
        placeholder="جست و جو ..."
        className="px-4 py-2 rounded-full border-2 border-white/10 w-1/2 outline-none"
        onChange={handleSearch}
        value={searchText}
      />

      <MdOutlineFilterAltOff
        size={24}
        className="cursor-pointer"
        onClick={handleReset}
      />
    </div>
  );
};

export default WorkshopsFilter;
