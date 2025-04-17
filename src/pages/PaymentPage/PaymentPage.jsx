import React, { useEffect, useMemo, useState } from "react";
import { Form } from "antd";
import { WrapperInfo, WrapperLeft, WrapperRight } from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { removeAllOrderProduct, selectedOrder } from "../../redux/slides/orderSlide";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../components/Message/MessageProvider";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import * as OrderService from "../../services/OrderService";
import { Loading } from "../../components/LoadingComponent/Loading";
import { updateUser } from "../../redux/slides/UserSlide";
import { useLocation } from "react-router-dom";

const PaymentPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [deliveryMethod, setDeliveryMethod] = useState("FAST");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [form] = Form.useForm();
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
  });
  const dispatch = useDispatch();
  const { state } = useLocation();
  const listChecked = state?.orderItemSlected || [];
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, rests, token);
    return res;
  });

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const { isLoading = false } = mutationUpdate;
  const navigate = useNavigate()
  const { success, error } = useMessage();

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked, dispatch]);

  useEffect(() => {
    if (isOpenModal) {
      setStateUserDetails({
        ...stateUserDetails,
        city: user?.city,
        name: user?.name,
        phone: user?.phone,
        address: user?.address,
      });
    }
  }, [isOpenModal]);

  const handleChangeAddress = () => {
    setIsModalOpen(true);
  };

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

  const priceDicount = useMemo(() => {
    return order?.orderItems?.reduce((total, item) => {
      if (listChecked.includes(item.product)) {
        return total + (item.price * item.amount * item.discount) / 100;
      }
      return total;
    }, 0);
  }, [order?.orderItems, listChecked]);

  const diliveryPriceMeno = useMemo(() => {
    if (priceMemo > 2000000) {
      return 0;
    } else if (priceMemo === 0) {
      return 0;
    } else {
      return 10000;
    }
  }, [priceMemo]);
  const totalMeno = useMemo(() => {
    return priceMemo + diliveryPriceMeno;
  }, [priceMemo, diliveryPriceMeno]);
  const handleAddOrder = () => {
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
      mutationAddOrder.mutate(
        {
          token: user?.access_token,
          orderItems: order?.orderItemSlected,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          city: user?.city,
          paymentMethod: paymentMethod,
          itemsPrice: priceMemo,
          shippingPrice: diliveryPriceMeno,
          totalPrice: totalMeno,
          user: user?.id,
        },
      );
    }
  };

  const {isSuccess,data} = mutationAddOrder;
  useEffect(() => {
    console.log(data,isSuccess);
  
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
  }, [data]);
  
  const handleOk = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate({
        id: user?.id,
        token: user?.access_token,
        ...stateUserDetails,
      });
      success("Cập nhật thông tin thành công!");
      setIsModalOpen(false);
      dispatch(updateUser({ ...user, ...stateUserDetails }));
    }
  };
  const handleCancel = () => {
    setStateUserDetails({
      name: "",
      address: "",
      phone: "",
      city: "",
    });
    form.resetFields();
    setIsModalOpen(false);
  };
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
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
                        checked={paymentMethod === "VnPay"}
                        onChange={() => {
                          setPaymentMethod("VnPay");
                        }}
                      />
                      <span style={{ marginLeft: 6 }}>
                        Thanh toán bằng VnPay
                      </span>
                    </div>
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
                      Giảm giá
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
                      }).format(priceDicount)}
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
                      }).format(priceMemo + diliveryPriceMeno)}
                    </span>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div>
                    <span>Địa chỉ: </span>
                    <span style={{ fontWeight: "bold" }}>{user?.address}</span>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <span
                    onClick={handleChangeAddress}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    Cập nhật thông tin giao hàng
                  </span>
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
                    onClick={() => {
                      handleAddOrder();
                    }}
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
        <ModalComponent
          title="Cập nhật thông tin giao hàng"
          open={isOpenModal}
          onCancel={handleCancel}
          onOk={handleOk}
        >
          <Loading isLoading={isLoading}>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              autoComplete="off"
              form={form}
            >
              <Form.Item
                label="Tên khách hàng"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.name}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                ]}
              >
                <InputComponent
                  value={stateUserDetails.phone}
                  onChange={handleOnchangeDetails}
                  name="phone"
                />
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <InputComponent
                  value={stateUserDetails.address}
                  onChange={handleOnchangeDetails}
                  name="address"
                />
              </Form.Item>
              <Form.Item
                label="Tỉnh"
                name="city"
                rules={[{ required: true, message: "Vui lòng nhập tỉnh!" }]}
              >
                <InputComponent
                  value={stateUserDetails.city}
                  onChange={handleOnchangeDetails}
                  name="city"
                />
              </Form.Item>
              <Form.Item
                wrapperCol={{ span: 24 }}
                style={{ textAlign: "right" }}
              ></Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
    </div>
  );
};

export default PaymentPage;
