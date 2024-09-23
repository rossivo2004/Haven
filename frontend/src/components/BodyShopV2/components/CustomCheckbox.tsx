import { useCheckbox, Chip, VisuallyHidden, tv } from "@nextui-org/react";
import { CheckIcon } from "./CheckIcon ";
import { ReactNode } from "react";

interface CustomCheckboxProps {
  children?: ReactNode;
  isSelected?: boolean;
  isFocusVisible?: boolean;
  value: string; // Add value prop
}

const checkbox = tv({
  slots: {
    base: "border-default hover:bg-default-200 p-4",
    content: "text-default-500",
  },
  variants: {
    isSelected: {
      true: {
        base: "border-main bg-orange-200 hover:bg-orange-200 border-main hover:border-main",
        content: "text-primary-foreground pl-1",
      },
    },
    isFocusVisible: {
      true: {
        base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
      },
    },
  },
});

export const CustomCheckbox = (props: CustomCheckboxProps) => {
  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    ...props,
  });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} value={props.value} />
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        color="primary"
        endContent={isSelected ? <CheckIcon className="ml-1 font-bold  text-white rounded-lg" /> : null}
        variant="faded"
        {...getLabelProps()}
        ref={undefined} // Exclude the ref
      >
        {children ? children : isSelected ? "Enabled" : "Disabled"}
      </Chip>
    </label>
  );
};
