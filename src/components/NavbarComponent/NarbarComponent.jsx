import React from "react";
import { WrapperContent, WrapperLableText, WrapperTextValue } from "./style";
import { Checkbox, Rate } from "antd";

const NarbarComponent = () => {
  const onChange = () => {};
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option) => {
          return <WrapperTextValue>{option}</WrapperTextValue>;
        });
      case "checkbox":
        return (
          <Checkbox.Group
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
            onChange={onChange}
          >
            {options.map((option) => {
              return <Checkbox value={option.value}>{option.label}</Checkbox>;
            })}
          </Checkbox.Group>
        );

      case "star":
        return options.map((option) => {
          return (
            <div style={{display:'flex'}}>
              <Rate
                style={{
                  fontSize: "12px",
                }}
                disabled
                defaultValue={option}
              />
              <span> {option} sao</span>
            </div>
          );
        });

      default:
        return {};
    }
  };
  return (
    <div>
      <WrapperLableText>Loại sản phẩm</WrapperLableText>
      <WrapperContent>
        {renderContent("text", ["Nike", "JD1", "ADIDAS"])}
      </WrapperContent>
    </div>
  );
};

export default NarbarComponent;
