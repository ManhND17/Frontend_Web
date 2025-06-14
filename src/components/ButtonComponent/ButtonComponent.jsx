import React from "react";
import { Button } from "antd";

const ButtonComponent = ({
  size,
  textButton,
  styletextButton,
  styleButton,
  disabled,
  ...rests
}) => {
  return (
    <Button size={size} disabled={disabled} style={{ 
      ...styleButton,
       }} {...rests}>
      <span style={styletextButton}>{textButton}</span>
    </Button>
  );
};

export default ButtonComponent;
