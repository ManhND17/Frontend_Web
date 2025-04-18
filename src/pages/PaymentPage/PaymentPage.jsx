import React, { useEffect, useMemo, useState } from "react";
import { Form } from "antd";
import { WrapperInfo, WrapperLeft, WrapperRight } from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  removeAllOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlide";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../components/Message/MessageProvider";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as OrderService from "../../services/OrderService";
import * as VoucherService from "../../services/VoucherService";
import { useLocation } from "react-router-dom";

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [deliveryMethod, setDeliveryMethod] = useState("FAST");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [voucherCode, setVoucherCode] = useState("");
  const [discountVoucher, setDiscountVoucher] = useState(0);
  const [voucherInfo, setVoucherInfo] = useState(null);

  const [form] = Form.useForm();
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
  });
  const dispatch = useDispatch();

  const { state } = useLocation();
  const listChecked = useMemo(() => {
    return state?.orderItemSlected || [];
  }, [state]);

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const navigate = useNavigate();
  const { success, error } = useMessage();

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked, dispatch]);


  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  const priceMemo = useMemo(() => {
    return order?.orderItems?.reduce((total, item) => {
      if (listChecked.includes(item.product)) {
        return total + (item.price * item.amount * (100 - item.discount)) / 100;
      }
      return total;
    }, 0);
  }, [order?.orderItems, listChecked]);

  const diliveryPriceMeno = useMemo(() => {
    if (priceMemo > 500000) {
      return 0;
    } else if (priceMemo === 0) {
      return 0;
    } else {
      return 30000;
    }
  }, [priceMemo]);
  const totalMeno = useMemo(() => {
    return priceMemo + diliveryPriceMeno;
  }, [priceMemo, diliveryPriceMeno]);
  const handleAddOrder = () => {
    console.log('first',user,order?.orderItemSlected )
    if (
      user?.access_token &&
      order?.orderItemSlected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemSlected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: paymentMethod,
        itemsPrice: priceMemo,
        shippingPrice: diliveryPriceMeno,
        totalPrice: totalMeno - discountVoucher,
        user: user?.id,
        VoucherCode: voucherCode,
        VoucherDiscount: discountVoucher,
      });
    }
  };

  const { isSuccess, data } = mutationAddOrder;
  useEffect(() => {
    console.log(data, isSuccess);

    if (data?.data?.status === "OK" && isSuccess) {
      dispatch(removeAllOrderProduct({ listChecked }));
      success("Đặt hàng thành công");
      navigate("/my-order", {
        state: {
          deliveryMethod,
          paymentMethod,
          orders: order?.orderItemSlected,
          total: totalMeno,
        },
      });
    } else if (isSuccess) {
      error(data?.data?.message);
    }
  }, [
    data,
    deliveryMethod,
    dispatch,
    error,
    isSuccess,
    listChecked,
    navigate,
    order?.orderItemSlected,
    paymentMethod,
    success,
    totalMeno,
  ]);

  const handleApplyVoucher = async () => {
    if (!voucherCode) {
      error("Vui lòng nhập mã giảm giá");
      return;
    }

    try {
      const res = await VoucherService.checkVoucher(voucherCode);
      const voucher = res.data;
      if (
        voucher &&
        priceMemo >= voucher.min_order_value &&
        new Date() >= new Date(voucher.start_date) &&
        new Date() <= new Date(voucher.end_date)
      ) {
        const discount = Math.min(
          (voucher.discount_percent / 100) * priceMemo,
          voucher.max_discount
        );
        setDiscountVoucher(discount);
        setVoucherInfo(voucher);
        success("Áp dụng mã giảm giá thành công!");
      } else {
        setDiscountVoucher(0);
        setVoucherInfo(null);
        error("Mã không hợp lệ hoặc không áp dụng cho đơn hàng này");
      }
    } catch (err) {
      setDiscountVoucher(0);
      setVoucherInfo(null);
      error("Không tìm thấy mã giảm giá");
    }
  };
  useEffect(() => {
    if (voucherCode.trim() === "") {
      setVoucherInfo(null);
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
                backgroundColor: "#ffffff", // Container nền trắng
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {/* Chọn phương thức giao hàng */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  Chọn phương thức giao hàng
                </div>
                <div
                  style={{
                    backgroundColor: "#f0f6ff",
                    border: "1px solid #cce0ff",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    <input
                      type="radio"
                      name="delivery"
                      value="FAST"
                      checked={deliveryMethod === "FAST"}
                      onChange={() => setDeliveryMethod("FAST")}
                    />
                    <span style={{ fontWeight: "bold", marginLeft: 6 }}>
                      FAST
                    </span>{" "}
                    Giao hàng tiết kiệm
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="delivery"
                      value="GO_JEK"
                      checked={deliveryMethod === "GO_JEK"}
                      onChange={() => setDeliveryMethod("GO_JEK")}
                    />
                    <span style={{ fontWeight: "bold", marginLeft: 6 }}>
                      GO_JEK
                    </span>{" "}
                    Giao hàng tiết kiệm
                  </div>
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
                      onChange={() => {
                        setPaymentMethod("VNPAY");
                      }}
                    />
                    <span style={{ marginLeft: 6 }}>Thanh toán bằng VnPay</span>
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
                          {new Date(voucherInfo.start_date).toLocaleDateString(
                            "vi-VN"
                          )} đến {new Date(voucherInfo.end_date).toLocaleDateString(
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
                    }).format(priceMemo + diliveryPriceMeno - discountVoucher)}
                  </span>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{ fontWeight: "bold" }}>{user?.address}</span>
                </div>
              </WrapperInfo>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "10px",
                }}
              >
                <ButtonComponent
                  onClick={handleAddOrder}
                  size={40}
                  border={false}
                  styleButton={{
                    background: "rgb(255,57,69)",
                    height: "48px",
                    width: "600px",
                    border: "none",
                    borderRadius: "4px",
                  }}
                  textButton={"Thanh toán"}
                  styletextButton={{
                    color: "#fff",
                    fontSize: "15px",
                    fontWeight: "700",
                  }}
                />
              </div>
            </div>
          </WrapperRight>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
