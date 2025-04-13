import React, { useCallback, useEffect, useState } from "react";
import NarbarComponent from "../../components/NavbarComponent/NarbarComponent";
import CardComponent from "../../components/CardComponent/CardComponent";
import { Row, Pagination, Col } from "antd";
import { WrapperProducts, WrapperNavbar } from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { Loading } from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";

export const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const navigate = useNavigate();
  const { state } = useLocation();
  
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });

  const fetchProductType = useCallback(async (type, page, limit) => {
    setLoading(true);
    try {
      const res = await ProductService.getProductType(type, page, limit);
      if (res.status === "OK") {
        setProduct(res?.data);
        setPanigate(prev => ({ ...prev, total: res?.totalPage }));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (state) {
      fetchProductType(state, panigate.page, panigate.limit);
    }
  }, [state, panigate.page, panigate.limit, fetchProductType]);

  const onChange = (current, pageSize) => {
    setPanigate(prev => ({ ...prev, page: current - 1, limit: pageSize }));
  };

  const filteredProducts = product.filter((pro) => {
    if (searchDebounce === '') return true;
    return pro?.name?.toLowerCase().includes(searchDebounce.toLowerCase());
  });

  return (
    <Loading isLoading={loading}>
      <div style={{ padding: "0 120px 0", background: "#ffff" }}>
        <p>
          <span
            style={{ cursor: "pointer", fontWeight: "bold" }}
            onClick={() => navigate("/")}
          >
            Trang chủ
          </span>
          /{state}
        </p>
        <div style={{ width: "1270px", margin: "0 auto", height: "100%" }}>
          <Row
            style={{
              flexWrap: "nowrap",
              paddingTop: "10px",
              paddingBottom: "10px",
              height: "calc(100%-20px)",
            }}
          >
            <WrapperNavbar span={4}>
              <NarbarComponent />
            </WrapperNavbar>
            <Col span={20}>
              <WrapperProducts>
                {filteredProducts.map((data) => (
                  <CardComponent
                    key={data._id}
                    countInStock={data.countInStock}
                    description={data.description}
                    image={data.image}
                    name={data.name}
                    price={data.price}
                    rating={data.rating}
                    type={data.type}
                    selled={data.selled}
                    discount={data.discount}
                    id={data._id}
                  />
                ))}
              </WrapperProducts>
              <Pagination
                showQuickJumper
                current={panigate.page + 1}
                pageSize={panigate.limit}
                total={panigate.total * panigate.limit}
                onChange={onChange}
                style={{ textAlign: "center", marginTop: "20px" }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  );
};