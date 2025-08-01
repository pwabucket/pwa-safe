export type DynamicComponentProps<T extends React.ElementType, ExtraProps> = {
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | keyof ExtraProps> &
  ExtraProps;

export type DynamicComponent<
  DefaultComponent extends React.ElementType,
  ExtraProps = object
> = <T extends React.ElementType = DefaultComponent>(
  props: DynamicComponentProps<T, ExtraProps>
) => React.ReactElement | null;
