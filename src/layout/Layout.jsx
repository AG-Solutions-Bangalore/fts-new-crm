import { styled, Container, Box } from "@mui/material";
import Sidebar from "./sidebar/Sidebar";
import Header from "./header/Header";
import React from "react";
import Footer from "../components/Footer";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  padding: "20px",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  // paddingBottom: "60px",
  flexDirection: "column",
  // zIndex: 1,     i remove this because it occur problem for mantine drawer
  backgroundColor: "transparent",
}));

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed); // Toggle sidebar collapsed state
  };
  return (
    <MainWrapper className="mainwrapper  bg-[#F0F5F9] ">
      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
        isCollapsed={isCollapsed}
      />
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper className="page-wrapper   max-w-full">
        {/* ------------------------------------------- */}
        {/* PageContent */}
        {/* ------------------------------------------- */}
        <Container
          // sx={{
          //   maxWidth: "max-w-screen !important",
          // }}
          sx={{
            maxWidth: "100% !important",
            px: "10px !important",
            mx: "10px !important",
          }}
        >
          {/* ------------------------------------------- */}
          {/* Header */}
          {/* ------------------------------------------- */}
          <Header
            toggleSidebar={toggleSidebar}
            toggleMobileSidebar={() => setMobileSidebarOpen(true)}
          />
          {/* ------------------------------------------- */}
          {/* Page Route */}
          {/* ------------------------------------------- */}
          <Box sx={{ minHeight: "calc(100vh - 170px)", py: 3 }}>{children}</Box>
          {/* ------------------------------------------- */}
          {/* End Page */}
          {/* ------------------------------------------- */}
        </Container>
        <div className="px-4 pt-4 md:px-7 md:pt-7  lg:px-7 lg:pt-7 ">
          {" "}
          <Footer />
        </div>
      </PageWrapper>
    </MainWrapper>
  );
};

export default Layout;
