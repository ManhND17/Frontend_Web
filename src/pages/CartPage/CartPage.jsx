import React, { useEffect, useMemo, useState } from "react";
import { Checkbox, Form } from "antd";
import {
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperRight,
  WrapperStyleHeader,
} from "./style";
import { PlusOutlined, MinusOutlined, DeleteOutlined } from "@ant-design/icons";
import { WrapperInputNumber } from "../../components/ProductDetailsComponents/style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  decreaseAmount,
  increaseAmount,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlide";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../components/Message/MessageProvider";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { Loading } from "../../components/LoadingComponent/Loading";
import { updateUser } from "../../redux/slides/UserSlide";

const CartPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, rests, token);
    return res;
  });
  const { isLoading = false } = mutationUpdate;
  const navigate = useNavigate();
  const { success, error } = useMessage();

  const [listChecked, setListChecked] = useState([]);
  const dispatch = useDispatch();
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleChangeCount = (type, idProduct) => {
    if (type === "increment") {
      dispatch(increaseAmount(idProduct));
    } else {
      dispatch(decreaseAmount(idProduct));
    }
  };

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct(idProduct));
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [dispatch,listChecked]);

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
  }, [isOpenModal,stateUserDetails, 
    user?.address, 
    user?.city, 
    user?.name, 
    user?.phone]);

  const handleChangeAddress = () => {
    setIsModalOpen(true);
  };
  useEffect(() => {});
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
    if (priceMemo > 1000000) {
      return 0;
    } else if (priceMemo === 0) {
      return 0;
    } else {
      return 30000;
    }
  }, [priceMemo]);

  const handleAddCart = () => {
    if (!order?.orderItemSlected?.length) {
      error("Chọn sản phẩm trước khi thanh toán!");
    } else if (!user?.phone || !user?.address || !user?.name) {
      setIsModalOpen(true);
    } else {
      navigate("/payment", {
        state: { orderItemSlected: listChecked },
      });
    }
  };
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
        <h3>Giỏ hàng</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: "390px" }}>
                <span>Tất cả ({order?.orderItems?.length} sản phẩm)</span>
              </span>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span style={{ width: "10%", textAlign: "center" }}>
                  Đơn giá
                </span>
                <span style={{ width: "35%", textAlign: "center" }}>
                  Số lượng
                </span>
                <span style={{ width: "15%", textAlign: "center" }}>
                  Giảm giá
                </span>
                <span style={{ width: "40%", textAlign: "center" }}>
                  Thành tiền
                </span>
              </div>
            </WrapperStyleHeader>
            <div>
              {order?.orderItems?.map((item) => {
                return (
                  <WrapperItemOrder key={item.product}>
                    <div
                      style={{
                        width: "390px",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Checkbox
                        onChange={onChange}
                        value={item.product}
                      ></Checkbox>
                      <img
                        src={item?.image}
                        alt="product"
                        style={{
                          width: "77px",
                          height: "79px",
                          objectFit: "cover",
                        }}
                      />
                      <div>{item?.name}</div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        <span
                          style={{
                            fontSize: "13px",
                            color: "#242424",
                            width: "25%",
                            textAlign: "center",
                          }}
                        >
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item?.price)}
                        </span>
                      </span>
                      <WrapperCountOrder
                        style={{ width: "18%", textAlign: "center" }}
                      >
                        <button
                          style={{ border: "none", background: "transparent" }}
                          onClick={() =>
                            handleChangeCount("decrement", item.product)
                          }
                        >
                          <MinusOutlined
                            style={{ color: "#000", fontSize: "14px" }}
                          />
                        </button>
                        <WrapperInputNumber
                          onChange={onChange}
                          defaultValue={1}
                          value={item?.amount}
                          size="small"
                          controls={false}
                        ></WrapperInputNumber>
                        <button
                          style={{ border: "none", background: "transparent" }}
                          onClick={() =>
                            handleChangeCount("increment", item.product)
                          }
                        >
                          <PlusOutlined
                            style={{ color: "#000", fontSize: "14px" }}
                          />
                        </button>
                      </WrapperCountOrder>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#242424",
                          width: "20%",
                          textAlign: "center",
                        }}
                      >
                        -{item?.discount}%
                      </span>
                      <span
                        style={{
                          color: "rgb(255,66,78",
                          fontSize: "13px",
                          fontWeight: 500,
                          width: "20%",
                          textAlign: "center",
                        }}
                      >
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
                      <DeleteOutlined
                        style={{ sursor: "pointer" }}
                        onClick={() => {
                          handleDeleteOrder(item?.product);
                        }}
                      />
                    </div>
                  </WrapperItemOrder>
                );
              })}
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
                    handleAddCart();
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
                  textButton={"Mua hàng"}
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

export default CartPage;
