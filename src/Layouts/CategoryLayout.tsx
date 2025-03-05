import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Aside from "../Components/Aside";
import { useEffect } from "react";

const CategoryLayout = () => {
  // const navigate = useNavigate();
  // let location = useLocation();
  // useEffect(() => {
  //   if (localStorage.getItem("user")) {
  //     navigate(location.pathname);
  //   } else {
  //     navigate("/sign-in");
  //   }
  // }, []);
  return (
    <>
      <div className="w-full max-w-[1140px] gap-[11.25px] mt-[95px] mx-auto flex">
        <Aside />
        <div className="w-full">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default CategoryLayout;
