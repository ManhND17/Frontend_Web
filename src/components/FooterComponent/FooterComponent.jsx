import React from "react";
import { Row, Col } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import QR from "../../assets/images/QR-Code.png";

const Footer = () => {
  return (
    <div>
      <footer
        style={{
          background: "#f9f9f9",
          padding: "32px 120px",
          borderTop: "1px solid #ddd",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Row gutter={[32, 16]} align="top" justify="space-between">
          <Col span={12}>
            <h3 style={{ marginBottom: "16px", color: "#1a1a1a" }}>
              CỬA HÀNG GIÀY THỂ THAO SNEAKER - NDM SHOP
            </h3>
            <p>
              <EnvironmentOutlined style={{ marginRight: 8 }} />
              Địa chỉ: 77 Trung Văn, Nam Từ Liêm, Hà Nội
            </p>
            <p>
              <PhoneOutlined style={{ marginRight: 8 }} />
              Hotline: 0978123872
            </p>
            <p>
              <MailOutlined style={{ marginRight: 8 }} />
              Email: ndmshop123@gmail.com
            </p>
            <p>
              <FacebookOutlined style={{ marginRight: 8 }} />
              Facebook:{" "}
              <a href="https://www.facebook.com/sfdsf/" target="_blank" rel="noreferrer">
                NDM Shop
              </a>
            </p>
          </Col>

          <Col span={6} style={{ textAlign: "center" }}>
            <img src={QR} alt="QR Zalo" width={100} />
            <p style={{ marginTop: 8, fontSize: 14 }}>Quét mã để kết nối ZALO</p>
          </Col>

          <Col span={6} style={{ textAlign: "center" }}>
            <img src={QR} alt="QR Facebook" width={100} />
            <p style={{ marginTop: 8, fontSize: 14 }}>Quét mã để kết nối FACEBOOK</p>
          </Col>
        </Row>
      </footer>

      <div
        style={{
          background: "#fff",
          textAlign: "center",
          padding: "12px 0",
          fontSize: 14,
          color: "#666",
        }}
      >
        © 2025 by <strong>GiayNDM.vn</strong>. All Rights Reserved.
      </div>
    </div>
  );
};

export default Footer;
