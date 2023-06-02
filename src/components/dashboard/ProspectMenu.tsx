import { Popover } from "@kobalte/core";
import { BellRounded } from "~/assets/icons/BellRounded";
import { SettingsGear } from "~/assets/icons/SettingsGear";
import Avatar from "../avatar";
import { CloseIcon } from "~/assets/icons/CloseIcon";
import { Portal } from 'solid-js/web';

export default function ProspectMenu() {
  return (
    <div class="flex flex-col gap-6">
      <div class="w-full flex justify-center">
        <img
          class="w-20"
          src="https://deeto-images-dev.s3.us-east-1.amazonaws.com/deetoPhotoUploads-127dd5ea-33d2-4efb-b80a-d51780aa8942"
        />
      </div>
      <div class="flex flex-col items-center gap-6 rounded-no-left-top bg-white p-2 pt-4 shadow-lg">
        <Popover.Root>
          <Popover.Trigger class="flex flex-col w-full items-center text-primary-purple gap-1">
            <BellRounded class="w-8 h-8" />{" "}
            <span class="text-sm font-semibold">Notifications</span>
          </Popover.Trigger>
        </Popover.Root>
        <Popover.Root>
          <Popover.Trigger class="flex flex-col w-full items-center text-primary-purple gap-1">
            <SettingsGear class="w-8 h-8" />{" "}
            <span class="text-sm font-semibold">Settings</span>
          </Popover.Trigger>
          <Portal>
            <Popover.Content class="w-screen h-screen z-10">
              <Popover.Title class="flex justify-evenly">
                Settings <CloseIcon />
              </Popover.Title>
            </Popover.Content>
          </Portal>
        </Popover.Root>
        <Avatar />
      </div>
    </div>
  );
}
