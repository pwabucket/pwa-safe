import Borders from "../components/Borders";
import type { DynamicComponentProps } from "../types/types";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { cn } from "../lib/utils";
import useButtonClick from "../hooks/useButtonClick";
import { useNavigateBack } from "@pwabucket/pwa-router";
import { useRef } from "react";

export function HeaderButton<T extends React.ElementType = "button">({
  as,
  icon,
  ...props
}: DynamicComponentProps<T> & {
  icon: React.ElementType;
}) {
  const Component = as || "button";
  const Icon = icon;
  const ref = useRef<Element | null>(null);

  useButtonClick(ref);

  return (
    <Component
      {...props}
      ref={ref}
      className={cn(
        "group",
        "cursor-pointer outline-none",
        "relative text-green-300",
        "flex justify-center items-center size-10",
        props.className,
      )}
    >
      <Borders
        className={cn(
          "size-2 border-transparent",
          "group-hover:border-green-500",
          "group-focus:border-green-500",
        )}
      />
      <Icon className="size-5" />
    </Component>
  );
}

export function HeaderReturnButton(
  props: Omit<React.ComponentProps<typeof HeaderButton>, "icon">,
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
