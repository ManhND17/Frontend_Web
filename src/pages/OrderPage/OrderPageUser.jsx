import React from "react";
import UserOrder from "../../components/UserOrder/UserOrder";

const OrderPageUser = () => {
  return (
    <div style={{ background: "#f5f5ff", width: "100%", height: "100vh" }}>
      <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
        <h3> Danh sách đơn hàng</h3>
        <UserOrder/>
      </div>
    </div>
  );
};

export default OrderPageUser;
