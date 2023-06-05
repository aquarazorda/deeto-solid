import type { JSX } from "solid-js";

export function HomeRounded(props: JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M22 9L12 1L2 9v2h2v10h5v-4a3 3 0 1 1 6 0v4h5V11h2V9z"
      />
    </svg>
  );
}
