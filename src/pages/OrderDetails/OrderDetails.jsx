import React from "react";
import { WrapperInfo, WrapperLeft } from "./style";
import { useLocation } from "react-router-dom";
import { orderContant } from "../../contant";
import { WrapperItemOrder } from "./style";

const OrderSuccess = () => {
  const location = useLocation();
  const { state } = location;
  const { order } = state;

  return (
    <div
      style={{ background: "#f5f5ff", minHeight: "100vh", padding: "40px 0" }}
    >
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "24px",
            fontWeight: "700",
          }}
        >
          Chi tiết đơn hàng
        </h2>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <div
              style={{
                padding: "24px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <WrapperInfo style={{ marginBottom: "16px" }}>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Mã đơn hàng:{" "}
                  <span style={{ fontWeight: "normal" }}>{order._id}</span>
                </div>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Trạng thái đơn hàng:{" "}
                  <span style={{ fontWeight: "normal" }}>{order.status}</span>
                </div>
              </WrapperInfo>

              <div style={{ marginBottom: "24px" }}>
                <WrapperInfo
                  style={{ fontWeight: "bold", marginBottom: "8px" }}
                >
                  Phương thức thanh toán
                </WrapperInfo>
                <div
                  style={{
                    backgroundColor: "#f0f6ff",
                    border: "1px solid #cce0ff",
                    padding: "12px",
                    borderRadius: "8px",
                    fontSize: "15px",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "4px",
                      color: "#ea8500",
                      fontWeight: "600",
                    }}
                  >
                    {order?.paymentMethod}
                  </div>
                  <div>{orderContant.payment[order?.paymentMethod]}</div>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <WrapperInfo
                  style={{ fontWeight: "bold", marginBottom: "8px" }}
                >
                  Thông tin giao hàng
                </WrapperInfo>
                <div
                  style={{
                    backgroundColor: "#f0f6ff",
                    border: "1px solid #cce0ff",
                    padding: "12px",
                    borderRadius: "8px",
                    fontSize: "15px",
                    lineHeight: "1.6",
                  }}
                >
                  <div>👤 Tên người nhận: {order.shippingAddress.fullName}</div>
                  <div>
                    🏠 Địa chỉ: {order.shippingAddress.address},{" "}
                    {order.shippingAddress.city}
                  </div>
                  <div>📞 Số điện thoại: {order.shippingAddress.phone}</div>
                </div>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <WrapperInfo
                  style={{ fontWeight: "bold", marginBottom: "8px" }}
                >
                  Mã giảm giá
                </WrapperInfo>
                <div
                  style={{
                    backgroundColor: "#f0f6ff",
                    border: "1px solid #cce0ff",
                    padding: "16px",
                    borderRadius: "8px",
                    fontSize: "15px",
                    lineHeight: "1.8",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ marginBottom: "4px" }}>
                      <span style={{ fontWeight: "600", color: "#333" }}>
                        Mã:{" "}
                      </span>
                      <span style={{ fontStyle: "italic", color: "#1677ff" }}>
                        {order.VoucherCode|| "Không có"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontWeight: "600", color: "#333" }}>
                      Giảm:{" "}
                    </span>
                    <span style={{ color: "#d4380d", fontWeight: "bold" }}>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order.VoucherDiscount)}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <WrapperInfo
                  style={{ fontWeight: "bold", marginBottom: "12px" }}
                >
                  Danh sách sản phẩm đã đặt
                </WrapperInfo>
                {order?.orderItems.map((item) => (
                  <WrapperItemOrder
                    key={item.product}
                    style={{ marginBottom: "16px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <img
                        src={item?.image}
                        alt="product"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #eee",
                        }}
                      />
                      <div>
                        <div style={{ fontWeight: 500 }}>{item?.name}</div>
                        <div>Số lượng: {item?.amount}</div>
                        <div style={{ fontWeight: 500, marginTop: "4px" }}>
                          Giá:{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(
                            (item?.price *
                              item?.amount *
                              (100 - item?.discount)) /
                              100
                          )}
                        </div>
                      </div>
                    </div>
                  </WrapperItemOrder>
                ))}
              </div>

              <div
                style={{
                  textAlign: "right",
                  fontSize: "16px",
                  marginBottom: "8px",
                }}
              >
                <span style={{ color: "black" }}>
                  Phí giao hàng:{" "}
                  <strong style={{ color: "#ea8500" }}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order?.shippingPrice)}
                  </strong>
                </span>
              </div>

              <div
                style={{
                  textAlign: "right",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                Tổng tiền:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order?.totalPrice)}
              </div>
            </div>
          </WrapperLeft>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
