import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Result, Button } from "antd";
import { useSelector } from "react-redux";
import * as OrderService from "../../services/OrderService";

const PaymentResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const status = query.get("status");
  const orderId = query.get("orderId");
  const amount = query.get("amount");
  const reason = query.get("reason") || "Không rõ lý do";

  const user = useSelector((state) => state.user);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId || !user?.access_token) return;

    const fetchOrder = async () => {
      try {
        const res = await OrderService.getOrderbyOrderId(orderId, user.access_token);
        let data = res.data.data;
        // Nếu data là mảng, lấy phần tử đầu tiên
        if (Array.isArray(data)) {
          data = data[0] || null;
        }
        setOrder(data);
      } catch (err) {
        console.error("Fetch order lỗi:", err);
      }
    };

    fetchOrder();
  }, [orderId, user?.access_token]);

  const handleBackHome = () => {
    if (order) {
      navigate("/order-detail", { state: { order } });
    } else {
      navigate("/");
    }
  };

  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <Result
            status="success"
            title="Thanh toán thành công!"
            subTitle={`Mã đơn hàng: ${orderId} | Số tiền: ${Number(amount).toLocaleString("vi-VN")} VND`}
            extra={[
              <Button type="primary" onClick={handleBackHome} key="view">
                Xem chi tiết đơn hàng
              </Button>,
            ]}
          />
        );
      case "fail":
        return (
          <Result
            status="error"
            title="Thanh toán thất bại"
            subTitle={`Lý do: ${decodeURIComponent(reason)}`}
            extra={[
              <Button type="primary" onClick={handleBackHome} key="retry">
                Thử lại
              </Button>,
            ]}
          />
        );
      default:
        return (
          <Result
            status="warning"
            title="Lỗi xử lý kết quả thanh toán"
            subTitle="Vui lòng liên hệ bộ phận hỗ trợ nếu sự cố tiếp diễn."
            extra={[
              <Button type="primary" onClick={handleBackHome} key="home">
                Về trang chủ
              </Button>,
            ]}
          />
        );
    }
  };

  return <div style={{ padding: 40 }}>{renderContent()}</div>;
};

export default PaymentResultPage;
