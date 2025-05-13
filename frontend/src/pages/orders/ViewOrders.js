import React, { useEffect, useState } from 'react';
import { Table, Card, Typography, message, Spin, Button, Space } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import Layout from '../../components/Layout';

const { Title } = Typography;

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleView = (record) => {
    // Replace this with real view logic
    message.info(`Viewing order ${record.invoiceNumber}`);
  };

  const handleDownload = (record) => {
    // Replace this with real download logic (e.g., generate PDF)
    message.info(`Downloading invoice ${record.invoiceNumber}`);
  };

  const columns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Service',
      dataIndex: 'selectedService',
      key: 'selectedService',
    },
    {
      title: 'Phone',
      dataIndex: 'customerPhone',
      key: 'customerPhone',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Delivery',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Button
          style={{
            color: status === 'Finished' ? '#52c41a' : '#ff4d4f',
            borderColor: status === 'Finished' ? '#52c41a' : '#ff4d4f',
            borderRadius: 4,
            padding: '0 10px',
          }}
          disabled
        >
          {status}
        </Button>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button  onClick={() => handleView(record)}>
            View
          </Button>
          <Button onClick={() => handleDownload(record)}>
            Download
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
        <Card
          title={<Title level={4}>All Orders</Title>}
          style={{ borderTop: '5px solid #6c2bd9' }}
          eidt
        >
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Table
              dataSource={orders}
              columns={columns}
              rowKey="invoiceNumber"
              pagination={{ pageSize: 10 }}
            />
          )}
        </Card>
      </div>
    </Layout>
  );
}
