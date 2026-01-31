import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import JoinPage from "../pages/JoinPage";
import CookiePage from "../pages/CookiePage";
import UserPage from "../pages/UserPage";

import Home from "../pages/Home";
import Notfound from "../pages/Error/Notfound";
import Login from "../pages/Login";
import MainLayout from "../layouts/MainLayout";
import BibleForm from "../pages/bible/BibleForm";
import BibleSearch from "../pages/bible/BibleSearch";

const AppRouter = () => {
  return (
    <>
      {/* BrowserRouter : 브라우저의 현재 주소 저장하고 감지하는 역할  */}
      <BrowserRouter>
        <Routes>
          {/* 로그인 관련 */}
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/join" element={<JoinPage></JoinPage>}></Route>
          <Route path="/cookie" element={<CookiePage></CookiePage>}></Route>

          {/* Not Found */}
          <Route path="*" element={<Notfound />} />

          {/* Home (공개 페이지) */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
              </MainLayout>
            }
          />

          <Route element={<PrivateRoute />}>
            <Route
              path="/userPage"
              element={
                <MainLayout>
                  <UserPage />
                </MainLayout>
              }
            />
            <Route
              path="/bible/create"
              element={
                <MainLayout>
                  <BibleForm />
                </MainLayout>
              }
            />

             <Route
              path="/bible/search"
              element={
                <MainLayout>
                  <BibleSearch />
                </MainLayout>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
