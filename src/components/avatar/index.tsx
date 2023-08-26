type Props = {
  firstName: string;
  lastName: string;
}

export default function Avatar(props: Props) {
  return (
    <div class="flex h-20 min-w-[5rem] cursor-pointer items-center justify-center rounded-no-left-top bg-primary-yellow hover:opacity-80">
      <span class="font-sans text-2xl font-medium uppercase text-primary-purple">{props.firstName[0]}{props.lastName[0]}</span>
    </div>
  );
}
