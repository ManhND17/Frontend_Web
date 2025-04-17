import React, { useEffect, useState, useCallback } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SignIn from "../../assets/images/sign-in.png";
import { Image } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useMessage } from "../../components/Message/MessageProvider";

const SignUpPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { success, error } = useMessage();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const mutation = useMutationHooks((data) => UserService.SignUpUser(data));
  const { data, isSuccess, isError } = mutation;

  const handleNavigateSignIn = useCallback(() => {
    navigate("/sign-in");
  }, [navigate]);

  useEffect(() => {
    if (isSuccess) {
      success("Đăng ký thành công!");
      handleNavigateSignIn();
    } else if (isError) {
      error("Xảy ra lỗi");
    }
  }, [success, error, isSuccess, isError, handleNavigateSignIn]);

  const handleOnChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!form.name) newErrors.name = "Họ và tên không được để trống";
    if (!form.email) newErrors.email = "Email không được để trống";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email không hợp lệ";

    if (!form.phone) newErrors.phone = "Số điện thoại không được để trống";
    if (!form.password) newErrors.password = "Mật khẩu không được để trống";
    if (!form.confirmPassword)
      newErrors.confirmPassword = "Xác nhận mật khẩu không được để trống";
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu không khớp";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (!validateForm()) return;
    mutation.mutate(form);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.53)",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "800px",
          height: "600px",
          borderRadius: "6px",
          background: "#fff",
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>
          <InputForm
            style={{ marginBottom: "10px" }}
            placeholder="Họ và tên"
            value={form.name}
            handleOnChange={(value) => handleOnChange("name", value)}
          />
          {errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
          <InputForm
            style={{ marginBottom: "10px" }}
            placeholder="Số điện thoại"
            value={form.phone}
            handleOnChange={(value) => handleOnChange("phone", value)}
          />
          {errors.phone && <span style={{ color: "red" }}>{errors.phone}</span>}
          <InputForm
            style={{ marginBottom: "10px" }}
            placeholder="abc@gmail.com"
            value={form.email}
            handleOnChange={(value) => handleOnChange("email", value)}
          />
          {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="Mật khẩu"
              type={isShowPassword ? "text" : "password"}
              value={form.password}
              handleOnChange={(value) => handleOnChange("password", value)}
            />
          </div>
          {errors.password && (
            <span style={{ color: "red" }}>{errors.password}</span>
          )}
          <div style={{ position: "relative" }}>
            <span
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
            >
              {isShowConfirmPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="Xác nhận mật khẩu"
              type={isShowConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              handleOnChange={(value) =>
                handleOnChange("confirmPassword", value)
              }
            />
          </div>
          {errors.confirmPassword && (
            <span style={{ color: "red" }}>{errors.confirmPassword}</span>
          )}
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
          <ButtonComponent
            onClick={handleSignUp}
            size={40}
            border="none"
            styleButton={{
              background: "rgb(255,57,69)",
              height: "50px",
              width: "100%",
              border: "none",
              margin: "26px 0 10px",
              borderRadius: "4px",
            }}
            textButton={"Đăng ký"}
            styletextButton={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
            }}
          />
          <p style={{ marginTop: "10px" }}>
            Đã có tài khoản?
            <WrapperTextLight onClick={handleNavigateSignIn}>
              Đăng nhập
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image src={SignIn} alt="Image" preview={false} height={203} width={203} />
          <h4>Mua sắm tại NDM Shop</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
