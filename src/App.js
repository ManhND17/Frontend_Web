import React, { Fragment, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import Footer from "./components/FooterComponent/FooterComponent";
import { createGlobalStyle } from "styled-components";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from "./services/UserService";
import { useDispatch } from "react-redux";
import { resetUser, updateUser } from "./redux/slides/UserSlide";
import { MessageProvider } from "./components/Message/MessageProvider";
import { useSelector } from "react-redux";
import ChatInterface from "./components/ChatInterface/ChatInterface";

const GlobalStyle = createGlobalStyle`
  html, body {
    overflow-x: hidden;
    width: 100%;
  }
`;

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    const currentTime = new Date();
    const { decoded } = handleDecoded();
    let storageRefreshToken = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storageRefreshToken);
    const decodedRefreshToken = jwtDecode(refreshToken);
    if (decoded?.exp < currentTime.getTime() / 1000) {
      if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken(refreshToken);
        config.headers["token"] = `Bearer ${data?.access_token}`;
      } else {
        dispatch(resetUser());
      }
    }
  });

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      let storageRefreshToken = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storageRefreshToken);
      const res = await UserService.getDetailUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token, refreshToken }));
    },
    [dispatch]
  );

  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
  }, [handleGetDetailsUser]);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
      console.log("decodedApp", decoded);
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return (
    <MessageProvider>
      <GlobalStyle />
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const isCheckAuth = !route.isPrivate || user.isAdmin;
            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
            return (
              isCheckAuth && (
                <Route
                  key={route.path}
                  path={route.path}
                  element={
                    <div>
                      <Layout>
                        <Page />
                      </Layout>
                      {route.isShowFotter && <Footer />}
                    </div>
                  }
                />
              )
            );
          })}
        </Routes>
        {!user?.isAdmin && <ChatInterface />}
      </Router>
    </MessageProvider>
  );
}

export default App;
