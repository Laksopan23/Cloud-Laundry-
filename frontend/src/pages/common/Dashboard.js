import React, { useEffect, useState } from "react";
import {
  FileTextOutlined,
  CheckCircleFilled,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Calendar } from "antd";
import Layout from "../../components/Layout";

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

  const notifications = [
    { id: 1, message: "Invoice #123545 is pending" },
    { id: 2, message: "Invoice #123546 is pending" },
    { id: 3, message: "Invoice #123547 is pending" },
    { id: 4, message: "Invoice #123548 is pending" },
  ];

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedUserRole = localStorage.getItem("role");
    if (storedUsername) setUsername(storedUsername);
    if (storedUserRole) setUserRole(storedUserRole);

    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrdersData(data);
        calculateAnalytics(data);
      })
      .catch((err) => console.error("Failed to fetch orders:", err));

    if (storedUserRole === "admin") {
      fetch("http://localhost:5000/api/revenue")
        .then((res) => res.json())
        .then((data) => setTotalRevenue(data.totalRevenue || 0))
        .catch((err) => console.error("Failed to fetch revenue:", err));

      fetch("http://localhost:5000/api/customers/count")
        .then((res) => res.json())
        .then((data) => setTotalCustomers(data.totalCustomers || 0))
        .catch((err) => console.error("Failed to fetch customers:", err));
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

      if (status.toLowerCase() === "completed") completedOrders++;
      else if (status.toLowerCase() === "cancelled") cancelledOrders++;
      else if (status.toLowerCase() === "pending") pendingOrders++;
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
      <div className="p-4">
        <h2 className="font-bold text-center text-xl mb-6">
          Dashboard - Welcome, {username || "Employee"}
        </h2>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/3">
            <h3 className="font-bold mb-4">Today's Orders</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap justify-center lg:justify-between gap-4 mb-8">
              <StatCard
                icon={<FileTextOutlined />}
                title="Total Orders"
                value={analytics.totalOrders.toString()}
                change="+5% from yesterday"
                bgColor="bg-yellow-100"
                iconBg="bg-orange-400"
              />
              <StatCard
                icon={<CheckCircleFilled />}
                title="Completed Orders"
                value={analytics.completedOrders.toString()}
                change="+1.2% from yesterday"
                bgColor="bg-green-100"
                iconBg="bg-green-600"
              />
              <StatCard
                icon={<CloseCircleOutlined />}
                title="Cancelled Orders"
                value={analytics.cancelledOrders.toString()}
                change="0.5% from yesterday"
                bgColor="bg-pink-100"
                iconBg="bg-red-500"
              />
              <StatCard
                icon={<ClockCircleOutlined />}
                title="Pending Orders"
                value={analytics.pendingOrders.toString()}
                change="0.3% from yesterday"
                bgColor="bg-purple-100"
                iconBg="bg-purple-400"
              />
              {userRole === "admin" && (
                <>
                  <StatCard
                    icon={<DollarOutlined />}
                    title="Total Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    change="+3% from yesterday"
                    bgColor="bg-blue-100"
                    iconBg="bg-blue-500"
                  />
                  <StatCard
                    icon={<UserOutlined />}
                    title="Total Customers"
                    value={totalCustomers.toString()}
                    change="+2% from yesterday"
                    bgColor="bg-green-50"
                    iconBg="bg-green-400"
                  />
                </>
              )}
            </div>

            <h3 className="font-bold text-center mb-6">Top Services</h3>
            <div>
              {Object.entries(analytics.ordersPerService).map(
                ([service, count], i) => (
                  <div key={i} className="mb-5">
                    <div className="flex justify-between font-medium">
                      <span>{service}</span>
                      <span
                        className={`text-xs border px-2 py-1 rounded-full`}
                        style={{
                          borderColor: getColor(service),
                          color: getColor(service),
                        }}
                      >
                        {count} orders
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(count / analytics.totalOrders) * 100}%`,
                          backgroundColor: getColor(service),
                        }}
                      ></div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="lg:w-1/3 mt-10 lg:mt-0">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Notifications</h3>
              <button className="text-blue-600 text-sm">View All</button>
            </div>
            <div>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="border p-3 bg-gray-100 rounded-md mb-2 flex items-center"
                >
                  <FileTextOutlined className="mr-2 text-purple-500" />
                  {notif.message}
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Calendar
                fullscreen={false}
                headerRender={({ value, onChange }) => (
                  <div className="p-2 flex justify-between items-center">
                    <button
                      onClick={() =>
                        onChange(value.clone().subtract(1, "month"))
                      }
                    >
                      {"<"}
                    </button>
                    <h3 className="m-0">{value.format("MMMM")}</h3>
                    <button
                      onClick={() => onChange(value.clone().add(1, "month"))}
                    >
                      {">"}
                    </button>
                  </div>
                )}
              />
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
      className={`p-5 rounded-2xl text-center flex-shrink-0 w-full xs:w-[140px] md:w-[180px] ${bgColor}`}
    >
      <div
        className={`rounded-full w-10 h-10 mx-auto flex items-center justify-center text-white text-lg ${iconBg} mb-2`}
      >
        {icon}
      </div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-gray-600 mb-1">{title}</div>
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
    case "Domestic Cleaning":
      return "#ff9100";
    default:
      return "#7c4dff";
  }
}

export default Dashboard;
