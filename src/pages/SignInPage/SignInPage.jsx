import React, { useCallback, useEffect, useState } from "react";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
} from "./style";
import InputForm from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import SignIn from "../../assets/images/sign-in.png";
import { Image, Spin } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/UserSlide";
import { useMessage } from "../../components/Message/MessageProvider";
import { GoogleLogin } from "@react-oauth/google";

const SignInPage = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { success, error } = useMessage();

  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isSuccess, isError, isLoading } = mutation;

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      const storage = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storage);
      const res = await UserService.getDetailUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }));
    },
    [dispatch]
  );

  useEffect(() => {
    if (isSuccess && data && data?.status !== "ERR") {
      success("Đăng nhập thành công!");
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      localStorage.setItem(
        "refresh_token",
        JSON.stringify(data?.refresh_token)
      );
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
      if (location?.state) {
        navigate(location.state);
      } else {
        navigate("/");
      }
    } else if (isError || data?.status === "ERR") {
      error(data?.message || "Xảy ra lỗi, vui lòng thử lại!");
    }
  }, [
    isSuccess,
    isError,
    data,
    navigate,
    handleGetDetailsUser,
    success,
    error,
    location,
  ]);

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };

  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const handleSignIn = () => {
    if (!email || !password) {
      setErrorMessage("Vui lòng nhập email và mật khẩu!");
      return;
    }

    setErrorMessage(""); // Xóa lỗi trước đó nếu có
    mutation.mutate({ email, password });
  };

  const handleNavigateSignUp = () => {
    navigate("/sign-up");
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
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          position: "relative",
        }}
      >
        {/* Loading overlay */}
        {isLoading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <Spin size="large" />
          </div>
        )}

        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng nhập và tạo tài khoản</p>
          <InputForm
            style={{ marginBottom: "20px" }}
            placeholder="abc@gmail.com"
            value={email}
            handleOnChange={handleOnChangeEmail}
          />
          <div style={{ position: "relative", marginBottom: "15px" }}>
            <span
              onClick={() => setIsShowPassword(!isShowPassword)}
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
                cursor: "pointer",
              }}
            >
              {isShowPassword ? <EyeFilled /> : <EyeInvisibleFilled />}
            </span>
            <InputForm
              placeholder="Mật khẩu"
              type={isShowPassword ? "text" : "password"}
              value={password}
              handleOnChange={handleOnChangePassword}
            />
          </div>

          {/* Hiển thị lỗi khi chưa nhập thông tin */}
          {errorMessage && <span style={{ color: "red" }}>{errorMessage}</span>}

          {/* Hiển thị lỗi từ API */}
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}

          <ButtonComponent
            onClick={handleSignIn}
            size={40}
            styleButton={{
              background: "rgb(255,57,69)",
              height: "50px",
              width: "100%",
              border: "none",
              margin: "26px 0 10px",
              borderRadius: "4px",
            }}
            textButton={"Đăng nhập"}
            styletextButton={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "700",
            }}
          />
          <div style={{ margin: "10px 0", textAlign: "center" }}>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const { credential } = credentialResponse;
                if (credential) {
                  const decoded = jwtDecode(credential); // lấy thông tin user từ token Google
                  const { email, name, sub } = decoded;

                  // Gửi token hoặc email tới backend để xử lý đăng nhập/đăng ký
                  const res = await UserService.loginWithGoogle({
                    email,
                    name,
                    googleId: sub,
                  });
                  if (res?.status === "OK") {
                    success("Đăng nhập bằng Google thành công!");
                    localStorage.setItem(
                      "access_token",
                      JSON.stringify(res?.access_token)
                    );
                    localStorage.setItem(
                      "refresh_token",
                      JSON.stringify(res?.refresh_token)
                    );

                    const decodedToken = jwtDecode(res?.access_token);
                    if (decodedToken?.id) {
                      await handleGetDetailsUser(
                        decodedToken?.id,
                        res?.access_token
                      );
                    }
                    navigate("/");
                  } else {
                    error("Đăng nhập Google thất bại!");
                  }
                }
              }}
              onError={() => {
                error("Đăng nhập Google thất bại!");
              }}
            />
          </div>

          <WrapperTextLight>Quên mật khẩu?</WrapperTextLight>
          <p>
            Chưa có tài khoản?
            <WrapperTextLight onClick={handleNavigateSignUp}>
              Tạo tài khoản
            </WrapperTextLight>
          </p>
        </WrapperContainerLeft>

        <WrapperContainerRight>
          <Image
            src={SignIn}
            alt="Image"
            preview={false}
            height={203}
            width={203}
          />
          <h4>Mua sắm tại NDM Shop</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignInPage;
