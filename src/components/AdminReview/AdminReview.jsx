import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, message } from "antd";
import { getAllReview } from "../../services/ReviewService"; // đường dẫn tùy dự án của bạn

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getAllReview();
      if (res.status === "OK") {
        setReviews(res.data); 
      } else {
        message.error("Không thể tải dữ liệu đánh giá");
      }
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: ["product", "name"],
      key: "product",
    },
    {
      title: "Người đánh giá",
      dataIndex: ["user", "name"],
      key: "user",
    },
    {
      title: "Số sao",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => <Tag color="gold">{rating} ⭐</Tag>,
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleString("vi-VN"),
    },
  ];

  return (
    <>
      <Spin spinning={loading}>
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={reviews}
          pagination={{ pageSize: 10}}
        />
      </Spin>
    </>
  );
};

export default AdminReview;
