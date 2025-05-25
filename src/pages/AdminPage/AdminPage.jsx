import React, { useState } from "react";
import { Menu, Layout, Typography } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  GiftOutlined,
  BarChartOutlined,
  StarOutlined,
  MessageOutlined,
} from "@ant-design/icons";

import HeaderComponent from "../../components/HeaderComponent/HeaderComponent";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import AdminOrder from "../../components/AdminOrder/AdminOrder";
import AdminVoucher from "../../components/AdminVoucher/AdminVoucher";
import AdminStatistics from "../../components/AdminStatistics/AdminStatistics";
import AdminReview from "../../components/AdminReview/AdminReview";
import AdminChat from "../../components/AdminChat/AdminChat";

const { Sider, Content } = Layout;
const { Title } = Typography;

const AdminPage = () => {
  const items = [
    { label: "Người dùng", key: "user", icon: <UserOutlined /> },
    { label: "Sản phẩm", key: "product", icon: <AppstoreOutlined /> },
    { label: "Đơn hàng", key: "order", icon: <OrderedListOutlined /> },
    { label: "Đánh giá", key: "review", icon: <StarOutlined /> },
    { label: "Voucher", key: "voucher", icon: <GiftOutlined /> },
    { label: "Thống kê", key: "statistics", icon: <BarChartOutlined /> },
    { label: "Nhắn tin", key: "chat", icon: <MessageOutlined /> },
  ];

  const [selectedKey, setSelectedKey] = useState("user");
  const [collapsed, setCollapsed] = useState(false);

  const renderPage = () => {
    switch (selectedKey) {
      case "user": return <AdminUser />;
      case "product": return <AdminProduct />;
      case "order": return <AdminOrder />;
      case "voucher": return <AdminVoucher />;
      case "statistics": return <AdminStatistics />;
      case "review": return <AdminReview />;
      case "chat": return <AdminChat />;
      default: return <></>;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={260}
          style={{
            background: "#fff",
            boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
            borderRight: "1px solid #f0f0f0",
          }}
        >
          <div
            style={{
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "start",
              padding: "0 24px",
              fontWeight: "bold",
              fontSize: 22,
              color: "#1890ff",
              borderBottom: "1px solid #f0f0f0",
              userSelect: "none",
            }}
          >
            {!collapsed && "Admin Panel"}
          </div>
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={({ key }) => setSelectedKey(key)}
            items={items}
            style={{
              borderRight: "none",
              fontSize: 16,
              fontWeight: 500,
            }}
          />
        </Sider>

        <Layout style={{ padding: 24, background: "#f5f7fa" }}>
          <Content
            style={{
              background: "#fff",
              padding: 24,
              margin: 0,
              minHeight: 480,
              borderRadius: 12,
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              overflow: 'hidden'
            }}
          >
            <Title level={3} style={{ marginBottom: 24, fontWeight: 700 }}>
              {items.find((item) => item.key === selectedKey)?.label}
            </Title>
            {renderPage()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
