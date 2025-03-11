import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
const MainLayout = () => {
  const navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate(location.pathname);
      if ((location.pathname = "/")) {
        navigate("/category/all");
      }
    } else {
      navigate("/sign-in");
    }
  }, []);
  return (
    <>
      <div className="w-full max-w-[1140px] gap-[11.25px] mx-auto">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
