import React from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponents/ProductDetailsComponent";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetailsPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  return (
    <div style={{ padding: "0 120px", background: "#efefef" }}>
      <h5><span style={{cursor:'pointer',fontWeight:'bold'}} onClick={()=>{navigate('/')}}>Trang chủ</span> - Chi tiết sản phẩm</h5>
      <ProductDetailsComponent idProduct={id}/>
    </div>
  );
};

export default ProductDetailsPage;
