import React from "react";
import { WrapperHeader } from "./style";
import TableComponent from "../TableComponent/TableComponent";
import NIKE from "../../assets/images/NIKE.jpg";
import ADIDAS from "../../assets/images/ADIDAS.jpg";
import G1 from "../../assets/images/G1.jpg";

const AdminOrder = () => {
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
    { title: "Tên khách hàng", dataIndex: "nameuser", key: "nameuser" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    { title:"Địa chỉ", dataIndex:'address', key:'address'},
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
      nameuser: "Nguyễn Văn A",
      phone: "0987654321",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      status: "Đang giao hàng",
    },
    {
      key: "2",
      name: "ADIDAS_T",
      price: "1.200.000đ",
      count: 1,
      type: "ADIDAS",
      image: ADIDAS,
      nameuser: "Trần Thị B",
      phone: "0912345678",
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      status: "Đã xác nhận",
    },
    {
      key: "3",
      name: "JD1",
      price: "1.000.000đ",
      count: 1,
      type: "JORDAN",
      image: G1,
      nameuser: "Lê Văn C",
      phone: "0909988776",
      address: "789 Đường MNO, Quận 3, TP.HCM",
      status: "Hủy đơn",

    },
    {
      key: "4",
      name: "PUMA_X",
      price: "900.000đ",
      count: 1,
      type: "PUMA",
      image: G1, 
      nameuser: "Phạm Văn D",
      phone: "0977554433",
      address: "101 Đường DEF, Quận 4, TP.HCM",
      status: "Hoàn thành",
    },
    {
      key: "5",
      name: "VANS_CLASSIC",
      price: "850.000đ",
      count: 1,
      type: "VANS",
      image: NIKE,
      nameuser: "Hoàng Thị E",
      phone: "0955123456",
      address: "202 Đường GHI, Quận 5, TP.HCM",
      status: "Chờ xác nhận",
    },
  ];
  
  return (
    <div>
      <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
      <div style={{marginTop:'10px'}}>
        <TableComponent columns={columns} data={data}/>
      </div>
    </div>
  );
};

export default AdminOrder;
