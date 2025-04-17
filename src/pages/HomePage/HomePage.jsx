import React, { useEffect, useState } from "react";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import {
  WrapperButtonMore,
  WrapperProducts,
  WrapperTypeProduct,
} from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponents";
import slider1 from "../../assets/images/Slider1.png";
import slider2 from "../../assets/images/slider2.png";
import slider3 from "../../assets/images/Slider3.png";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Loading } from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";

const HomePage = () => {
  const searchProduct = useSelector((state) => state.product.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [limit, setLimit] = useState(5);

  const [typeProduct,setTypeProduct] = useState([])
  const fetchProductAll = async ({ queryKey }) => {
    const [, search, limit] = queryKey;
    const res = await ProductService.getAllProductHome(search, limit);
    return res;
  };

  const queryResult = useQuery({
    queryKey: ["products", searchDebounce, limit],
    queryFn: fetchProductAll,
    keepPreviousData: true,
  });
  const { isLoading, data: products, isPlaceholderData } = queryResult;

  const fetchAllTypeProduct = async() =>{
    const res = await ProductService.getAllTypeProduct()
    if(res?.status==='OK'){
      setTypeProduct(res?.data)
    }
    return res
  }

  useEffect(()=>{
    fetchAllTypeProduct()
  },[])

  const allProductsQuery = useQuery({
    queryKey: ["all-products"],
    queryFn: ProductService.getAllProducts,
  });
  

  const topSelledProducts = allProductsQuery?.data?.data
  ?.slice() 
  ?.sort((a, b) => b.selled - a.selled) 
  ?.slice(0, 5); 
  return (
    <Loading isLoading={isLoading}>
      <div style={{ padding: "0 120px" }}>
        <WrapperTypeProduct>
          {typeProduct.map((item) => {
            return <TypeProduct name={item} key={item} />;
          })}
        </WrapperTypeProduct>
      </div>
      <div id="container" style={{ padding: "0 120px" }}>
        <SliderComponent arrImages={[slider1, slider2, slider3]} />
        {!searchDebounce && (
          <>
           <div
          style={{
            display: "flex",
            margin: "10px 120px 10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
        
          MẪU BÁN CHẠY
        </div>
        <WrapperProducts>
          {topSelledProducts?.map((product) => {
            return (
              <CardComponent
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                rating={product.rating}
                type={product.type}
                selled={product.selled}
                discount={product.discount}
                id={product._id}
              />
            );
          })}
        </WrapperProducts>
          </>
        )}
       
        <div
          style={{
            display: "flex",
            margin: "20px 120px 10px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          TẤT CẢ SẢN PHẨM
        </div>
        <WrapperProducts>
          {products?.data.map((product) => {
            return (
              <CardComponent
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                image={product.image}
                name={product.name}
                price={product.price}
                rating={product.rating}
                type={product.type}
                selled={product.selled}
                discount={product.discount}
                id={product._id}
              />
            );
          })}
        </WrapperProducts>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <WrapperButtonMore
            textButton="Xem thêm"
            type="outline"
            styleButton={{
              border: "1px solid rgb(11,116,229)",
              color: "rgb(11, 116, 229)",
              width: "160px",
              height: '40px',
              marginBottom: "10px",
            }}
            disabled={
              Number(products?.total) === Number(products?.data?.length)
            }
            styletextButton={{ fontWeight: 500 }}
            onClick={() => {
              if (!isPlaceholderData) {
                setLimit((prev) => prev + 5);
              }
            }}
          />
          <WrapperButtonMore
            textButton="Ẩn bớt"
            type="outline"
            styleButton={{
              border: "1px solid rgb(11,116,229)",
              color: "rgb(11, 116, 229)",
              width: "160px",
              height: '40px',
              marginBottom: "10px",
              marginLeft: "30px", // 👈 Cách nút trước 30px
            }}
            disabled={5 === Number(products?.data?.length)}
            styletextButton={{ fontWeight: 500 }}
            onClick={() => {
              if (!isPlaceholderData) {
                setLimit((prev) => prev - 5);
              }
            }}
          />
        </div>
      </div>
    </Loading>
  );
};

export default HomePage;
