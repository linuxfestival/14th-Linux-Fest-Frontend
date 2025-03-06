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
    className={`flex items-center justify-start w-full py-3 px-4 text-white text-sm font-medium rounded-lg ${className}`}
  >
    <span className="mr-3">{icon}</span>
    <span>{label}</span>
  </button>
);

export default SidebarButton;
