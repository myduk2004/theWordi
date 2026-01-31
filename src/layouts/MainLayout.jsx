import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
const MainLayout = ({ children }) => {
  const { pathname } = useLocation();
  const [header, setHeader] = useState({
    bgCss: "",
    title: "",
    subTitle: "",
  });

  useEffect(() => {
    if (
      pathname.startsWith("/bible") &&
      !pathname.startsWith("/bible/compare")
    ) {
      setHeader({
        bgCss: "bg-primary text-white",
        title: "하나님의 말씀",
        subTitle:
          "태초에 말씀이 계셨고, 그 말씀이 하나님과 함께 계셨으니, 그 말씀은 하나님이셨느니라.",
      });
    } else if (pathname.startsWith("/bible/compare")) {
      setHeader({
        bgCss: "bg-primary text-white",
        title: "Welcome to Scrolling Nav",
        subTitle:
          " A functional Bootstrap 5 boilerplate for one page scrolling websites",
      });
    } else if (pathname.startsWith("/meditation")) {
      setHeader({
        bgCss: "bg-primary text-white",
        title: "Welcome to Scrolling Nav",
        subTitle:
          " A functional Bootstrap 5 boilerplate for one page scrolling websites",
      });
    } else {
      setHeader({
        bgCss: "bg-primary  text-white",
        title: "하나님의 말씀",
        subTitle:
          "태초에 말씀이 계셨고, 그 말씀이 하나님과 함께 계셨으니, 그 말씀은 하나님이셨느니라.",
      });
    }
  }, [pathname]);

  return (
    <div>
      <Header header={header}></Header>
      {children}
      <Footer></Footer>
    </div>
  );
};

export default MainLayout;
