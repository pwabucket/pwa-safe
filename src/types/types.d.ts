export type DynamicAsProp<T extends React.ElementType> = {
  as?: T;
};

export type DynamicComponentProps<
  T extends React.ElementType,
  ExtraProps = object
> = DynamicAsProp<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ExtraProps | "as"> &
  ExtraProps & {
    ref?: React.Ref<React.ElementRef<T>>;
  };

export type DynamicComponent<
  DefaultComponent extends React.ElementType,
  ExtraProps = object
> = <T extends React.ElementType = DefaultComponent>(
  props: DynamicComponentProps<T, ExtraProps>
) => React.ReactElement | null;
