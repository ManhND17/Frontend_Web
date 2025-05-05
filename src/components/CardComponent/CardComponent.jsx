import React from "react";
import { Card } from "antd";
import {
  StyleNameProduct,
  WarpperDiscountText,
  WarpperReportText,
  WarpperPriceText,
} from "./style";
import { StarFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";


const CardComponent = (props) => {
  const {  image,name,price,rating, discount, selled, id } = props;
  const navigate = useNavigate()
  const handleDetailsProduct = (id) =>{
    navigate(`/product-details/${id}`)
  }
  return (
    <div>
      <Card
        hoverable
        style={{ width: 240,borderColor:'#cccc' }}
        cover={
          <img
            alt="example"
            src={image}
            style={{ height: "250px", objectFit: "cover", widht: "200px" }}
          />
        }
        onClick={()=> handleDetailsProduct(id)}
      >
        <StyleNameProduct>{name}</StyleNameProduct>
        <WarpperReportText>
          <span style={{ marginRight: "4px" }}>
            <span>{Math.round(rating * 10) / 10}</span>{" "}
            <StarFilled style={{ fontSize: "10px", color: "yellow" }} />
          </span>
          <span> | Đã bán {selled||100}</span>
        </WarpperReportText>
        <WarpperPriceText >
          <span style={{marginRight:'8px'}}> {price !== undefined ? price.toLocaleString() : 'Đang cập nhật'} VND</span>
          
          <WarpperDiscountText>{-discount|| -5}%</WarpperDiscountText>
        </WarpperPriceText>
      </Card>
    </div>
  );
};

export default CardComponent;
