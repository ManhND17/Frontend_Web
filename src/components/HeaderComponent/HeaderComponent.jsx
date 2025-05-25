import React, { useState, useEffect, useMemo } from "react";
import { Badge, Col, Popover } from "antd";
import {
  WrapperContentPopup,
  WrapperHeader,
  WrapperHeaderAccount,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
} from "./style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import ButtonInputSearch from "../ButtonInputSearch/ButtonInputSearch";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { logout } from "../../redux/slides/UserSlide";
import { useDispatch } from "react-redux";
import { Spin } from "antd";
import { useMessage } from "../Message/MessageProvider";
import { searchProduct } from "../../redux/slides/productSlide";
import * as CartService from "../../services/CartService";
import { useQuery } from "@tanstack/react-query";
import { updateUser } from "../../redux/slides/UserSlide";

const HeaderComponent = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("access_token");

    // Nếu có token mà không có user => xóa token để tránh gọi API lỗi
    if (!storedUser && token) {
      localStorage.removeItem("access_token");
    }

    if (storedUser && !user?.id) {
      dispatch(updateUser(storedUser));
    }
  }, []);

  const getAllCart = async () => {
    const res = await CartService.getCartbyUserId(user?.id);
    return res;
  };

  const { data: orderData, refetch } = useQuery({
    queryKey: ["Cart", user?.id],
    queryFn: getAllCart,
    enabled: !!user?.id,
    retry: 3,
    retryDelay: 1000,
  });

  const orderItems = useMemo(() => orderData?.data?.data || [], [orderData]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && !user?.id) {
      dispatch(updateUser(storedUser));
    }
  }, []);

  const { success } = useMessage();
  const handleNavigateLogin = () => {
    navigate("/sign-in");
  };
  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };
  const handleCart = () => {
    setLoading(true);
    navigate("/cart");
    setTimeout(async () => {
      setLoading(false);
    }, 1000);
  };
  const handleNavigateProfile = () => {
    setLoading(true);
    navigate("/profile-user");
    setTimeout(async () => {
      setLoading(false);
    }, 1000);
  };
  const handleNavigateAdmin = () => {
    setLoading(true);
    navigate("/system/admin");
    setTimeout(async () => {
      setLoading(false);
    }, 1000);
  };

  const handleNavigateOrder = () => {
    setLoading(true);
    navigate("/my-order");
    setTimeout(async () => {
      setLoading(false);
    }, 1000);
  };

  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem("access_token");
    await dispatch(logout());
    setIsLoggedOut(true);
    success("Đăng xuất thành công");
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  useEffect(() => {
    if (isLoggedOut) {
      success("Đăng xuất thành công");
      setLoading(false);
      navigate("/");
    }
  }, [isLoggedOut, navigate, success]);

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    }
  }, [user?.name]);

  const content = (
    <div>
      <WrapperContentPopup onClick={handleNavigateProfile}>
        Thông tin người dùng
      </WrapperContentPopup>
      <WrapperContentPopup onClick={handleNavigateOrder}>
        Đơn hàng của tôi
      </WrapperContentPopup>
      {user.isAdmin && (
        <WrapperContentPopup onClick={handleNavigateAdmin}>
          Quản lý hệ thống
        </WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={handleLogout}>
        Đăng xuất
      </WrapperContentPopup>
    </div>
  );

  const onSearch = async (e) => {
    dispatch(searchProduct(e.target.value));
  };

  return (
    <div>
      <Spin spinning={loading}>
        <WrapperHeader
          gutter={30}
          style={{
            justifyContent:
              isHiddenSearch && isHiddenCart ? "space-between" : "unset",
          }}
        >
          <Col span={6}>
            <WrapperTextHeader
              onClick={() => {
                setLoading(true);
                navigate("/");
                setTimeout(async () => {
                  setLoading(false);
                }, 700);
              }}
            >
              Shop
            </WrapperTextHeader>
          </Col>
          {!isHiddenSearch && (
            <Col span={12}>
              <ButtonInputSearch
                size="large"
                textButton="Tìm kiếm"
                placeholder=""
                onChange={onSearch}
              />
            </Col>
          )}

          <Col span={6} style={{ display: "flex", gap: "30px" }}>
            <WrapperHeaderAccount>
              {userAvatar ? (
                <img
                  style={{
                    height: "35px",
                    width: "35px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  src={userAvatar}
                  alt="avatar"
                />
              ) : (
                <UserOutlined
                  style={{ fontSize: "30px", marginLeft: "15px" }}
                />
              )}
              {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click">
                    <div style={{ cursor: "pointer" }}>
                      {userName || "User"}
                    </div>
                  </Popover>
                </>
              ) : (
                <div>
                  <WrapperTextHeaderSmall
                    onClick={handleNavigateLogin}
                    style={{ cursor: "pointer" }}
                  >
                    Đăng nhập/
                  </WrapperTextHeaderSmall>
                  <WrapperTextHeaderSmall
                    onClick={handleNavigateSignUp}
                    style={{ cursor: "pointer" }}
                  >
                    Đăng ký
                  </WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
              )}
            </WrapperHeaderAccount>

            {!isHiddenSearch && (
              <div>
                <Badge count={orderItems.length} size="small">
                  <ShoppingCartOutlined
                    style={{
                      fontSize: "30px",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                    onClick={handleCart}
                  />
                </Badge>
                <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
              </div>
            )}
          </Col>
        </WrapperHeader>
      </Spin>
    </div>
  );
};

export default HeaderComponent;
