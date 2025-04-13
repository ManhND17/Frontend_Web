import { createContext, useContext } from "react";
import { message } from "antd";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const success = (content = "This is a success message") => {
    messageApi.open({ type: "success", content });
  };
  const notification = (content = "This is a success message") => {
    messageApi.open({ type: "notification", content });
  };
  const error = (content = "This is an error message") => {
    messageApi.open({ type: "error", content });
  };

  const warning = (content = "This is a warning message") => {
    messageApi.open({ type: "warning", content });
  };

  return (
    <MessageContext.Provider value={{ success, error, warning,notification }}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
