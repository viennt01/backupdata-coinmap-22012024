export default function IconLineTitle(props) {
  return (
    <svg
      width={128}
      height={3}
      viewBox="0 0 128 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <line
        x1="1.5"
        y1="1.5"
        x2="126.5"
        y2="1.49999"
        stroke="url(#paint0_linear_1_380)"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_1_380"
          x1="9.77778"
          y1="3.55405"
          x2="121.194"
          y2="31.1055"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#01C3FE" />
          <stop offset="0.994212" stopColor="#45FAC5" />
        </linearGradient>
      </defs>
    </svg>
  );
}