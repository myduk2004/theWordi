import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import JoinPage from "../pages/JoinPage";
import Join from "../pages/Join";
import CookiePage from "../pages/CookiePage";
import UserPage from "../pages/UserPage";

import Home from "../pages/Home";
import Notfound from "../pages/Error/Notfound";
import Unauthorized from "../pages/Error/Unauthorized";
import Login from "../pages/Login";
import MainLayout from "../layouts/MainLayout";
import BibleForm from "../pages/bible/BibleForm";
import BibleSearch from "../pages/bible/BibleSearch";
import MeditationForm from "../pages/meditation/MeditationForm";
import MeditationDetail from "../pages/meditation/MeditationDetail";
import MeditationList from "../pages/meditation/MeditationList";
import { useUser } from "../contexts/UserContext";

const AppRouter = () => {
  const { user, loading } = useUser();
  return (
    <>
      {/* BrowserRouter : 브라우저의 현재 주소 저장하고 감지하는 역할  */}
      <BrowserRouter>
        <Routes>
          {/* 로그인 관련 */}
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/joinPage" element={<JoinPage></JoinPage>}></Route>
          <Route path="/join" element={<Join></Join>}></Route>
          <Route path="/cookie" element={<CookiePage></CookiePage>}></Route> 
      
          {/* Not Found */}
          <Route path="*" element={<Notfound />} />

          {/* Unauthorized */}
          <Route path="/Unauthorized" element={<Unauthorized />} />


          {/* Home (공개 페이지) */}
          <Route
            path="/"
            element={
              <MainLayout>
                <Home />
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

          
          <Route element={<PrivateRoute requireRole="ADMIN"  />}>
            <Route
                path="/bible/create"
                element={
                  <MainLayout>
                    <BibleForm />
                  </MainLayout>
                }
              />
          </Route>
         

          <Route element={<PrivateRoute  requireRole="USER"  />}>
            <Route
              path="/userPage"
              element={
                <MainLayout>
                  <UserPage />
                </MainLayout>
              }
            />  


            <Route
              path="/meditations/new"
              element={
                <MainLayout>
                  <MeditationForm />
                </MainLayout>
              }
            />  

             <Route
              path="/meditations/:meditationId/edit"
              element={
                <MainLayout>
                  <MeditationForm />
                </MainLayout>
              }
            />  

            <Route
              path="/meditations/:meditationId"
              element={
                <MainLayout>
                  <MeditationDetail />
                </MainLayout>
              }
            />  

            <Route
              path="/meditations"
              element={
                <MainLayout>
                  <MeditationList />
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
