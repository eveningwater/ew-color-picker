import ewColorPickerBoxPlugin from ".";

export interface BoxProps {
  width?: string | number;
  height?: string | number;
  defaultColor: string;
  container: HTMLElement;
  boxNoColorIcon: string;
  boxHasColorIcon: string;
  onClick: (v: InstanceType<typeof ewColorPickerBoxPlugin>) => void;
  disabled?: boolean;
  readonly?: boolean;
  className?: string;
  style?: string | Record<string, string>;
  onMouseEnter?: (v: InstanceType<typeof ewColorPickerBoxPlugin>) => void;
  onMouseLeave?: (v: InstanceType<typeof ewColorPickerBoxPlugin>) => void;
}

export type PartialBoxProps = Partial<BoxProps>;
