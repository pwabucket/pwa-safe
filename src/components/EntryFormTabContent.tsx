import { Tabs } from "radix-ui";

export const EntryFormTabContent = (
  props: React.ComponentProps<typeof Tabs.Content>
) => (
  <Tabs.Content {...props} className="flex flex-col gap-4">
    {props.children}
  </Tabs.Content>
);
