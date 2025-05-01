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
      <div style={{ padding: 20 }}>
        {/* Header */}
        <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>Dashboard</h2>

        {/* Stat Cards */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            justifyContent: 'center',
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
        <h3 style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Top Services</h3>
        <div>
          {orders.map((order, index) => (
            <div key={index} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '500' }}>
                <span>{order.name}</span>
                <span style={{ border: `1px solid ${getColor(order.name)}`, padding: '2px 8px', borderRadius: 12, color: getColor(order.name), fontSize: 12 }}>
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

        {/* Notifications */}
        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 'bold' }}>Notifications</h3>
            <Button type="link" style={{ padding: 0 }}>View All</Button>
          </div>
          <div>
            {notifications.map((notif) => (
              <Card key={notif.id} size="small" style={{ marginBottom: 10, border: '1px solid #eee', backgroundColor: '#f9f9f9' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <FileTextOutlined style={{ marginRight: 10, color: '#7e57c2' }} />
                  {notif.message}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Calendar at bottom */}
        <div style={{ marginTop: 40 }}>
          <Calendar
            fullscreen={false}
            headerRender={({ value, onChange }) => {
              const start = 0;
              const end = 12;
              const monthOptions = [];

              for (let i = start; i < end; i++) {
                monthOptions.push(
                  <option key={i} value={i}>
                    {value.clone().month(i).format('MMMM')}
                  </option>
                );
              }

              return (
                <div style={{ padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button onClick={() => onChange(value.clone().subtract(1, 'month'))}>{'<'}</Button>
                  <h3 style={{ margin: 0 }}>{value.format('MMMM')}</h3>
                  <Button onClick={() => onChange(value.clone().add(1, 'month'))}>{'>'}</Button>
                </div>
              );
            }}
          />
        </div>
      </div>
    </Layout>
  );
}

function StatCard({ icon, title, value, change, bgColor, iconBg }) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        borderRadius: 15,
        padding: 20,
        width: 150,
        textAlign: 'center',
        flexGrow: 1,
        flexBasis: '40%',
        minWidth: 140,
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

// Helper for different progress bar colors
function getColor(name) {
  switch (name) {
    case 'Laundry Services':
      return '#1e88e5'; // blue
    case 'Curtains Cleaning':
      return '#00c853'; // green
    case 'Sofa/Carpet/Mattress Cleaning':
      return '#b388ff'; // purple
    case 'House Deep Cleaning':
      return '#ff9100'; // orange
    default:
      return '#000';
  }
}

export default Dashboard;
