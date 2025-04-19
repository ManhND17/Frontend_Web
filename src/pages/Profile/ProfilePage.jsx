import React, { useCallback, useState } from "react";
import {
  WrapperContentProfile,
  WrapperLabel,
  WrapperUploadFile,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import { WrapperInput } from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useMessage } from "../../components/Message/MessageProvider";
import { updateUser } from "../../redux/slides/UserSlide";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getBase64 } from "../../utils";
import { Spin } from "antd";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const { success, error } = useMessage();

  const mutation = useMutationHooks(async (data) => {
    const { id, access_token, ...rests } = data;
    await UserService.updateUser(id, rests, access_token);
  });

  const dispatch = useDispatch();
  const { isError, isSuccess } = mutation;

  useEffect(() => {
    setName(user?.name || "");
    setAvatar(user?.avatar || "");
    setPhone(user?.phone || "");
    setAddress(user?.address || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleGetailsUser = useCallback(
    async (id, token) => {
      try {
        const res = await UserService.getDetailUser(id, token);
        if (res?.data) {
          console.log("Update", res?.data);
          dispatch(updateUser({ ...res?.data, access_token: token }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      }
    },
    [dispatch]
  );
  useEffect(() => {
    console.log("test", name);
  });
  useEffect(() => {
    if (isSuccess) {
      success("Cập nhật thành công!");
      handleGetailsUser(user?.id, user?.access_token);
    } else if (isError) {
      error("Xảy ra lỗi?");
    }
  }, [
    isSuccess,
    isError,
    user?.id,
    user?.access_token,
    handleGetailsUser,
    success,
    error,
  ]);

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnChangeName = (value) => {
    setName(value);
  };
  const handleOnChangeAddress = (value) => {
    setAddress(value);
  };
  const handleOnChangeAvatar = async ({ fileList }) => {
    const file = fileList[0];

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  const handleOnChangePhone = (value) => {
    setPhone(value);
  };
  const handleUpdate = async () => {
    setLoading(true);

    setTimeout(() => {
      mutation.mutate({
        id: user?.id,
        email,
        name,
        phone,
        address,
        avatar,
        access_token: user?.access_token,
      });
      setLoading(false);
    }, 1000);
  };
  return (
    <Spin spinning={loading}>
      <div style={{ width: "1270px", margin: "0 auto", height: "500px" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: "8px",
            marginLeft: "100px",
            fontWeight: "700",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            display: "flex",
            gap: "12px",
          }}
        >
          Thông tin người dùng
        </div>
        <WrapperContentProfile>
          <WrapperInput>
            <WrapperLabel htmlFor="name">Tên</WrapperLabel>
            <InputForm
              style={{ height: "48px", width: "500px" }}
              id="name"
              value={name}
              handleOnChange={handleOnChangeName}
            />
            <ButtonComponent
              onClick={handleUpdate}
              styleButton={{
                backgroundColor: "#0078D4",
                border: "none",
                height: '20px',
                width: '60px',
                padding: "4px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                minHeight: "32px",
              }}
              textButton={"Cập nhật"}
              styletextButton={{
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "500",
              }}
            />
          </WrapperInput>

          <WrapperInput>
            <WrapperLabel htmlFor="email">Email</WrapperLabel>
            <InputForm
              style={{ height: "48px", width: "500px" }}
              id="email"
              value={email}
              handleOnChange={handleOnChangeEmail}
            />

            <ButtonComponent
              onClick={handleUpdate}
              styleButton={{
                backgroundColor: "#0078D4",
                border: "none",
                height: "20px",
                width: "60px",
                padding: "4px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                minHeight: "32px",
              }}
              textButton={"Cập nhật"}
              styletextButton={{
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "500",
              }}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="phone">SĐT</WrapperLabel>
            <InputForm
              style={{ height: "48px", width: "500px" }}
              id="phone"
              value={phone}
              handleOnChange={handleOnChangePhone}
            />
            <ButtonComponent
              onClick={handleUpdate}
              styleButton={{
                backgroundColor: "#0078D4",
                border: "none",
                height: "20px",
                width: "60px",
                padding: "4px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                minHeight: "32px",
              }}
              textButton={"Cập nhật"}
              styletextButton={{
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "500",
              }}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="address">Địa chỉ</WrapperLabel>
            <InputForm
              style={{ height: "48px", width: "500px" }}
              id="adress"
              value={address}
              handleOnChange={handleOnChangeAddress}
            />
            <ButtonComponent
              onClick={handleUpdate}
              styleButton={{
                backgroundColor: "#0078D4",
                border: "none",
                height: '20px',
                width: '60px',
                padding: "4px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                minHeight: "32px",
              }}
              textButton={"Cập nhật"}
              styletextButton={{
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "500",
              }}
            />
          </WrapperInput>
          <WrapperInput>
            <WrapperLabel htmlFor="avatar">Avatar</WrapperLabel>
            <WrapperUploadFile
              onChange={handleOnChangeAvatar}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn file ảnh</Button>
            </WrapperUploadFile>
            {avatar && (
              <img
                src={avatar}
                style={{
                  height: "60px",
                  width: "60px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                alt="avatar"
              />
            )}
            <ButtonComponent
              onClick={handleUpdate}
              styleButton={{
                backgroundColor: "#0078D4",
                border: "none",
                height: "20px",
                width: "60px",
                padding: "4px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                minHeight: "32px",
              }}
              textButton={"Cập nhật"}
              styletextButton={{
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: "500",
              }}
            />
          </WrapperInput>
        </WrapperContentProfile>
      </div>
    </Spin>
  );
};

export default ProfilePage;
