import React from "react";
import { Row, Col } from "antd";
import QR from "../../assets/images/QR-Code.png";

const Footer = () => {
  return (
    <div>
    <footer style={{background: "#efefef",justifyContent:"center",padding:'0 120px',border:'1px solid #cccc',paddingRight:'0' }}>
      <Row gutter={[16, 16]} style={{gap:'10px',paddingTop:'10px'}}>
        <Col span={8}>
          <h3>CỬA HÀNG GIÀY THỂ THAO SNEAKER - NDM SHOP</h3>
          <p>Địa chỉ: 77 Trung Văn, Nam Từ Liêm, Hà Nội </p>
          <p>Hotline: 0978123872</p>
          <p>Email: ndmshop123@gmail.com</p>
          <p>
            Facebook: <a href="https://www.facebook.com/sfdsf/">NDM Shop</a>
          </p>
        </Col>
        <Col span={2.5} >
          <img src={QR} alt="QR Zalo" width={100} />
          <p>MÃ QR ZALO</p>
        </Col>
        <Col span={2.5}>
          <img src={QR} alt="QR Facebook" width={100} />
          <p>MÃ QR FACEBOOK</p>
        </Col>
      </Row>
    </footer>
    <Row  style={{ border:'1px solid #cccc',borderRight:'none',justifyContent:'center',background:'#ffff' }}>
    <p>Copyright © 2025 by GiayNDM.vn . All Rights Reserved.</p>
    </Row>
    </div>
  );
};

export default Footer;
