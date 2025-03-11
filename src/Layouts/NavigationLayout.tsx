import { Outlet } from "react-router-dom";
import Header from "../Components/Header";

const NavigationLayout = () => {

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
