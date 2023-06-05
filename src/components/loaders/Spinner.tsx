const Spinner = () => {
  return (
    <div class="flex h-full w-full items-center justify-center">
      <svg class="h-20 w-20 animate-rotate" viewBox='0 0 50 50'>
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke-width="4"
          class="animate-dash fill-none stroke-primary-purple"
        />
      </svg>
    </div>
  );
}

export const FullPageSpinner = () => {
  return <div class="h-screen w-screen">
    <Spinner />
  </div>
}

export default Spinner;