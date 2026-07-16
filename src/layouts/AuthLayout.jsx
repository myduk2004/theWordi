import Footer from "../components/Footer";
import { Outlet, Link } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default AuthLayout;
