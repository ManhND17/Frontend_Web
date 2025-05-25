import React, { useEffect, useState } from "react";
import { WrapperInfo } from "./style";
import { useLocation } from "react-router-dom";
import * as ReviewService from "../../services/ReviewService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useMessage } from "../../components/Message/MessageProvider";

const OrderSuccess = () => {
  const location = useLocation();
  const { state } = location;
  const { order } = state;

  const [reviewSuccessArray, setReviewSuccessArray] = useState(
    order?.orderItems?.map(() => true)
  );
  const [updateReviewArray, setUpdateReviewArray] = useState(
    order?.orderItems?.map(() => false)
  );

  const [reviews, setReviews] = useState(
    order?.orderItems?.map((item) => ({
      id: "",
      user: order.user,
      product: item.product,
      order: order._id,
      rating: 5,
      comment: "",
    }))
  );
  const [isload, setIsLoad] = useState(true);
  useEffect(() => {
    if (isload) {
      const checkExistingReviews = async () => {
        const updatedReviews = [...reviews];
        const newSuccessArray = [...reviewSuccessArray];
        const newUpdateArray = [...updateReviewArray];

        for (let i = 0; i < order.orderItems.length; i++) {
          try {
            const res = await ReviewService.getDetailsReview(
              order._id,
              order.orderItems[i].product
            );
            if (res.status === "OK" && res.data) {
              updatedReviews[i] = {
                ...updatedReviews[i],
                id: res.data._id,
                rating: res.data.rating,
                comment: res.data.comment,
              };
              newSuccessArray[i] = false;
              newUpdateArray[i] = true;
            }
          } catch (error) {
            console.error("Error checking review:", error);
          }
        }

        setReviews(updatedReviews);
        setReviewSuccessArray(newSuccessArray);
        setUpdateReviewArray(newUpdateArray);
      };checkExistingReviews();
    }
    
  }, [order._id,isload]);
  const handleRatingChange = (index, value) => {
    const updatedReviews = [...reviews];
    updatedReviews[index].rating = value;
    setReviews(updatedReviews);
  };

  const handleCommentChange = (index, value) => {
    const updatedReviews = [...reviews];
    updatedReviews[index].comment = value;
    setReviews(updatedReviews);
  };

  const mutationAddReview = useMutationHooks((data) => {
    const res = ReviewService.createReview(data);
    return res;
  });
  const handleAddReview = (index) => {
    if (reviews[index].comment) {
      mutationAddReview.mutate({ ...reviews[index], index });
    }
  };
  const { success, error } = useMessage();
  const { isSuccess, data } = mutationAddReview;

  useEffect(() => {
    if (data?.status === "OK" && isSuccess) {
      success("Đánh giá thành công");
      const updatedReviews = [...reviews];
      const index = reviews.findIndex(
        (item) => item.product === data.data.product
      );

      updatedReviews[index] = {
        ...updatedReviews[index],
        id: data.data._id,
        comment: data.data.comment,
        rating: data.data.rating,
      };

      setReviews(updatedReviews);
      setIsLoad(true);
      setReviewSuccessArray((prev) => {
        const newArray = [...prev];
        newArray[index] = false;
        return newArray;
      });
      setUpdateReviewArray((prev) => {
        const newArray = [...prev];
        newArray[index] = true;
        return newArray;
      });
      mutationAddReview.reset();
    } else if (data && isSuccess) {
      error(data?.message || "Đánh giá thất bại");
      mutationAddReview.reset();
    }
  }, [data, isSuccess]);

  const mutationUpdateReview = useMutationHooks(({ id, data }) => {
    const res = ReviewService.updateReview(id, data);
    return res;
  });

  const handleUpdateReview = (index) => {
    if (reviews[index].comment && reviews[index].id) {
      mutationUpdateReview.mutate({
        id: reviews[index].id,
        data: reviews[index],
      });
    }
  };

  const { isSuccess: isSuccessUpdate, data: dataUpdate } = mutationUpdateReview;

  useEffect(() => {
    if (dataUpdate?.status === "OK" && isSuccessUpdate) {
      success("Cập nhật đánh giá thành công");
      const updatedReviews = [...reviews];
      const index = reviews.findIndex(
        (item) => item.product === dataUpdate.data.product
      );
      updatedReviews[index] = {
        ...updatedReviews[index],
        id: dataUpdate.data._id,
        comment: dataUpdate.data.comment,
        rating: dataUpdate.data.rating,
      };
      setReviews(updatedReviews);
      setIsLoad(true);
      mutationUpdateReview.reset();
    } else if (dataUpdate && isSuccessUpdate) {
      error(dataUpdate?.message || "Cập nhật đánh giá thất bại");
      mutationUpdateReview.reset();
    }
  }, [dataUpdate, isSuccessUpdate]);

  return (
    <div
      style={{ background: "#f5f5ff", minHeight: "100vh", padding: "40px 0" }}
    >
      <div style={{ maxWidth: "1270px", margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "32px",
            fontWeight: "700",
          }}
        >
          Đánh giá đơn hàng
        </h2>

        <div
          style={{
            padding: "32px",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {/* Thông tin đơn */}
          <WrapperInfo style={{ marginBottom: "24px" }}>
            <div style={{ fontWeight: "bold", marginBottom: "6px" }}>
              Mã đơn hàng:{" "}
              <span style={{ fontWeight: "normal" }}>{order._id}</span>
            </div>
            <div style={{ fontWeight: "bold" }}>
              Trạng thái:{" "}
              <span style={{ fontWeight: "normal" }}>{order.status}</span>
            </div>
          </WrapperInfo>

          {/* Danh sách sản phẩm */}
          <div style={{ marginTop: "32px" }}>
            <WrapperInfo style={{ fontWeight: "bold", marginBottom: "16px" }}>
              Sản phẩm & Đánh giá
            </WrapperInfo>

            {order?.orderItems.map((item, index) => (
              <div
                key={item.product}
                style={{
                  background: "#fdfdfd",
                  padding: "20px",
                  marginBottom: "20px",
                  borderRadius: "12px",
                  border: "1px solid #e6e6e6",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div
                  style={{ display: "flex", gap: "16px", alignItems: "center" }}
                >
                  <img
                    src={item.image}
                    alt="product"
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "16px",
                        marginBottom: "6px",
                      }}
                    >
                      {item.name}
                    </div>
                    <div>Số lượng: {item.amount}</div>
                    <div style={{ marginTop: "4px", fontWeight: 500 }}>
                      Giá:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(
                        (item?.price * item?.amount * (100 - item?.discount)) /
                          100
                      )}
                    </div>
                    
                  </div>
                </div>

                <div style={{ marginTop: "16px" }}>
                  <div style={{ marginBottom: "8px" }}>
                    <label style={{ fontWeight: 500 }}>Đánh giá sao:</label>
                    <select
                      value={reviews[index].rating}
                      onChange={(e) =>
                        handleRatingChange(index, Number(e.target.value))
                      }
                      style={{
                        marginLeft: "10px",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        outline: "none",
                        fontSize: "14px",
                      }}
                    >
                      {[5, 4, 3, 2, 1].map((num) => (
                        <option key={num} value={num}>
                          {num} sao
                        </option>
                      ))}
                    </select>
                  </div>

                  <label style={{ fontWeight: 500 }}>Nhận xét:</label>
                  <textarea
                    rows={3}
                    value={reviews[index].comment}
                    onChange={(e) => handleCommentChange(index, e.target.value)}
                    placeholder="Chia sẻ cảm nhận của bạn..."
                    style={{
                      width: "100%",
                      marginTop: "6px",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                  />

                  {reviewSuccessArray[index] && (
                    <div style={{ textAlign: "right" }}>
                      <button
                        onClick={() => handleAddReview(index)}
                        style={{
                          backgroundColor: "#1677ff",
                          width: "180px",
                          height: "40px",
                          color: "#fff",
                          padding: "12px 32px",
                          fontSize: "16px",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          transition: "background-color 0.3s",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#0958d9")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#1677ff")
                        }
                      >
                        Gửi đánh giá
                      </button>
                    </div>
                  )}

                  {updateReviewArray[index] && (
                    <div style={{ textAlign: "right" }}>
                      <button
                        onClick={() => handleUpdateReview(index)}
                        style={{
                          backgroundColor: "#1677ff",
                          width: "180px",
                          height: "40px",
                          color: "#fff",
                          padding: "12px 32px",
                          fontSize: "16px",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          transition: "background-color 0.3s",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.backgroundColor = "#0958d9")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.backgroundColor = "#1677ff")
                        }
                      >
                        Sửa đánh giá
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tổng tiền & phí ship */}
          <div style={{ textAlign: "right", marginTop: "32px" }}>
            <div style={{ fontSize: "16px", marginBottom: "8px" }}>
              Phí giao hàng:{" "}
              <strong style={{ color: "#fa8c16" }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order?.shippingPrice)}
              </strong>
            </div>
            <div style={{ fontSize: "16px", marginBottom: "8px" }}>
              Voucher:{" "}
              <strong style={{ color: "#fa8c16" }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order?.VoucherDiscount)}
              </strong>
            </div>
            <div
              style={{ fontSize: "20px", fontWeight: "bold", color: "#cf1322" }}
            >
              Tổng tiền:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(order?.totalPrice)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
