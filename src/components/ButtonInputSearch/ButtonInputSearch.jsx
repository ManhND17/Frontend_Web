import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../InputComponent/InputComponent";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const ButtonInputSearch = (props) => {
  const {
    size,
    placeholder,
    textButton,
    bordered,
    backgroundColorInput = "#fff",
    backgroundColorButton = "rgb(13,92,182",
  } = props;
  return (
    <div style={{ display: "flex" }}>
      <InputComponent
        size={size}
        placeholder={placeholder}
        bordered={bordered}
        style={{
          backgroundColor: backgroundColorInput,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        }}
        {...props}
      />
      <ButtonComponent
        size={size}
        icon={<SearchOutlined style={{ color: "#fff" }} />}
        styleButton={{
          backgroundColor: backgroundColorButton,
          border: "none",
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        textButton={textButton}
        styletextButton={{ color: "#fff" }}
      />
    </div>
  );
};

export default ButtonInputSearch;
