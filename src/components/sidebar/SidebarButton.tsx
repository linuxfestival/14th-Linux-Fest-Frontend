import clsx from "clsx";

interface SidebarButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  className?: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  label,
  icon,
  onClick,
  active,
  className,
}) => (
  <button
    onClick={onClick}
    className={clsx(
      "flex h-14 w-full px-2 rounded-[14px] gap-[10px] items-center justify-start py-2 text-white text-[16px] cursor-pointer transition-all font-bold",
      className,
      { ["bg-[#5A162A] shadow-[0_0_5px_#FA175C]"]: active }
    )}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </button>
);

export default SidebarButton;
