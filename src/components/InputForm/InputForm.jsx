import React from "react";

import { WrapperInputStyle } from "./stye";

const InputForm = (props) => {
  const { placeholder = "Nhap text", handleOnChange, ...rests } = props;

  const handleInputChange = (e) => {
    if (handleOnChange && typeof handleOnChange === "function") {
      handleOnChange(e.target.value);
    }
  };

  return (
    <div>
      <WrapperInputStyle
        placeholder={placeholder}
        value={props.value} 
        {...rests}
        onChange={handleInputChange}
      />
    </div>
  );
};


export default InputForm;
