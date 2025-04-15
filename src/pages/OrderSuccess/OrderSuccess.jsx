import React from "react";
import { WrapperInfo, WrapperLeft, WrapperRight } from "./style";

import { useLocation } from "react-router-dom";
import { orderContant } from "../../contant";
import { WrapperItemOrder } from "./style";

const OrderSuccess = () => {
  const location = useLocation();
  const { state } = location;
  return (
    <div style={{ background: "#f5f5ff", width: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: '8px',
            marginLeft: '100px',
            fontWeight: "700",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            display: "flex",
            gap: "12px",
          }}
        >
          Đơn hàng đã đặt thành công
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <div
              style={{
                padding: "24px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                maxWidth: "900px",
                margin: "0 auto",
              }}
            >
              <WrapperInfo style={{ fontWeight: "bold", marginBottom: "4px" }}>
                Phương thức giao hàng
              </WrapperInfo>
              <WrapperInfo
                style={{
                  backgroundColor: "#f0f6ff",
                  border: "1px solid #cce0ff",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                <div style={{ marginBottom: "8px" }}>
                  <span
                    style={{
                      color: "#ea8500",
                      fontWeight: "bold",
                      marginLeft: 6,
                    }}
                  >
                    {state?.deliveryMethod}
                  </span>
                  <span style={{ marginLeft: 6 }}>
                    {orderContant.dilivery[state?.deliveryMethod]}
                  </span>
                </div>
              </WrapperInfo>
              <div>
                <WrapperInfo
                  style={{ fontWeight: "bold", marginBottom: "4px" }}
                >
                  Phương thức thanh toán
                </WrapperInfo>
                <div
                  style={{
                    backgroundColor: "#f0f6ff",
                    border: "1px solid #cce0ff",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    <span
                      style={{
                        color: "#ea8500",
                        fontWeight: "bold",
                        marginLeft: 6,
                      }}
                    >
                      {state?.paymentMethod}
                    </span>
                    <span style={{ marginLeft: 6 }}>
                      {orderContant.payment[state?.paymentMethod]}
                    </span>
                  </div>
                </div>
              </div>
              <WrapperInfo>
                <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  Danh sách đã đặt hàng
                </div>
                {state.orders?.map((item) => {
                  return (
                    <WrapperItemOrder key={item.product}>
                      <div
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "390px",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <img
                          src={item?.image}
                          alt="product"
                          style={{
                            width: "77px",
                            height: "79px",
                            objectFit: "cover",
                          }}
                        />
                        <span>{item?.name}</span>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ color: "#242424" }}>
                          Số lượng: {item?.amount}
                        </span>
                        <span
                          style={{
                            fontWeight: 500,
                          }}
                        >
                          Giá tiền:{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(
                            (item?.price *
                              item?.amount *
                              (100 - item?.discount)) /
                              100
                          )}
                        </span>
                      </div>
                    </WrapperItemOrder>
                  );
                })}
                <div
                  style={{
                    color: "red",
                    marginTop: "12px",
                    marginBottom: "5px",
                    textAlign: "right", // ✅ căn phải
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  Tổng tiền:{" "}
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(state?.total)}
                </div>
              </WrapperInfo>
            </div>
          </WrapperLeft>
          <span
            style={{
              fontWeight: 500,
            }}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
