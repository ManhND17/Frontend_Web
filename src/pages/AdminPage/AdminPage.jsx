import React, { useState } from "react";
import { Menu } from "antd";
import { getItem } from "../../utils";
import {
  UserOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminOrder from "../../components/AdminOrder/AdminOrder";

const AdminPage = () => {
  const items = [
    getItem("Người dùng", "user", <UserOutlined />),
    getItem("Sản phẩm", "product", <AppstoreOutlined />),
    getItem("Đơn hàng", "order", <OrderedListOutlined />),
  ];

  const [selectedKey, setSelectedKey] = useState("user"); 
  const [openKeys, setOpenKeys] = useState(["user"]); 

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.length ? keys[keys.length - 1] : null;
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  const renderPage = () => {
    switch (selectedKey) {
      case "user":
        return <AdminUser />;
      case "product":
        return <AdminProduct />;
      case "order":
        return <AdminOrder />;
      default:
        return <></>;
    }
  };
  
  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: "flex" }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]} 
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onClick={handleMenuClick} 
          style={{
            width: 256,
            boxShadow: "1px 1px 2px #ccc",
            minHeight: "calc(100vh - 64px)",
          }}
          items={items}
        />
        <div style={{ flex: 1, padding: "15px" }}>{renderPage()}</div>
      </div>
    </>
  );
};

export default AdminPage;
