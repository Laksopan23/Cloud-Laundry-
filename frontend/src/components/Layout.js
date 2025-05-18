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
import useLogout from "../mock/logout";
import imageSrc from "../images/logo.png";

const { Header, Content, Footer, Sider } = Layout;
const { useBreakpoint } = Grid;

const SiderItems = [
  { key: "dashboard", icon: <HomeOutlined />, label: "Dashboard" },
  { key: "invoice", icon: <FileTextOutlined />, label: "Invoice" },
  { key: "orders", icon: <ShoppingCartOutlined />, label: "Orders" },
  { key: "timer", icon: <ClockCircleOutlined />, label: "Cart" },
  { key: "addpro", icon: <PlusSquareOutlined />, label: "Add Products" },
  { key: "addLay", icon: <LayoutOutlined />, label: "Home Layouts" },
];

const adminItems = [
  { key: "dashboard", icon: <HomeOutlined />, label: "Dashboard" },
  { key: "invoice", icon: <FileTextOutlined />, label: "Invoice" },
  { key: "orders", icon: <ShoppingCartOutlined />, label: "Orders" },
  { key: "allEmp", icon: <TeamOutlined />, label: "All Employees" },
];

const headerIteam = [
  { key: "1", text: "profile", icon: <UserSwitchOutlined /> },
  { key: "2", text: "Logout", icon: <LogoutOutlined /> },
];

const shoutableBgColor = "#ff4d4f"; // bright red
const shoutableHoverColor = "#ffa39e"; // light red/pink

const App = ({ children }) => {
  const navigate = useNavigate();
  const logout = useLogout();
  const [collapsed, setCollapsed] = useState(false);
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
    switch (item.key) {
      case "dashboard":
        navigate("/");
        break;
      case "invoice":
        navigate("/invoice");
        break;
      case "orders":
        navigate("/orders");
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
      case "allEmp":
        navigate("/all");
        break;
      default:
        break;
    }
  };

  // Custom style for Menu items to add shoutable background and hover colors
  const menuItemStyle = {
    margin: "6px 12px",
    borderRadius: 6,
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={225}
          collapsedWidth={0}
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
          <div>
            <img src={imageSrc} alt="Logo" style={{ width: "100%" }} />
          </div>
          <Menu
            theme="light"
            mode="inline"
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
            // Use custom className to style items
            // Override default ant design styles via CSS
            // But here we use inline styles for each menu item via itemRender not available directly
          >
            {menuItems.map(({ key, icon, label }) => (
              <Menu.Item
                key={key}
                icon={icon}
                style={{
                  ...menuItemStyle,
                  backgroundColor:
                    window.location.pathname.includes(key) ||
                    (key === "dashboard" && window.location.pathname === "/")
                      ? shoutableBgColor
                      : "transparent",
                  color:
                    window.location.pathname.includes(key) ||
                    (key === "dashboard" && window.location.pathname === "/")
                      ? "#fff"
                      : "inherit",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = shoutableHoverColor)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    window.location.pathname.includes(key) ||
                    (key === "dashboard" && window.location.pathname === "/")
                      ? shoutableBgColor
                      : "transparent")
                }
              >
                {label}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          title="Menu"
          placement="left"
          onClose={() => setShowDrawer(false)}
          open={showDrawer}
          bodyStyle={{ padding: 0 }}
        >
          <Menu
            theme="light"
            mode="inline"
            items={menuItems}
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
                style={{
                  ...menuItemStyle,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = shoutableHoverColor)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                {label}
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
            left: !isMobile ? (collapsed ? 80 : 225) : 0,
            width: !isMobile
              ? `calc(100% - ${collapsed ? 80 : 225}px)`
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
          {/* Mobile Header */}
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
