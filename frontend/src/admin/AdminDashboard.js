import React, { useEffect, useState } from "react";
import { Button, Card, Progress, Calendar } from "antd";
import {
  FileTextOutlined,
  CheckCircleFilled,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Layout from "../components/Layout";

function Dashboard() {
  const [ordersData, setOrdersData] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    pendingOrders: 0,
    ordersPerService: {},
    statusBreakdown: {},
  });
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserRole = localStorage.getItem("role");
    if (storedUsername) {
      setUsername(storedUsername);
      console.log("Logged in as:", storedUsername);
    }
    if (storedUserRole) {
      setUserRole(storedUserRole);
      console.log("User role:", storedUserRole);
    }

    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrdersData(data);
        calculateAnalytics(data);
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
      });

    if (storedUserRole === "admin") {
      fetch("http://localhost:5000/api/revenue")
        .then((res) => res.json())
        .then((data) => {
          setTotalRevenue(data.totalRevenue || 0);
        })
        .catch((err) => {
          console.error("Failed to fetch revenue:", err);
        });

      fetch("http://localhost:5000/api/customers/count")
        .then((res) => res.json())
        .then((data) => {
          setTotalCustomers(data.totalCustomers || 0);
        })
        .catch((err) => {
          console.error("Failed to fetch customers:", err);
        });
    }
  }, []);

  const calculateAnalytics = (orders) => {
    let totalOrders = orders.length;
    let completedOrders = 0;
    let cancelledOrders = 0;
    let pendingOrders = 0;
    let ordersPerService = {};
    let statusBreakdown = {};

    orders.forEach((order) => {
      const service = order.selectedService;
      ordersPerService[service] = (ordersPerService[service] || 0) + 1;

      const status = order.status;
      statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;

      if (status.toLowerCase() === "completed") {
        completedOrders += 1;
      } else if (status.toLowerCase() === "cancelled") {
        cancelledOrders += 1;
      } else if (status.toLowerCase() === "pending") {
        pendingOrders += 1;
      }
    });

    setAnalytics({
      totalOrders,
      completedOrders,
      cancelledOrders,
      pendingOrders,
      ordersPerService,
      statusBreakdown,
    });
  };

  return (
    <Layout>
      <div className="p-2">
        <h2 className="font-bold text-center text-xl">
          Dashboard - Welcome, {username || "Employee"}
        </h2>

        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* LEFT PANEL */}
          <div className="w-full lg:w-[65%]">
            <h3 className="font-bold text-left mb-5">Today's Orders</h3>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-5 mb-10 lg:flex lg:flex-nowrap lg:justify-between">
              <StatCard
                icon={<FileTextOutlined />}
                title="Total Orders"
                value={analytics.totalOrders.toString()}
                change="+5% from yesterday"
                bgColor="bg-[#fff3da]"
                iconBg="bg-[#ff9966]"
              />
              <StatCard
                icon={<CheckCircleFilled />}
                title="Completed Orders"
                value={analytics.completedOrders.toString()}
                change="+1.2% from yesterday"
                bgColor="bg-[#e8fff0]"
                iconBg="bg-[#00c853]"
              />
              <StatCard
                icon={<CloseCircleOutlined />}
                title="Cancelled Orders"
                value={analytics.cancelledOrders.toString()}
                change="0.5% from yesterday"
                bgColor="bg-[#ffe6eb]"
                iconBg="bg-[#ff4d6d]"
              />
              <StatCard
                icon={<ClockCircleOutlined />}
                title="Pending Orders"
                value={analytics.pendingOrders.toString()}
                change="0.3% from yesterday"
                bgColor="bg-[#f3e8ff]"
                iconBg="bg-[#b388ff]"
              />
              {userRole === "admin" && (
                <>
                  <StatCard
                    icon={<DollarOutlined />}
                    title="Total Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    change="+3% from yesterday"
                    bgColor="bg-[#e6f7ff]"
                    iconBg="bg-[#1890ff]"
                  />
                  <StatCard
                    icon={<UserOutlined />}
                    title="Total Customers"
                    value={totalCustomers.toString()}
                    change="+2% from yesterday"
                    bgColor="bg-[#f6ffed]"
                    iconBg="bg-[#52c41a]"
                  />
                </>
              )}
            </div>

            {/* Top Services */}
            <h3 className="font-bold mb-5 mt-20 text-left lg:ml-[250px]">
              Top Services
            </h3>
            <div className="w-full max-w-[580px]">
              {Object.entries(analytics.ordersPerService).map(
                ([service, count], index) => (
                  <div key={index} className="mb-5">
                    <div className="flex justify-between font-medium">
                      <span>{service}</span>
                      <span
                        className="border px-2 py-0.5 rounded-full text-xs"
                        style={{
                          borderColor: getColor(service),
                          color: getColor(service),
                        }}
                      >
                        {count} orders
                      </span>
                    </div>
                    <Progress
                      percent={(count / analytics.totalOrders) * 100}
                      strokeColor={getColor(service)}
                      showInfo={false}
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon, title, value, change, bgColor, iconBg }) {
  return (
    <div
      className={`stat-card ${bgColor} rounded-2xl p-5 text-center flex-grow min-w-[140px] max-w-[180px] lg:min-w-[185px] lg:max-w-[250px]`}
    >
      <div
        className={`${iconBg} rounded-full w-10 h-10 mx-auto mb-2 flex items-center justify-center text-white text-lg`}
      >
        {icon}
      </div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-gray-700 mb-1">{title}</div>
      <div className="text-xs text-blue-600">{change}</div>
    </div>
  );
}

function getColor(name) {
  switch (name) {
    case "Laundry Services":
      return "#1e88e5";
    case "Curtains Cleaning":
      return "#00c853";
    case "Sofa/Carpet/Mattress Cleaning":
      return "#b388ff";
    case "House Deep Cleaning":
      return "#ff9100";
    default:
      return "#7c4dff";
  }
}

export default Dashboard;
