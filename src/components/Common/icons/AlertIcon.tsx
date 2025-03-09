
interface IconProps {
    color: string;
}

const AlertIcon = ({ ...props }: IconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.3938 13.558C9.3938 13.213 9.6738 12.928 10.0188 12.928C10.3638 12.928 10.6438 13.2038 10.6438 13.5488V13.558C10.6438 13.903 10.3638 14.183 10.0188 14.183C9.6738 14.183 9.3938 13.903 9.3938 13.558Z"
      fill={props.color}
    />
    <path
      d="M4.0089 17.0149H16.0772C17.0331 16.9649 17.7681 16.1508 17.7189 15.1949C17.7081 15.0016 17.6664 14.8108 17.5931 14.6324L11.5289 4.01909C11.0656 3.18159 10.0114 2.87825 9.1739 3.34242C8.8889 3.49909 8.6539 3.73409 8.4964 4.01909L2.43224 14.6324C2.07224 15.5191 2.4989 16.5291 3.38474 16.8899C3.56474 16.9624 3.75474 17.0041 3.94807 17.0149"
      stroke={props.color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.0065 11.1634V8.58008"
      stroke={props.color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AlertIcon;
