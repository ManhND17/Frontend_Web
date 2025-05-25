import React, { useEffect, useMemo, useState } from "react";
import { WrapperInfo, WrapperLeft, WrapperRight } from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../components/Message/MessageProvider";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as OrderService from "../../services/OrderService";
import * as VoucherService from "../../services/VoucherService";
import { useLocation } from "react-router-dom";
import * as CartService from "../../services/CartService";
import { useQueryClient } from "@tanstack/react-query";

const PaymentPage = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [voucherCode, setVoucherCode] = useState("");
  const [discountVoucher, setDiscountVoucher] = useState(0);
  const [voucherInfo, setVoucherInfo] = useState(null);

  const dispatch = useDispatch();
  const { state } = useLocation();
  const order = state?.orderItemSlected;
  const navigate = useNavigate();
  const { success, error } = useMessage();

  // Chuyển đổi đơn hàng sang định dạng phù hợp
  const updatedOrder = useMemo(() => {
    return order?.map(({ id, ...rest }) => ({
      ...rest,
      product: id,
    }));
  }, [order]);

  // Tính toán giá trị đơn hàng
  const priceMemo = useMemo(() => {
    if (!order || order.length === 0) return 0;
    return order.reduce((total, item) => {
      return total + item.price * item.amount * (1 - item.discount / 100);
    }, 0);
  }, [order]);

  const diliveryPriceMeno = useMemo(() => {
    if (priceMemo > 500000) return 0;
    if (priceMemo === 0) return 0;
    return 30000;
  }, [priceMemo]);

  const totalMeno = useMemo(() => {
    return priceMemo + diliveryPriceMeno;
  }, [priceMemo, diliveryPriceMeno]);

  // Mutation để tạo đơn hàng
  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    return OrderService.createOrder({ ...rests }, token);
  });

  // Xử lý tạo đơn hàng
  const handleAddOrder = async () => {
    if (!validateOrder()) return;
    try {
      setLoading(true);
      const orderData = {
        token: user?.access_token,
        orderItems: updatedOrder,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: paymentMethod,
        itemsPrice: priceMemo,
        shippingPrice: diliveryPriceMeno,
        totalPrice: Number(totalMeno - discountVoucher),
        user: user?.id,
        VoucherCode: voucherCode,
        VoucherDiscount: discountVoucher,
      };

      const data = await mutationAddOrder.mutateAsync(orderData);
      const productIds = order.map((item) => item.id);
      await CartService.deleteManyCart(user?.id, productIds);
      queryClient.invalidateQueries({ queryKey: ["Cart"] })
      await CartService.getCartbyUserId(user?.id);
      // Nếu là thanh toán VNPay, chuyển hướng đến trang thanh toán
      if (paymentMethod === "VNPAY") {
        const response = await OrderService.crecreateVNPayPaymentUrl(
          data.data.data,
        );
        if (response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          throw new Error("Không thể tạo URL thanh toán VNPay");
        }
        return;
      }

      // Xóa sản phẩm khỏi giỏ hàng
      success("Đặt hàng thành công");
      navigate("/my-order");
    } catch (err) {
      error(err.message || "Có lỗi xảy ra khi đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  const validateOrder = () => {
    if (!user?.access_token || !order || !priceMemo || !user?.id) {
      error("Thiếu thông tin đơn hàng");
      return false;
    }

    if (!user?.name || !user?.address || !user?.phone || !user?.city) {
      error("Vui lòng cập nhật đầy đủ thông tin giao hàng");
      return false;
    }

    return true;
  };
  
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      error("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const res = await VoucherService.checkVoucher(voucherCode);
      const voucher = res.data;

      if (
        !voucher ||
        priceMemo < voucher.min_order_value ||
        new Date() < new Date(voucher.start_date) ||
        new Date() > new Date(voucher.end_date)
      ) {
        throw new Error("Mã không hợp lệ hoặc không áp dụng cho đơn hàng này");
      }

      const discount = Math.min(
        (voucher.discount_percent / 100) * priceMemo,
        voucher.max_discount
      );

      setDiscountVoucher(discount);
      setVoucherInfo(voucher);
      success("Áp dụng mã giảm giá thành công!");
    } catch (err) {
      setDiscountVoucher(0);
      setVoucherInfo(null);
      error(err.message || "Không tìm thấy mã giảm giá");
    }
  };

  useEffect(() => {
    if (voucherCode.trim() === "") {
      setVoucherInfo(null);
      setDiscountVoucher(0);
    }
  }, [voucherCode]);

  return (
    <div style={{ background: "#f5f5ff", width: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3>Thanh toán</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <div
              style={{
                padding: "24px",
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  Sản phẩm đã chọn ({order.length})
                </div>
                <div
                  style={{
                    backgroundColor: "#f0f6ff",
                    border: "1px solid #cce0ff",
                    padding: "12px",
                    borderRadius: "8px",
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {order.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 0",
                        borderBottom:
                          index < order.length - 1 ? "1px solid #e8e8e8" : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 500 }}>{item.name}</div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            Số lượng: {item.amount}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "bold" }}>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(
                            (item.price * item.amount * (100 - item.discount)) /
                              100
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  Chọn phương thức thanh toán
                </div>
                <div
                  style={{
                    backgroundColor: "#f0f6ff",
                    border: "1px solid #cce0ff",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                    />
                    <span style={{ marginLeft: 6 }}>
                      Thanh toán tiền mặt khi nhận hàng
                    </span>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="payment"
                      value="VNPAY"
                      checked={paymentMethod === "VNPAY"}
                      onChange={() => setPaymentMethod("VNPAY")}
                    />
                    <span style={{ marginLeft: 6 }}>
                      Thanh toán bằng VNPay
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "16px", marginTop: "8px" }}>
                  <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                    Phí giao hàng
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}></div>
                  <div
                    style={{
                      backgroundColor: "#f0f6ff",
                      border: "1px solid #cce0ff",
                      padding: "12px",
                      borderRadius: "8px",
                    }}
                  >
                    <div style={{ margin: "8px 0" }}>
                      Phí giao hàng:{" "}
                      <span style={{ fontWeight: "normal" }}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(diliveryPriceMeno)}
                      </span>
                    </div>
                    <div
                      style={{
                        marginBottom: 16,
                        color: "#52c41a",
                        fontSize: 13,
                      }}
                    >
                      Mua sản phẩm trên 500.000đ sẽ được miễn phí ship
                    </div>
                  </div>
                </div>

                <div style={{ margin: "16px 0" }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    Mã giảm giá
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <InputComponent
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="nhập mã..."
                      name="voucher"
                    />
                    <ButtonComponent
                      textButton="Áp dụng"
                      onClick={handleApplyVoucher}
                      styleButton={{
                        padding: "0 16px",
                        background: "#1677ff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: 600,
                        height: 40,
                      }}
                    />
                  </div>

                  {voucherInfo && (
                    <div
                      style={{
                        backgroundColor: "#f0f6ff",
                        border: "1px solid #cce0ff",
                        padding: "12px 16px",
                        borderRadius: 8,
                        lineHeight: 1.6,
                        fontSize: 14,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span>
                          <span>Giảm: </span>
                          {voucherInfo.discount_percent}%
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span>
                          <span>Giá trị đơn hàng tối thiểu:</span>{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(voucherInfo.min_order_value)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span>
                          <span>Số tiền tối đa được giảm:</span>{" "}
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(voucherInfo.max_discount)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <span>
                          <span>Thời gian áp dụng:</span>{" "}
                          {new Date(
                            voucherInfo.start_date
                          ).toLocaleDateString("vi-VN")}{" "}
                          đến{" "}
                          {new Date(voucherInfo.end_date).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </WrapperLeft>
          <WrapperRight>
            <div style={{ width: "100%" }}>
              <WrapperInfo>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      color: "rgb(36,36,36)",
                      fontWeight: 400,
                      fontSize: "13px",
                    }}
                  >
                    Tạm tính
                  </span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(priceMemo)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      color: "rgb(36,36,36)",
                      fontWeight: 400,
                      fontSize: "13px",
                    }}
                  >
                    Giảm giá từ voucher
                  </span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(discountVoucher)}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      color: "rgb(36,36,36)",
                      fontWeight: 400,
                      fontSize: "13px",
                    }}
                  >
                    Phí giao hàng
                  </span>
                  <span
                    style={{
                      color: "#000",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(diliveryPriceMeno)}
                  </span>
                </div>
              </WrapperInfo>

              <WrapperInfo>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      color: "rgb(36,36,36)",
                      fontWeight: 400,
                      fontSize: "13px",
                    }}
                  >
                    Tổng tiền
                  </span>
                  <span
                    style={{
                      color: "rgb(236, 13, 13)",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      priceMemo + diliveryPriceMeno - discountVoucher
                    )}
                  </span>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{ fontWeight: "bold" }}>{user?.address}</span>
                </div>
              </WrapperInfo>
              <ButtonComponent
                onClick={handleAddOrder}
                disabled={loading}
                styleButton={{
                  background: "rgb(255,57,69)",
                  height: "48px",
                  width: "100%",
                  border: "none",
                  borderRadius: "4px",
                  opacity: loading ? 0.7 : 1,
                }}
                textButton={loading ? "Đang xử lý..." : "Đặt hàng"}
                styletextButton={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "700",
                }}
              />
            </div>
          </WrapperRight>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;