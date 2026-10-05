import { useEffect, useId, useState } from "react";
import { HiCamera } from "react-icons/hi2";
import defaultAvatar from "../../../../assets/images/pinguin.webp";
const AvatarInput = ({
  url,
  onChange,
  disabled = false,
}: {
  url: string;
  onChange: (file: File) => void;
  disabled?: boolean;
}) => {
  const id = useId();
  const [file, setFile] = useState<File>();
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!file) return;
    const value = URL.createObjectURL(file);
    setPreview(value);
    return () => URL.revokeObjectURL(value);
  }, [file]);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <img
        src={preview || url || defaultAvatar}
        alt="تصویر پروفایل"
        className="size-20 rounded-full border border-primary/10 bg-indigo/15 object-cover"
      />
      <div className="min-w-0">
        <input
          id={id}
          type="file"
          accept="image/*"
          disabled={disabled}
          aria-label="انتخاب تصویر پروفایل"
          className="peer sr-only"
          onChange={(event) => {
            const selected = event.target.files?.[0];
            if (selected) {
              setFile(selected);
              onChange(selected);
            }
          }}
        />
        <label
          htmlFor={id}
          className={`inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/20 px-4 text-sm font-bold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-indigo/15"}`}
        >
          <HiCamera aria-hidden="true" className="size-5" />
          تغییر تصویر
        </label>
        <p className="mt-2 max-w-60 break-all text-xs leading-6 text-dark-gray">
          {file?.name || "تصویر دلخواهتان را انتخاب کنید."}
        </p>
      </div>
    </div>
  );
};
export default AvatarInput;
