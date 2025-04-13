import React from "react";
import TableComponent from "../TableComponent/TableComponent";
import NIKE from "../../assets/images/NIKE.jpg";
import ADIDAS from "../../assets/images/ADIDAS.jpg";
import G1 from "../../assets/images/G1.jpg";

const UserOrder = () => {
  const columns = [
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <img
          src={text}
          alt="product"
          style={{ width: 50, height: 50, objectFit: "cover" }}
        />
      ),
    },
    { title: "Giá", dataIndex: "price", key: "price" },

    { title: "Số lượng", dataIndex: "count", key: "count" },
    { title: "Loại", dataIndex: "type", key: "type" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
  ];
  // them
  const data = [
    {
      key: "1",
      name: "NIKE_1",
      price: "320.000đ",
      count: 1,
      type: "NIKE",
      image: NIKE,
      status: "Đang giao hàng",
    },
    {
      key: "2",
      name: "ADIDAS_T",
      price: "1.200.000đ",
      count: 1,
      type: "ADIDAS",
      image: ADIDAS,
      status: "Đã xác nhận",
    },
    {
      key: "3",
      name: "JD1",
      price: "1.000.000đ",
      count: 1,
      type: "JORDAN",
      image: G1,
      status: "Hủy đơn",
    },
    {
      key: "4",
      name: "PUMA_X",
      price: "900.000đ",
      count: 1,
      type: "PUMA",
      image: G1,
      status: "Hoàn thành",
    },
    {
      key: "5",
      name: "VANS_CLASSIC",
      price: "850.000đ",
      count: 1,
      type: "VANS",
      image: NIKE,
      status: "Chờ xác nhận",
    },
  ];

  return (
    <div style={{ marginTop: "10px" }}>
      <TableComponent columns={columns} data={data} />
    </div>
  );
};

export default UserOrder;
