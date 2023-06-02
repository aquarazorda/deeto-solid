import { Popover } from "@kobalte/core";
import { createSignal, type JSX } from "solid-js";
import { CloseIcon } from "~/assets/icons/CloseIcon";

type Props = {
  anchorRef?: () => HTMLDivElement | undefined;
  label: string;
  title: string;
  icon: JSX.Element;
  children: JSX.Element;
};

export const MenuItem = (props: Props) => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <Popover.Root anchorRef={props.anchorRef} placement="top-start" overlap onOpenChange={setIsOpen}>
      <Popover.Trigger class="flex w-full flex-col items-center gap-1 text-primary-purple transition-colors" classList={{
        'text-primary-yellow': isOpen()
      }}>
        {props.icon}
        <span class="text-sm font-semibold">{props.label}</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content class="h-screen origin-left animate-contentHide pb-14 pt-10 ui-expanded:animate-contentShow">
          <div class="h-full rounded-no-left-top bg-white p-9">
            <Popover.Title class="flex items-center justify-between">
              <h5 class="text-2xl font-semibold text-primary-purple">
                {props.title}
              </h5>
              <Popover.Trigger class="rounded-full p-4 shadow-lg">
                <CloseIcon class="h-6 w-6 text-primary-purple" />
              </Popover.Trigger>
            </Popover.Title>
            {props.children}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
