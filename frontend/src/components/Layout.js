import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, FloatButton, Grid } from "antd";
import { useNavigate } from "react-router-dom";
import imageSrc from "../images/logo.png";

const { Header, Content, Footer, Sider } = Layout;
const { useBreakpoint } = Grid;

const SiderItems = [
  { key: "dashboard", icon: <HomeOutlined />, label: "Dashboard" },
  { key: "categories", icon: <HomeOutlined />, label: "Category" },
  { key: "shorts", icon: <HomeOutlined />, label: "Shorts" },
  { key: "timer", icon: <HomeOutlined />, label: "Cart" },
  { key: "addpro", icon: <HomeOutlined />, label: "Add Products" },
  { key: "addLay", icon: <HomeOutlined />, label: "Home Layouts" },
];

const headerIteam = [
  { key: "1", text: "profile", icon: <UserSwitchOutlined /> },
  { key: "2", text: "Login", icon: <LogoutOutlined /> },
];

const App = ({ children }) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [isBackTopVisible, setIsBackTopVisible] = useState(false);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      setIsBackTopVisible(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleHeaderClick = (key) => {
    if (key === "1") {
      navigate("/seller");
    } else if (key === "2") {
      localStorage.setItem("authToken", null);
      localStorage.setItem("loggedInUserType", null);
      navigate("/login");
    }
  };

  const handleMenuClick = (item) => {
    switch (item.key) {
      case "dashboard":
        navigate("/");
        break;
      case "categories":
        navigate("/category");
        break;
      case "shorts":
        navigate("/shorts");
        break;
      case "timer":
        navigate("/timer");
        break;
      case "addpro":
        navigate("/add-product");
        break;
      case "addLay":
        navigate("/add");
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={225}
          collapsedWidth={0}
          style={{
            backgroundColor: "white",
            overflow: "hidden",
            position: "fixed",
            height: "100vh",
            left: 0,
            zIndex: 10,
          }}
        >
          <div>
            <img src={imageSrc} alt="Logo" style={{ width: "100%" }} />
          </div>
          <Menu
            theme="light"
            mode="inline"
            items={SiderItems}
            onClick={handleMenuClick}
          />
        </Sider>
      )}

      <Layout style={{ marginLeft: !isMobile ? (collapsed ? 80 : 225) : 0 }}>
        <Header
          style={{
            position: "fixed",
            top: 0,
            left: !isMobile ? (collapsed ? 80 : 225) : 0,
            width: !isMobile
              ? `calc(100% - ${collapsed ? 80 : 225}px)`
              : "100%",
            height: "64px",
            backgroundColor: isMobile ? "#ffffff" : "#5e208e",
            display: "flex",
            alignItems: "center",
            justifyContent: isMobile ? "center" : "space-between",
            padding: "0 16px",
            zIndex: 5,
          }}
        >
          {isMobile && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={imageSrc} alt="Logo" style={{ height: "120px" }} />
            </div>
          )}

          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft:1000 }}>
              {headerIteam.map((item) => (
                <Button
                  key={item.key}
                  type="text"
                  icon={item.icon}
                  style={{ color: "white", fontSize: "18px" }}
                  onClick={() => handleHeaderClick(item.key)}
                >
                  {item.text}
                </Button>
              ))}
            </div>
          )}
        </Header>

        <Content
          style={{
            marginTop: 64,
            padding: 24,
          }}
        >
          <div
            style={{
              padding: 0,
              minHeight: 360,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {isBackTopVisible && (
              <FloatButton.Group shape="circle" style={{ right: 24 }}>
                <FloatButton.BackTop visibilityHeight={0} />
              </FloatButton.Group>
            )}
            {children}
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }} />
      </Layout>
    </Layout>
  );
};

export default App;
