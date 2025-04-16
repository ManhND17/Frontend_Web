import React, { useState } from "react";
import { Row, Col, Image } from "antd";
import product1 from "../../assets/images/adidas1.jpg";
import product2 from "../../assets/images/adidas2.jpg";
import product3 from "../../assets/images/adidas3.jpg";
import {
  WrapperStyleNameProduct,
  WrapperStyleImageSmall,
  WrapperStyleColImage,
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


const ProductDetailsComponent = ({ idProduct }) => {
  const user = useSelector((state)=>state.user)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

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
    const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <StarFilled
            key={i}
            style={{ fontSize: "20px", color: "rgb(253,216,54)" }}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarTwoTone
            key={i}
            twoToneColor="rgb(253,216,54)"
            style={{ fontSize: "20px" }}
          />
        );
      } else {
        stars.push(
          <StarOutlined
            key={i}
            style={{ fontSize: "20px", color: "rgb(253,216,54)" }}
          />
        );
      }
    }
    return stars;
  };

  const { isLoading, data: productDetails } = useQuery({
    queryKey: ["products-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    retry: 3,
    retryDelay: 1000,
  });
  console.log('detail',productDetails)
  if (!productDetails) return null;

  const handleAddOrderProduct = () =>{
    if(!user?.id){
      navigate('/sign-in',{state: location?.pathname})
    }else {
      dispatch(addOrderProduct({
        orderItem: {
          name: productDetails?.name,
          amount: quantity,
          discount: productDetails?.discount,
          image: productDetails?.image,
          price: productDetails?.price,
          product: productDetails?._id
        }
      }))
    }
  }
  return (
    <Loading isLoading={isLoading}>
      <Row style={{ padding: "16px", background: "#fff", borderRadius: "4px" }}>
        <Col
          span={10}
          style={{ borderRight: "1px solid #e5e5e5", paddingLeft: "8px" }}
        >
          <Image
            src={productDetails.image}
            alt="image product"
            preview={false}
            style={{ width: "500px" }}
          />
          <Row
            style={{
              paddingTop: "10px",
              gap: "1px",
              justifyContent: "space-between",
              paddingRight: "10px",
            }}
          >
            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={product1}
                alt="image product"
                preview={false}
              />
            </WrapperStyleColImage>

            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={product2}
                alt="image product"
                preview={false}
              />
            </WrapperStyleColImage>

            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={product3}
                alt="image product"
                preview={false}
              />
            </WrapperStyleColImage>

            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={product2}
                alt="image product"
                preview={false}
              />
            </WrapperStyleColImage>

            <WrapperStyleColImage span={4}>
              <WrapperStyleImageSmall
                src={product2}
                alt="image product"
                preview={false}
              />
            </WrapperStyleColImage>
          </Row>
        </Col>

        <Col span={14} style={{ padding: "10px 0" }}>
          <WrapperStyleNameProduct>
            {productDetails?.name}
          </WrapperStyleNameProduct>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              paddingLeft: "10px",
            }}
          >
            {renderStars(productDetails?.rating)}
            <WrapperStyleText>| Đã bán {productDetails?.selled}</WrapperStyleText>
            <WrapperStyleText>| Còn lại trong kho {productDetails?.countInStock}</WrapperStyleText>
          </div>

          <WrapperStylePrice>
            <WrapperPriceText>
              {Number(productDetails?.price).toLocaleString("vi-VN")}VND
            </WrapperPriceText>
          </WrapperStylePrice>
          <WrapperAdress style={{ paddingLeft: "10px" }}>
            <span>Giao đến </span>
            <span className="address">
              {user.address}
            </span>
            <span className="change-address" style={{cursor:'pointer'}} onClick={()=>{navigate('/profile-user')}}> Đổi địa chỉ</span>
          </WrapperAdress>
          <div
            style={{
              margin: "5px 0 20px",
              paddingLeft: "10px",
              borderTop: "1px solid #e5e5e5",
              borderBottom: "1px solid #e5e5e5",
            }}
          >
            <div style={{ marginBottom: "6px" }}>Số lượng</div>
            <WrapperQualityProduct>
              <button
                onClick={handleDecrease}
                style={{
                  border: "none",
                  background: "transparent",
                  height: "32px",
                  width: "32px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <MinusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>

              <WrapperInputNumber
                min={1}
                value={quantity}
                onChange={handleChange}
                size="small"
                controls={false}
                style={{
                  width: "50px",
                  height: "32px",
                  textAlign: "center",
                  lineHeight: "32px",
                }}
              />

              <button
                onClick={handleIncrease}
                style={{
                  border: "none",
                  background: "transparent",
                  height: "32px",
                  width: "32px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <PlusOutlined style={{ color: "#000", fontSize: "20px" }} />
              </button>
            </WrapperQualityProduct>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              paddingLeft: "10px",
            }}
          >
            <ButtonComponent
              size={40}
              border={false}
              styleButton={{
                background: "rgb(255,57,69)",
                height: "48px",
                width: "220px",
                border: "none",
                borderRadius: "4px",
              }}
              onClick={handleAddOrderProduct}
              textButton={"Chọn mua"}
              styletextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
            <ButtonComponent
              size={40}
              border={false}
              styleButton={{
                background: "#fff",
                height: "48px",
                width: "220px",
                border: "1px solid rgb(13,92,182)",
                borderRadius: "4px",
              }}
              textButton={"Thêm vào giỏ hàng"}
              styletextButton={{ color: "rgb(13,92,182)", fontSize: "15px" }}
            ></ButtonComponent>
          </div>
        </Col>
      </Row>
    </Loading>
  );
};

export default ProductDetailsComponent;
