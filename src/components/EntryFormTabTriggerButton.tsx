import { Tabs } from "radix-ui";

import { cn } from "../lib/utils";

export const EntryFormTabTriggerButton = (
  props: React.ComponentProps<typeof Tabs.Trigger>
) => (
  <Tabs.Trigger
    {...props}
    className={cn(
      "cursor-pointer text-sm p-2 font-bold",
      "border-b-2 border-transparent",
      "data-[state=active]:border-green-500",
      "data-[state=active]:text-green-500"
    )}
  />
);
