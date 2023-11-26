import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { useState } from "react";

const DashboardLayout = () => {
  const [sidebarShow, setSidebarShow] = useState(false);

  return (
    <main>
      <Header />
      <div className="relative grid grid-cols-1 md:grid-cols-[250px_1fr]">
        <DashboardSidebar sidebarShow={sidebarShow} setSidebarShow={setSidebarShow} />
        <div className="h-[calc(100vh-73px)] overflow-y-auto [&>*]:p-6">
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;