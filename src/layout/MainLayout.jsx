import Footer from "../components/Footer";
import Header from "../components/Header";
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="main-layout [&_main]:pt-[73px] flex flex-col [&>*:nth-child(2)]:flex-1 min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;