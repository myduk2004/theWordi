import { useLocation, Outlet, Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { HeaderApi } from "../api/headerApi";

const MainLayout = () => {
  const { pathname } = useLocation();
  const [headerTitles, setHeaderTitles] = useState([]);

  useEffect(() => {
    const loadHeaderTitles = async () => {
      const data = await HeaderApi.getHeaderTitle();
      setHeaderTitles(data);
    };

    loadHeaderTitles();
  }, []);

  const header = useMemo(() => {
    let menuId = 0;
    if (pathname.startsWith("/bible") && !pathname.startsWith("/bible/search")) menuId = 1000;
    else if (pathname.startsWith("/bible/search"))
      menuId = 1; //성경검색
    else if (pathname.startsWith("/meditations"))
      menuId = 2; //묵상
    else if (pathname.startsWith("/readingPlan"))
      menuId = 3; //읽기계획표
    else menuId = 0; //메인화면

    const title = headerTitles.find((v) => v.menuId === menuId);
    if (title) {
      return {
        bgCss: "bg-primary text-white",
        title: `${title.text}`,
        subTitle: `${title.subTitle}`,
        source: `${title.source}`,
      };
    }

    return {
      bgCss: "bg-primary text-white",
      title: "기본",
      subTitle: "기본",
      source: "기본",
    };
  }, [pathname, headerTitles]);

  return (
    <div>
      <Header header={header}></Header>
      <Outlet />
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
