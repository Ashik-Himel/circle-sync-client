import { Toaster } from "react-hot-toast";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from "react";

const MainLayout = () => {
  const {pathname} = useLocation();
  useEffect(() => {
    scrollTo(0, 0);
  }, [pathname]);
  
  return (
    <div className="flex flex-col [&>*:nth-child(2)]:flex-1 min-h-screen">
      <Header />
      <Outlet />
      <Footer />
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
};

export default MainLayout;