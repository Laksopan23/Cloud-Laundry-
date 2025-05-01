import React from 'react';
import { Button, Card, Progress, Calendar } from 'antd';
import {
  BarChartOutlined,
  FileTextOutlined,
  CheckCircleFilled,
  UserAddOutlined,
} from '@ant-design/icons';
import Layout from '../components/Layout';

function Dashboard() {
  const orders = [
    { name: 'Laundry Services', popularity: 45 },
    { name: 'Curtains Cleaning', popularity: 29 },
    { name: 'Sofa/Carpet/Mattress Cleaning', popularity: 18 },
    { name: 'House Deep Cleaning', popularity: 25 },
  ];

  const notifications = [
    { id: 1, message: 'Invoice #123545 is pending' },
    { id: 2, message: 'Invoice #123546 is pending' },
    { id: 3, message: 'Invoice #123547 is pending' },
    { id: 4, message: 'Invoice #123548 is pending' },
  ];

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
        <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Dashboard</h2>

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
                icon={<BarChartOutlined />}
                title="Total Profit"
                value="$1k"
                change="+8% from yesterday"
                bgColor="#ffe6eb"
                iconBg="#ff4d6d"
              />
              <StatCard
                icon={<FileTextOutlined />}
                title="Total Order"
                value="300"
                change="+5% from yesterday"
                bgColor="#fff3da"
                iconBg="#ff9966"
              />
              <StatCard
                icon={<CheckCircleFilled />}
                title="Orders Done"
                value="5"
                change="+1.2% from yesterday"
                bgColor="#e8fff0"
                iconBg="#00c853"
              />
              <StatCard
                icon={<UserAddOutlined />}
                title="New Customers"
                value="8"
                change="0.5% from yesterday"
                bgColor="#f3e8ff"
                iconBg="#b388ff"
              />
            </div>

            {/* Top Services */}
            <h3 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
              Top Services
            </h3>
            <div>
              {orders.map((order, index) => (
                <div key={index} style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '500',
                    }}
                  >
                    <span>{order.name}</span>
                    <span
                      style={{
                        border: `1px solid ${getColor(order.name)}`,
                        padding: '2px 8px',
                        borderRadius: 12,
                        color: getColor(order.name),
                        fontSize: 12,
                      }}
                    >
                      {order.popularity}%
                    </span>
                  </div>
                  <Progress
                    percent={order.popularity}
                    strokeColor={getColor(order.name)}
                    showInfo={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="right-panel" style={{ marginTop: 40 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ fontWeight: 'bold' }}>Notifications</h3>
              <Button type="link" style={{ padding: 0 }}>
                View All
              </Button>
            </div>
            <div>
              {notifications.map((notif) => (
                <Card
                  key={notif.id}
                  size="small"
                  style={{
                    marginBottom: 10,
                    border: '1px solid #eee',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FileTextOutlined style={{ marginRight: 10, color: '#7e57c2' }} />
                    {notif.message}
                  </div>
                </Card>
              ))}
            </div>

            <div style={{ marginTop: 40 }}>
              <Calendar
                fullscreen={false}
                headerRender={({ value, onChange }) => {
                  return (
                    <div
                      style={{
                        padding: 10,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Button onClick={() => onChange(value.clone().subtract(1, 'month'))}>
                        {'<'}
                      </Button>
                      <h3 style={{ margin: 0 }}>{value.format('MMMM')}</h3>
                      <Button onClick={() => onChange(value.clone().add(1, 'month'))}>
                        {'>'}
                      </Button>
                    </div>
                  );
                }}
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
      return '#000';
  }
}

export default Dashboard;
