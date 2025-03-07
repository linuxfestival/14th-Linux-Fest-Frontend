interface SidebarButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  label,
  icon,
  onClick,
  className,
}) => (
  <button
    onClick={onClick}
    className={`flex h-14 w-full px-2 rounded-[14px] gap-[10px] items-center justify-start py-2 text-white text-[16px] font-light ${className}`}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </button>
);

export default SidebarButton;
