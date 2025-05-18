import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Typography,
  message,
  Spin,
  Button,
  Space,
  Select,
  Modal,
} from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import Layout from '../../components/Layout';
import { generateInvoicePDF } from './Invoice/InvoicePDF';

const { Title } = Typography;
const { Option } = Select;

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  // Fetch all orders
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

  // Handle view
  const handleView = (record) => {
    setSelectedOrder(record);
    setViewModalVisible(true);
  };

  // Handle PDF download
  const handleDownload = (record) => {
    try {
      generateInvoicePDF(record);
      message.success(`Downloaded invoice ${record.invoiceNumber}`);
    } catch (error) {
      message.error('Failed to generate PDF');
      console.error(error);
    }
  };

  // Handle status change
  const handleStatusChange = async (record, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${record._id}`, {
        status: newStatus,
      });
      message.success(`Status updated to ${newStatus}`);
      fetchOrders(); // Refresh list
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  // Columns for the table
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
      render: (status, record) => {
        const colorMap = {
          Pending: '#faad14',
          Completed: '#52c41a',
          Cancelled: '#ff4d4f',
        };

        return isAdmin ? (
          <Select
            value={status}
            onChange={(value) => handleStatusChange(record, value)}
            style={{
              width: 130,
              color: colorMap[status],
              borderColor: colorMap[status],
            }}
          >
            <Option value="Pending">Pending</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        ) : (
          <Button
            style={{
              color: colorMap[status],
              borderColor: colorMap[status],
              borderRadius: 4,
              padding: '0 10px',
            }}
            disabled
          >
            {status}
          </Button>
        );
      },
    },
    {
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status, record) => {
        const colorMap = {
          'not paid': '#faad14',
          paid: '#52c41a',
          refunded: '#1890ff',
        };

        return isAdmin ? (
          <Select
            value={status}
            onChange={(value) =>
              axios
                .put(`http://localhost:5000/api/orders/${record._id}`, {
                  paymentStatus: value,
                })
                .then(() => {
                  message.success(`Payment status updated to ${value}`);
                  fetchOrders();
                })
                .catch(() => {
                  message.error('Failed to update payment status');
                })
            }
            style={{
              width: 130,
              color: colorMap[status],
              borderColor: colorMap[status],
            }}
          >
            <Option value="not paid">Not Paid</Option>
            <Option value="paid">Paid</Option>
            <Option value="refunded">Refunded</Option>
          </Select>
        ) : (
          <Button
            style={{
              color: colorMap[status],
              borderColor: colorMap[status],
              borderRadius: 4,
              padding: '0 10px',
            }}
            disabled
          >
            {status}
          </Button>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleView(record)}>View</Button>
          <Button onClick={() => handleDownload(record)}>Download</Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <div style={{ maxWidth: 1500, margin: '0 auto', padding: '20px' }}>
        <Card
          title={<Title level={4}>All Orders</Title>}
          style={{ borderTop: '5px solid #6c2bd9' }}
        >
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Table
              dataSource={orders}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
            />
          )}
        </Card>

        {/* Modal for viewing order details */}
        <Modal
          title={`Order Details - ${selectedOrder?.invoiceNumber}`}
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setViewModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedOrder && (
            <div>
              <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
              <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>
              <p><strong>Service:</strong> {selectedOrder.selectedService}</p>
              <p><strong>Date:</strong> {dayjs(selectedOrder.date).format('YYYY-MM-DD')}</p>
              <p><strong>Delivery:</strong> {dayjs(selectedOrder.expectedDeliveryDate).format('YYYY-MM-DD')}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
              {/* Add more details here if needed */}
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}
