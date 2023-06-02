import { Popover } from "@kobalte/core";
import { BellRounded } from "~/assets/icons/BellRounded";
import { SettingsGear } from "~/assets/icons/SettingsGear";
import Avatar from "../../../avatar";
import { useI18n } from "~/env/i18n";
import { MenuItem } from "./MenuItem";
import Settings from "./items/Settings";

type Props = {
  anchorRef?: () => HTMLDivElement | undefined;
};

export default function ProspectMenu(props: Props) {
  const [t] = useI18n();

  return (
    <div class="flex flex-col gap-6">
      <div class="flex w-full justify-center">
        <img
          class="w-20"
          src="https://deeto-images-dev.s3.us-east-1.amazonaws.com/deetoPhotoUploads-127dd5ea-33d2-4efb-b80a-d51780aa8942"
        />
      </div>
      <div class="flex flex-col items-center gap-6 rounded-no-left-top bg-white p-2 pt-4 shadow-lg">
        <Popover.Root>
          <Popover.Trigger class="flex w-full flex-col items-center gap-1 text-primary-purple">
            <BellRounded class="h-8 w-8" />{" "}
            <span class="text-sm font-semibold">Notifications</span>
          </Popover.Trigger>
        </Popover.Root>
        <MenuItem
          anchorRef={props.anchorRef}
          label={t.SETTINGS()}
          title={t.MY_PROFILE()}
          icon={<SettingsGear class="h-8 w-8" />}
        >
          <Settings />``
        </MenuItem>
        <Avatar />
      </div>
    </div>
  );
}
