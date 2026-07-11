import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import JoinPage from "../pages/JoinPage";
import Join from "../pages/Join";
import JoinComplete from "../pages/JoinComplete";
import CookiePage from "../pages/CookiePage";
import UserPage from "../pages/UserPage";

import Home from "../pages/Home";
import Notfound from "../pages/Error/Notfound";
import Unauthorized from "../pages/Error/Unauthorized";
import Login from "../pages/Login";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import BibleForm from "../pages/bible/BibleForm";
import BibleSearch from "../pages/bible/BibleSearch";
import MeditationForm from "../pages/meditation/MeditationForm";
import MeditationDetail from "../pages/meditation/MeditationDetail";
import MeditationList from "../pages/meditation/MeditationList"; 
import ReadingPlanForm from "../pages/readingPlan/ReadingPlanForm";
import { useUser } from "../contexts/UserContext";

const AppRouter = () => {
  const { user, loading } = useUser();
  return (
    <>
      {/* BrowserRouter : 브라우저의 현재 주소 저장하고 감지하는 역할  */}
      <BrowserRouter>
        <Routes> 

          {/* 인증 페이지 전용 레이아웃(헤더 없음) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/joinPage" element={<JoinPage />} />
            <Route path="/join" element={<Join />} />
            <Route path="/join/complete" element={<JoinComplete />} />
            <Route path="/cookie" element={<CookiePage />} /> 
          </Route>

          {/* 일반 레이아웃(헤더 있음) */}
          <Route element={<MainLayout />}>

            {/* 공개페이지 - 권한 체크 없음 */}
            <Route path="/" element={<Home />} />
            <Route path="/bible/search" element={<BibleSearch />} />

            {/* Admin 전용 페이지 */} 
            <Route element={<PrivateRoute requireRole={["ADMIN"]} />}>
              <Route path="/bible/create" element={<BibleForm />} /> 
            </Route>
            
             {/* 로그인 사용자 전용 페이지 */} 
             <Route element={<PrivateRoute requireRole={["USER", "ADMIN"]} />}>
              <Route path="/userPage" element={<UserPage />}/>  
              <Route path="/meditations/new" element={<MeditationForm />}/> 
              <Route path="/meditations/:meditationId/edit" element={<MeditationForm />}/>  
              <Route path="/meditations/:meditationId" element={<MeditationDetail />}/>  
              <Route path="/meditations" element={<MeditationList />}/>  
              <Route path="/ReadingPlan" element={<ReadingPlanForm />}/>    
             </Route> 
          </Route> 

          {/* Not Found */}
          <Route path="*" element={<Notfound />} />

          {/* Unauthorized */}
          <Route path="/Unauthorized" element={<Unauthorized />} /> 
  
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
