import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../Components/Header";
import { useEffect } from "react";

const NavigationLayout = () => {
  const navigate = useNavigate();
  let location = useLocation();

  // useEffect(() => {
  //   if (localStorage.getItem("user")) {
  //     navigate(location.pathname);
  //   } else {
  //     navigate("/sign-in");
  //   }
  // }, []);


  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default NavigationLayout;
