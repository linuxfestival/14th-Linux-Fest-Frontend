import { HiArrowLeft } from "react-icons/hi2";

const AuthSubmit = ({
  loading,
  children,
}: {
  loading: boolean;
  children: string;
}) => (
  <button
    type="submit"
    disabled={loading}
    aria-busy={loading}
    className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-secondary px-5 py-3 text-sm font-extrabold text-primary transition-colors hover:bg-[#e58210] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70"
  >
    {loading ? (
      <>
        <span
          aria-hidden="true"
          className="size-4 rounded-full border-2 border-primary/25 border-t-primary motion-safe:animate-spin"
        />
        <span role="status">در حال ارسال…</span>
      </>
    ) : (
      <>
        {children}
        <HiArrowLeft aria-hidden="true" className="size-4" />
      </>
    )}
  </button>
);

export default AuthSubmit;
