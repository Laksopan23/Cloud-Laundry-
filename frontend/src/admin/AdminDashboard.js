import React, { useEffect, useState } from 'react';
import { Button, Card, Progress, Calendar } from 'antd';
import {
  FileTextOutlined,
  CheckCircleFilled,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Layout from '../components/Layout';

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
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState(''); // New state for user role
  const [totalRevenue, setTotalRevenue] = useState(0); // New state for total revenue
  const [totalCustomers, setTotalCustomers] = useState(0); // New state for total customers


  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedUserRole = localStorage.getItem('role'); // Retrieve user role
    if (storedUsername) {
      setUsername(storedUsername);
      console.log('Logged in as:', storedUsername);
    }
    if (storedUserRole) {
      setUserRole(storedUserRole);
      console.log('User role:', storedUserRole);
    }

    // Fetch orders data
    fetch('http://localhost:5000/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrdersData(data);
        calculateAnalytics(data);
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
      });

    // Fetch total revenue and customers if user is admin
    if (storedUserRole === 'admin') {
      // Fetch total revenue
      fetch('http://localhost:5000/api/revenue')
        .then((res) => res.json())
        .then((data) => {
          setTotalRevenue(data.totalRevenue || 0);
        })
        .catch((err) => {
          console.error('Failed to fetch revenue:', err);
        });

      // Fetch total customers
      fetch('http://localhost:5000/api/customers/count')
        .then((res) => res.json())
        .then((data) => {
          setTotalCustomers(data.totalCustomers || 0);
        })
        .catch((err) => {
          console.error('Failed to fetch customers:', err);
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

      if (status.toLowerCase() === 'completed') {
        completedOrders += 1;
      } else if (status.toLowerCase() === 'cancelled') {
        cancelledOrders += 1;
      } else if (status.toLowerCase() === 'pending') {
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
      <style>
        {`
          @media (min-width: 992px) {
            .dashboard-container {
              display: flex;
              gap: 20px;
              align-items: flex-start;
            }
            .left-panel {
              width: 65%;
            }
            .right-panel {
              width: 35%;
            }
            .stat-card-container {
              flex-wrap: nowrap;
              justify-content: space-between;
            }
            .stat-card {
              width: 180px;
            }
          }

          @media (max-width: 991px) {
            .stat-card-container {
              flex-wrap: wrap;
              justify-content: center;
            }
            .stat-card {
              width: 48%;
            }
          }
        `}
      </style>

      <div style={{ padding: 10 }}>
        <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Dashboard - Welcome, {username || 'Employee'}
        </h2>

        <div className="dashboard-container">
          {/* LEFT PANEL */}
          <div className="left-panel">
            <h3 style={{ fontWeight: 'bold', textAlign: 'Left', marginBottom: 20 }}>
              Today's Orders
            </h3>

            {/* Stat Cards */}
            <div
              className="stat-card-container"
              style={{
                display: 'flex',
                gap: 20,
                marginBottom: 30,
              }}
            >
              <StatCard
                icon={<FileTextOutlined />}
                title="Total Orders"
                value={analytics.totalOrders.toString()}
                change="+5% from yesterday"
                bgColor="#fff3da"
                iconBg="#ff9966"
              />
              <StatCard
                icon={<CheckCircleFilled />}
                title="Completed Orders"
                value={analytics.completedOrders.toString()}
                change="+1.2% from yesterday"
                bgColor="#e8fff0"
                iconBg="#00c853"
              />
              <StatCard
                icon={<CloseCircleOutlined />}
                title="Cancelled Orders"
                value={analytics.cancelledOrders.toString()}
                change="0.5% from yesterday"
                bgColor="#ffe6eb"
                iconBg="#ff4d6d"
              />
              <StatCard
                icon={<ClockCircleOutlined />}
                title="Pending Orders"
                value={analytics.pendingOrders.toString()}
                change="0.3% from yesterday"
                bgColor="#f3e8ff"
                iconBg="#b388ff"
              />
              {userRole === 'admin' && (
                <>
                  <StatCard
                    icon={<DollarOutlined />}
                    title="Total Revenue"
                    value={`$${totalRevenue.toLocaleString()}`}
                    change="+3% from yesterday"
                    bgColor="#e6f7ff"
                    iconBg="#1890ff"
                  />
                  <StatCard
                    icon={<UserOutlined />}
                    title="Total Customers"
                    value={totalCustomers.toString()}
                    change="+2% from yesterday"
                    bgColor="#f6ffed"
                    iconBg="#52c41a"
                  />
                </>
              )}
            </div>

            {/* Top Services */}
            <h3 style={{ fontWeight: 'bold', marginBottom: 20, marginLeft:"250px",marginTop:"75px" }}>
              Top Services
            </h3>
            <div style={{  width:'580px'}}>
              {Object.entries(analytics.ordersPerService).map(([service, count], index) => (
                <div key={index} style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '500',
                    }}
                  >
                    <span>{service}</span>
                    <span
                      style={{
                        border: `1px solid ${getColor(service)}`,
                        padding: '2px 8px',
                        borderRadius: 12,
                        color: getColor(service),
                        fontSize: 12,
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
              ))}
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
      className="stat-card"
      style={{
        backgroundColor: bgColor,
        borderRadius: 15,
        padding: 20,
        textAlign: 'center',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          backgroundColor: iconBg,
          borderRadius: '50%',
          width: 40,
          height: 40,
          margin: '0 auto 10px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 18,
        }}
      >
        {icon}
      </div>
      <div style={{ fontSize: 18, fontWeight: 'bold' }}>{value}</div>
      <div style={{ color: '#555', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: '#2962ff' }}>{change}</div>
    </div>
  );
}

function getColor(name) {
  switch (name) {
    case 'Laundry Services':
      return '#1e88e5';
    case 'Curtains Cleaning':
      return '#00c853';
    case 'Sofa/Carpet/Mattress Cleaning':
      return '#b388ff';
    case 'House Deep Cleaning':
      return '#ff9100';
    default:
      return '#7c4dff';
  }
}

export default Dashboard;