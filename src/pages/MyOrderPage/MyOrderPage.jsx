import { useQuery } from "@tanstack/react-query";
import React from "react";
import * as OrderService from "../../services/OrderService";
import { useSelector } from "react-redux";
import { WrapperInfo} from "./style";
import { WrapperItemOrder } from "./style";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const MyOrderPage = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate()
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderbyUserId(
      user?.id,
      user?.access_token
    );
    return res.data.data;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: fetchMyOrder,
    retry: 3,
    retryDelay: 1000,
  });

  const { data} = queryOrder;

  const handelDeleteOrder = () =>{

  }

  return (
    <div
      style={{
        background: "#f5f5ff",
        width: "100%",
        minHeight: "100vh",
        paddingBottom: "50px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          padding: "20px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "700",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            marginBottom: "20px",
          }}
        >
          Đơn hàng của tôi
        </h2>

          <div
            style={{
              padding: "24px",
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              marginBottom: "24px",
              justifyContent: "center",
            }}
          >
            <WrapperInfo>
              {Array.isArray(data) &&
                data.map((order) => (
                  <div key={order._id} style={{ marginBottom: "32px" }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        marginBottom: "12px",
                        fontSize: "16px",
                        color: "#1890ff",
                      }}
                    >
                      Mã đơn hàng #{order._id} - Trạng thái:{" "}
                      <span style={{ color: "#52c41a" }}>
                        {order.status || "Chờ xử lý"}
                      </span>
                    </div>

                    {order.orderItems?.map((item, itemIndex) => (
                      <WrapperItemOrder key={itemIndex}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            width: "390px",
                          }}
                        >
                          <img
                            src={item?.image}
                            alt="product"
                            style={{
                              width: "77px",
                              height: "79px",
                              objectFit: "cover",
                              borderRadius: "6px",
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
                          <span>Số lượng: {item?.amount}</span>
                          <span style={{ fontWeight: 500 }}>
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
                    ))}

                    {/* ✅ Tổng tiền */}
                    <div
                      style={{
                        color: "red",
                        marginTop: "12px",
                        textAlign: "right",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      Tổng tiền:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(order?.totalPrice)}
                    </div>

                    {/* ✅ Nút thao tác */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "10px",
                        marginTop: "16px",
                      }}
                    >
                      <Button
                        type="primary"
                        onClick={()=>{
                          navigate('/order-detail',{
                            state: {
                              order: order,
                            }
                          })
                        }}
                      >
                        Xem chi tiết
                      </Button>
                      <Button
                        danger
                        onClick={handelDeleteOrder}
                      >
                        Hủy đơn hàng
                      </Button>
                    </div>

                    <hr style={{ marginTop: "24px", opacity: 0.2 }} />
                  </div>
                ))}
            </WrapperInfo>
          </div>
      </div>
    </div>
  );
};

export default MyOrderPage;
