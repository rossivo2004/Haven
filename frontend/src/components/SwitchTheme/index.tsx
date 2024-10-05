import {Switch, useSwitch, VisuallyHidden, SwitchProps} from "@nextui-org/react";
import {MoonIcon} from "./MoonIcon";
import {SunIcon} from "./SunIcon";

const ThemeSwitch = (props: SwitchProps) => {
  const {
    Component, 
    slots, 
    isSelected, 
    getBaseProps, 
    getInputProps, 
    getWrapperProps
  } = useSwitch(props);

  return (
    <div className="flex flex-col gap-2">
      <Component {...getBaseProps()}>
          <VisuallyHidden>
            <input {...getInputProps()} />
          </VisuallyHidden>
          <div
            {...getWrapperProps()}
            className={slots.wrapper({
              class: [
                "bg-transparent",
                "w-8 h-8",
                "flex items-center justify-center",
                "rounded-lg hover:bg-default-200",
              ],
            })}
          >
            {isSelected ? <SunIcon/> : <MoonIcon/>}
          </div>
      </Component>
      {/* <p className="text-default-500 select-none">Lights: {isSelected ? "on" : "off"}</p> */}
    </div>
  )
}


export default function ThemeSwitchBtn() {
  return <ThemeSwitch/>
}