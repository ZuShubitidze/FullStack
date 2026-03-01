import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router";

const Root = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="grow md:mx-25 mx-6 mb-10">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Root;
