import React, { useState } from "react";
import { Row, Col, Image, Divider } from "antd";
import {
  WrapperStyleNameProduct,
  WrapperStyleText,
  WrapperPriceText,
  WrapperStylePrice,
  WrapperAdress,
  WrapperInputNumber,
  WrapperQualityProduct,
} from "./style";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { StarFilled, StarTwoTone, StarOutlined } from "@ant-design/icons";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { Loading } from "../LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slides/orderSlide";
import { useMessage } from "../../components/Message/MessageProvider";

const ProductDetailsComponent = ({ idProduct }) => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const fetchGetDetailsProduct = async ({ queryKey }) => {
    const [, id] = queryKey;
    const res = await ProductService.getDetailProduct(id);
    return res.data;
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1)); // Không cho nhỏ hơn 1
  };

  const handleChange = (value) => {
    setQuantity(value);
  };

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const decimalPart = rating % 1;
  
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarFilled key={`full-${i}`} style={{ fontSize: "20px", color: "rgb(253,216,54)" }} />
      );
    }
  
    if (decimalPart > 0) {
      const percentage = Math.round(decimalPart * 100);
      stars.push(
        <div key="half" style={{ position: "relative", display: "inline-block" }}>
          <StarOutlined style={{ fontSize: "20px", color: "rgb(253,216,54)", position: "relative" }} />
          <div style={{
            position: "absolute",
            overflow: "hidden",
            width: `${percentage}%`,
            top: 0,
            left: 0
          }}>
            <StarFilled style={{ fontSize: "20px", color: "rgb(253,216,54)" }} />
          </div>
        </div>
      );
    }
  
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarOutlined key={`empty-${i}`} style={{ fontSize: "20px", color: "rgb(253,216,54)" }} />
      );
    }
  
    return stars;
  };

  const { isLoading, data: productDetails } = useQuery({
    queryKey: ["products-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    retry: 3,
    retryDelay: 1000,
  });
  const { success } = useMessage();
  if (!productDetails) return null;

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: productDetails?.name,
            amount: quantity,
            discount: productDetails?.discount,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
          },
        })
      );
      if (true) {
        success("Đã thêm vào giỏ hàng!");
      }
    }
  };

  return (
    <Loading isLoading={isLoading}>
      <Row
        style={{
          padding: "24px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          margin: "0 auto",
          maxWidth: "1200px",
          
        }}
      >
        {/* Phần hình ảnh */}
        <Col
          span={10}
          style={{
            borderRight: "1px solid #f0f0f0",
            padding: "0 24px 0 0",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Image
            src={productDetails.image}
            alt="image product"
            preview={false}
            style={{
              width: "100%",
              borderRadius: "4px",
              border: "1px solid #f0f0f0",
              aspectRatio: "1/1",
              objectFit: "contain",
            }}
          />

          <Row
            style={{
              gap: "8px",
              justifyContent: "space-between",
            }}
          >
           
            
          </Row>
        </Col>

        {/* Phần thông tin */}
        <Col
          span={14}
          style={{
            padding: "0 0 0 24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <WrapperStyleNameProduct
            style={{ fontSize: "24px", fontWeight: 500 }}
          >
            {productDetails?.name}
          </WrapperStyleNameProduct>

          <div
            style={{
              margin: "12px 0",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
              {renderStars(productDetails?.rating)}
              <span style={{ color: "#1890ff", fontWeight: 500 }}>
                {productDetails?.rating}
              </span>
            </div>
            <Divider type="vertical" style={{ height: "16px", margin: 0 }} />
            <WrapperStyleText style={{ color: "#666" }}>
              Đã bán {productDetails?.selled}
            </WrapperStyleText>
            <Divider type="vertical" style={{ height: "16px", margin: 0 }} />
            <WrapperStyleText style={{ color: "#666" }}>
              Còn lại {productDetails?.countInStock}
            </WrapperStyleText>
          </div>

          <WrapperStylePrice
            style={{
              padding: "16px 0",
              borderTop: "1px solid #f0f0f0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <WrapperPriceText style={{ fontSize: "28px", color: "#ff4d4f" }}>
              {Number(productDetails?.price).toLocaleString("vi-VN")}₫
            </WrapperPriceText>
          </WrapperStylePrice>

          <WrapperAdress
            style={{
              padding: "16px 0",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span style={{ color: "#666" }}>Giao đến</span>
            <span className="address" style={{ fontWeight: 500 }}>
              {user?.address || "Chưa cập nhật địa chỉ"}
            </span>
            <span
              className="change-address"
              style={{
                color: "#1890ff",
                cursor: "pointer",
                ":hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate("/profile-user")}
            >
              Đổi địa chỉ
            </span>
          </WrapperAdress>

          <div style={{ padding: "16px 0"}}>
            <div style={{ marginBottom: "12px", fontWeight: 500 }}>
              Số lượng
            </div>
            <WrapperQualityProduct>
              <button
                onClick={handleDecrease}
                style={{
                  border: "1px solid #d9d9d9",
                  background: "transparent",
                  height: "32px",
                  width: "32px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  // borderRadius: "4px 0 0 4px",
                  ":hover": {
                    borderColor: "#1890ff",
                    color: "#1890ff",
                  },
                }}
              >
                <MinusOutlined style={{ fontSize: "14px" }} />
              </button>

              <WrapperInputNumber
                min={1}
                value={quantity}
                onChange={handleChange}
                size="small"
                controls={false}
                style={{
                  width: "30px",
                  height: "32px",
                  textAlign: "center",
                  // borderRadius: 0,
                  borderLeft: "none",
                  borderRight: "none",
                  borderColor: "#d9d9d9",
                }}
              />

              <button
                onClick={handleIncrease}
                style={{
                  border: "1px solid #d9d9d9",
                  background: "transparent",
                  height: "32px",
                  width: "32px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  // borderRadius: "0 2px 2px 0",
                  ":hover": {
                    borderColor: "#1890ff",
                    color: "#1890ff",
                  },
                }}
              >
                <PlusOutlined style={{ fontSize: "14px" }} />
              </button>
            </WrapperQualityProduct>
            <div style={{ marginTop: "8px", color: "#666", fontSize: "14px" }}>
              {productDetails?.countInStock} sản phẩm có sẵn
            </div>
          </div>

          <div style={{ padding: "24px 0", display: "flex", gap: "16px" }}>
            <ButtonComponent
              size="large"
              styleButton={{
                background: "#ff4d4f",
                height: "48px",
                flex: 1,
                border: "none",
                borderRadius: "4px",
                transition: "all 0.3s",
                ":hover": {
                  background: "#ff7875",
                },
              }}
              onClick={() => {
                if (!user?.id) {
                  navigate("/sign-in");
                } else {
                  dispatch(
                    addOrderProduct({
                      orderItem: {
                        name: productDetails?.name,
                        amount: quantity,
                        discount: productDetails?.discount,
                        image: productDetails?.image,
                        price: productDetails?.price,
                        product: productDetails?._id,
                      },
                    })
                  );
                  navigate("/cart");
                }
              }}
              textButton={"Mua ngay"}
              styletextButton={{
                color: "#fff",
                fontSize: "16px",
                fontWeight: "600",
              }}
            />

            <ButtonComponent
              size="large"
              styleButton={{
                background: "#fff",
                height: "48px",
                flex: 1,
                border: "1px solid #1890ff",
                borderRadius: "4px",
                transition: "all 0.3s",
                ":hover": {
                  borderColor: "#40a9ff",
                  color: "#40a9ff",
                },
              }}
              onClick={handleAddOrderProduct}
              textButton={"Thêm vào giỏ hàng"}
              styletextButton={{
                color: "#1890ff",
                fontSize: "16px",
                fontWeight: "500",
              }}
            />
          </div>
        </Col>
      </Row>
    </Loading>
  );
};

export default ProductDetailsComponent;
