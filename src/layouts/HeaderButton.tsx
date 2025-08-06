import { HiOutlineArrowLeft } from "react-icons/hi2";

import Borders from "../components/Borders";
import useNavigateBack from "../hooks/useNavigateBack";
import type { DynamicComponentProps } from "../types/types";
import { cn } from "../lib/utils";

export function HeaderButton<T extends React.ElementType = "button">({
  as,
  icon,
  ...props
}: DynamicComponentProps<T> & {
  icon: React.ElementType;
}) {
  const Component = as || "button";
  const Icon = icon;

  return (
    <Component
      {...props}
      className={cn(
        "group",
        "cursor-pointer outline-none",
        "relative text-green-300",
        "flex justify-center items-center size-10",
        props.className
      )}
    >
      <Borders
        className={cn(
          "size-2 border-transparent",
          "group-hover:border-green-500",
          "group-focus:border-green-500"
        )}
      />
      <Icon className="size-5" />
    </Component>
  );
}

export function HeaderReturnButton(
  props: Omit<React.ComponentProps<typeof HeaderButton>, "icon">
) {
  const navigateBack = useNavigateBack();

  return (
    <HeaderButton
      {...props}
      onClick={() => navigateBack()}
      icon={HiOutlineArrowLeft}
    />
  );
}
