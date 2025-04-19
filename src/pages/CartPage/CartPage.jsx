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
import { selectedOrder } from "../../redux/slides/orderSlide";
import { useNavigate } from "react-router-dom";
import { useMessage } from "../../components/Message/MessageProvider";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { Loading } from "../../components/LoadingComponent/Loading";
import { updateUser } from "../../redux/slides/UserSlide";
import * as CartService from "../../services/CartService";
import { useQuery } from "@tanstack/react-query";

const CartPage = () => {
  const [form] = Form.useForm();
  const [isOpenModal, setIsModalOpen] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    address: "",
    phone: "",
    city: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error } = useMessage();
  const user = useSelector((state) => state.user);

  const getAllCart = async () => {
    const res = await CartService.getCartbyUserId(user?.id);
    return res;
  };

  const { data: orderData, refetch } = useQuery({
    queryKey: ["Cart"],
    queryFn: getAllCart,
    retry: 3,
    retryDelay: 1000,
  });

  const orderItems = useMemo(() => orderData?.data?.data || [], [orderData]);
  const [listChecked, setListChecked] = useState([]);
  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rest } = data;
    return UserService.updateUser(id, rest, token);
  });

  const { isLoading = false } = mutationUpdate;

  const onChange = (e, index) => {
    const { checked } = e.target;
    setListChecked((prev) => {
      const updated = [...prev];
      updated[index] = checked;
      return updated;
    });
  };
  useEffect(() => {
    if (orderItems.length > 0) {
      setListChecked(new Array(orderItems.length).fill(false));
    }
  }, [orderItems]);

  const handleChangeCount = async (type, productId, currentAmount) => {
    let newAmount = currentAmount;
    if (type === "increment") {
      newAmount = currentAmount + 1;
    } else if (type === "decrement" && currentAmount > 1) {
      newAmount = currentAmount - 1;
    } else {
      return;
    }

    try {
      await CartService.updateCartAmount(user?.id, productId, newAmount);
      refetch();
    } catch (err) {
      console.error("Cập nhật số lượng thất bại:", err);
      error("Không thể cập nhật số lượng sản phẩm. Vui lòng thử lại.");
    }
  };

  const handleDeleteOrder = async (id) => {
    await CartService.deleteCart(user?.id, id);
    refetch();
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [dispatch, listChecked]);

  useEffect(() => {
    if (isOpenModal) {
      setStateUserDetails({
        name: user?.name || "",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
      });
    }
  }, [isOpenModal, user]);

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  const priceMemo = useMemo(() => {
    return orderItems.reduce((total, item, index) => {
      if (listChecked[index]) {
        return total + (item.price * item.amount * (100 - item.discount)) / 100;
      }
      return total;
    }, 0);
  }, [orderItems, listChecked]);

  const priceDiscount = useMemo(() => {
    return orderItems.reduce((total, item, index) => {
      if (listChecked[index]) {
        return total + (item.price * item.amount * item.discount) / 100;
      }
      return total;
    }, 0);
  }, [orderItems, listChecked]);

  const deliveryPriceMemo = useMemo(() => {
    return priceMemo > 500000 || priceMemo === 0 ? 0 : 30_000;
  }, [priceMemo]);

  const handleAddCart = () => {
    const hasSelectedProduct = listChecked.some(checked => checked);
    
    if (!hasSelectedProduct) {
      error("Vui lòng chọn ít nhất một sản phẩm trước khi mua hàng!");
      return;
    }
  
    if (!user?.phone || !user?.address || !user?.name) {
      setIsModalOpen(true);
    } else {
      navigate("/payment", { 
        state: { 
          orderItemSlected: orderItems.filter((_, index) => listChecked[index]) 
        } 
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
      setIsModalOpen(false);
      success("Cập nhật thông tin thành công!");
      dispatch(updateUser({ ...user, ...stateUserDetails }));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleOnchangeDetails = (e) => {
    const { name, value } = e.target;
    setStateUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ background: "#f5f5ff", width: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3>Giỏ hàng</h3>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <WrapperLeft>
            <WrapperStyleHeader>
              <span style={{ display: "inline-block", width: "390px" }}>
                Tất cả ({orderItems.length} sản phẩm)
              </span>
              <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
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

            {orderItems.map((item, index) => (
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
                    onChange={(e) => onChange(e, index)}
                    value={item.product}
                  />
                  <img
                    src={item.image}
                    alt="product"
                    style={{ width: 77, height: 79, objectFit: "cover" }}
                  />
                  <div>{item.name}</div>
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
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
                    }).format(item.price)}
                  </span>
                  <WrapperCountOrder
                    style={{ width: "18%", textAlign: "center" }}
                  >
                    <button
                      onClick={() =>
                        handleChangeCount("decrement", item.id, item.amount)
                      }
                      style={{ border: "none", background: "transparent" }}
                    >
                      <MinusOutlined
                        style={{ color: "#000", fontSize: "14px" }}
                      />
                    </button>
                    <WrapperInputNumber
                      value={item.amount}
                      size="small"
                      controls={false}
                    />
                    <button
                      onClick={() =>
                        handleChangeCount("increment", item.id, item.amount)
                      }
                      style={{ border: "none", background: "transparent" }}
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
                    -{item.discount}%
                  </span>
                  <span
                    style={{
                      color: "rgb(255,66,78)",
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
                      (item.price * item.amount * (100 - item.discount)) / 100
                    )}
                  </span>
                  <DeleteOutlined
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDeleteOrder(item.id)}
                  />
                </div>
              </WrapperItemOrder>
            ))}
          </WrapperLeft>

          <WrapperRight>
            <div style={{ width: "100%" }}>
              <WrapperInfo
                style={{
                  padding: 16,
                  borderRadius: 8,
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  marginBottom: 20,
                }}
              >
                <div
                  className="flex-space-between"
                  style={{
                    marginBottom: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#555" }}>
                    Tạm tính
                  </span>
                  <span
                    style={{
                      fontWeight: 500,
                      minWidth: 150, // Cố định chiều rộng tối thiểu
                      textAlign: "right",
                      fontFeatureSettings: '"tnum"', // Hiển thị số monospaced
                    }}
                  >
                    {priceMemo.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
                <div
                  className="flex-space-between"
                  style={{
                    marginBottom: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#555" }}>
                    Giảm giá
                  </span>
                  <span
                    style={{
                      fontWeight: 500,
                      minWidth: 150,
                      textAlign: "right",
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    -
                    {priceDiscount.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
                <div
                  className="flex-space-between"
                  style={{
                    borderBottom: "1px solid #eee",
                    paddingBottom: 12,
                    marginBottom: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: 500, color: "#555" }}>
                    Phí giao hàng
                  </span>
                  <span
                    style={{
                      fontWeight: 500,
                      minWidth: 150,
                      textAlign: "right",
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    {deliveryPriceMemo.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
                <div
                  className="flex-space-between"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: "bold" }}>
                    Tổng tiền
                  </span>
                  <span
                    style={{
                      color: "#ec0d0d",
                      fontSize: 18,
                      fontWeight: "bold",
                      minWidth: 150,
                      textAlign: "right",
                      fontFeatureSettings: '"tnum"',
                    }}
                  >
                    {(priceMemo + deliveryPriceMemo).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
              </WrapperInfo>

              {/* Các phần còn lại giữ nguyên */}
              <WrapperInfo style={{ marginBottom: 12 }}>
                <div>
                  Địa chỉ: <strong>{user?.address}</strong>
                </div>
              </WrapperInfo>

              <WrapperInfo style={{ marginBottom: 20 }}>
                <span
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    color: "#1677ff",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  Cập nhật thông tin giao hàng
                </span>
              </WrapperInfo>

              <div className="flex-center" style={{ margin: 10 }}>
                <ButtonComponent
                  onClick={handleAddCart}
                  size={40}
                  border={false}
                  styleButton={{
                    background: "#ff3945",
                    height: 48,
                    width: "100%",
                    maxWidth: 300,
                    border: "none",
                    borderRadius: 8,
                  }}
                  textButton="Mua hàng"
                  styletextButton={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                />
              </div>
            </div>
          </WrapperRight>
        </div>
      </div>

      {/* Modal cập nhật thông tin */}
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModal}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Loading isLoading={isLoading}>
          <Form form={form} layout="vertical">
            <Form.Item
              label="Tên khách hàng"
              name="name"
              rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
            >
              <InputComponent
                name="name"
                value={stateUserDetails.name}
                onChange={handleOnchangeDetails}
              />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: "Vui lòng nhập SĐT!" }]}
            >
              <InputComponent
                name="phone"
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
              />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <InputComponent
                name="address"
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
              />
            </Form.Item>
            <Form.Item
              label="Tỉnh"
              name="city"
              rules={[{ required: true, message: "Vui lòng nhập tỉnh!" }]}
            >
              <InputComponent
                name="city"
                value={stateUserDetails.city}
                onChange={handleOnchangeDetails}
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </div>
  );
};

export default CartPage;
