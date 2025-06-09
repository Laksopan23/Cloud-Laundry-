import React, { useState, useEffect } from "react";
import {
  HomeOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  ClockCircleOutlined,
  PlusSquareOutlined,
  LayoutOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Button,
  FloatButton,
  Grid,
  Drawer,
} from "antd";
import { useNavigate } from "react-router-dom";
import useLogout from "../pages/Auth/logout";
import imageSrc from "../images/logo.png";

const { Header, Content, Footer, Sider } = Layout;
const { useBreakpoint } = Grid;

const SiderItems = [
  { key: "/", icon: <HomeOutlined />, label: "Dashboard" },
  { key: "/invoice", icon: <FileTextOutlined />, label: "Invoice" },
  { key: "/orders", icon: <ShoppingCartOutlined />, label: "Orders" },

];

const adminItems = [
  { key: "/", icon: <HomeOutlined />, label: "Dashboard" },
  { key: "/invoice", icon: <FileTextOutlined />, label: "Invoice" },
  { key: "/orders", icon: <ShoppingCartOutlined />, label: "Orders" },
  { key: "/all", icon: <TeamOutlined />, label: "All Employees" },
];

const headerIteam = [
  { key: "1", text: "profile", icon: <UserSwitchOutlined /> },
  { key: "2", text: "Logout", icon: <LogoutOutlined /> },
];

const shoutableBgColor = "#5e208e";
const shoutableHoverColor = "#d4beff";

const App = ({ children }) => {
  const navigate = useNavigate();
  const logout = useLogout();
  const [collapsed, setCollapsed] = useState(true);
  const [isBackTopVisible, setIsBackTopVisible] = useState(false);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserRole = localStorage.getItem("role");
    if (storedUsername) setUsername(storedUsername);
    if (storedUserRole) setUserRole(storedUserRole);
  }, []);

  const menuItems = userRole === "admin" ? adminItems : SiderItems;

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
    if (key === "1") navigate("/prof");
    else if (key === "2") logout();
  };

const handleMenuClick = (item) => {
  if (item.key === "/") {
    if (userRole === "admin") {
      navigate("/admin");
    } else {
      navigate("/dash");
    }
  } else {
    navigate(item.key);
  }
};


  const menuItemStyle = {
    margin: "6px 0px",
    borderRadius: 6,
  };

  return (
    <>
      <style>
        {`
          .ant-layout-sider-trigger {
            background-color:#5e208e !important;
            color: #ffffff !important;
          }
          .ant-layout-sider-trigger:hover {
            background-color: #d4beff !important;
          }
        `}
      </style>
      <Layout style={{ minHeight: "100vh" }}>
        {!isMobile && (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={200}
            collapsedWidth={80}
            style={{
              backgroundColor: "#fff",
              overflow: "hidden",
              position: "fixed",
              height: "100vh",
              left: 0,
              zIndex: 10,
              boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ padding: "16px" }}>
              <img src={imageSrc} alt="Logo" style={{ width: "100%" }} />
            </div>
            <Menu
              theme="light"
              mode="inline"
              selectedKeys={[window.location.pathname]}
              onClick={handleMenuClick}
              style={{ borderRight: 0 }}
            >
              {menuItems.map(({ key, icon, label }) => (
                <Menu.Item
                  key={key}
                  icon={icon}
                  style={{
                    ...menuItemStyle,
                    backgroundColor:
                      window.location.pathname === key
                        ? shoutableBgColor
                        : "transparent",
                    color:
                      window.location.pathname === key ? "#fff" : "inherit",
                  }}
                  onMouseEnter={(e) => {
                    if (!e || !e.currentTarget || !e.currentTarget.style) return;
                    e.currentTarget.style.backgroundColor = shoutableHoverColor;
                  }}
                  onMouseLeave={(e) => {
                    if (!e || !e.currentTarget || !e.currentTarget.style) return;
                    e.currentTarget.style.backgroundColor =
                      window.location.pathname === key
                        ? shoutableBgColor
                        : "transparent";
                  }}
                >
                  {label}
                </Menu.Item>
              ))}
            </Menu>
          </Sider>
        )}

        {isMobile && (
         <Drawer
          title="Menu"
          placement="left"
          onClose={() => setShowDrawer(false)}
          open={showDrawer}
          bodyStyle={{ padding: 0 }}
        >
          {/* Navigation Menu */}
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[window.location.pathname]}
            onClick={(item) => {
              handleMenuClick(item);
              setShowDrawer(false);
            }}
            style={{ borderRight: 0 }}
          >
            {menuItems.map(({ key, icon, label }) => (
              <Menu.Item
                key={key}
                icon={icon}
                style={menuItemStyle}
                onMouseEnter={(e) => {
                  if (!e?.currentTarget?.style) return;
                  e.currentTarget.style.backgroundColor = shoutableHoverColor;
                }}
                onMouseLeave={(e) => {
                  if (!e?.currentTarget?.style) return;
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {label}
              </Menu.Item>
            ))}
          </Menu>

          {/* Divider and Profile/Logout */}
          <Menu
            theme="light"
            mode="inline"
            style={{ borderTop: "1px solid #ddd" }}
            onClick={({ key }) => {
              handleHeaderClick(key);
              setShowDrawer(false);
            }}
          >
            {headerIteam.map(({ key, icon, text }) => (
              <Menu.Item
                key={key}
                icon={icon}
                style={menuItemStyle}
              >
                {text}
              </Menu.Item>
            ))}
          </Menu>
        </Drawer>

        )}

        <Layout style={{ marginLeft: !isMobile ? (collapsed ? 80 : 225) : 0 }}>
          <Header
            style={{
              position: "fixed",
              top: 0,
              left: !isMobile ? (collapsed ? 80 : 200) : 0,
              width: !isMobile
                ? `calc(100% - ${collapsed ? 80 : 200}px)`
                : "100%",
              height: "64px",
              backgroundColor: isMobile ? "#ffffff" : "#5e208e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 16px",
              zIndex: 5,
            }}
          >
            {isMobile ? (
              <>
                <Button
                  icon={<MenuOutlined />}
                  type="text"
                  onClick={() => setShowDrawer(true)}
                  style={{ position: "absolute", left: 16 }}
                />
                <img src={imageSrc} alt="Logo" style={{ height: "100px" }} />
              </>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginLeft: "auto",
                }}
              >
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
              padding: 15,
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
    </>
  );
};

export default App;
