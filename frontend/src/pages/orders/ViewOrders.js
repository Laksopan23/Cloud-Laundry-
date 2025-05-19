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
  Descriptions, Divider
} from 'antd';
import { DownloadOutlined, EyeOutlined  } from '@ant-design/icons';
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
    setSelectedOrder(record);
    setViewModalVisible(true);
  };

  const handleDownload = (record) => {
    try {
      generateInvoicePDF(record);
      message.success(`Downloaded invoice ${record.invoiceNumber}`);
    } catch (error) {
      message.error('Failed to generate PDF');
    }
  };

  const handleStatusChange = async (record, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${record._id}`, {
        status: newStatus,
      });
      message.success(`Status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      message.error('Failed to update status');
    }
  };

  const handlePaymentChange = async (record, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${record._id}`, {
        paymentStatus: newStatus,
      });
      message.success(`Payment status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      message.error('Failed to update payment status');
    }
  };

  const colorMapStatus = {
    Pending: '#faad14',
    Completed: '#52c41a',
    Cancelled: '#ff4d4f',
  };

  const colorMapPayment = {
    'not paid': '#faad14',
    paid: '#52c41a',
    refunded: '#1890ff',
  };

  const columns = [
    { title: 'Invoice #', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Service', dataIndex: 'selectedService', key: 'selectedService' },
    { title: 'Phone', dataIndex: 'customerPhone', key: 'customerPhone' },
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
      render: (status, record) =>
        isAdmin ? (
          <Select
            value={status}
            onChange={(value) => handleStatusChange(record, value)}
            style={{
              width: 130,
              color: colorMapStatus[status],
              borderColor: colorMapStatus[status],
            }}
          >
            <Option value="Pending">Pending</Option>
            <Option value="Completed">Completed</Option>
            <Option value="Cancelled">Cancelled</Option>
          </Select>
        ) : (
          <Button
            style={{
              color: colorMapStatus[status],
              borderColor: colorMapStatus[status],
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
      title: 'Payment',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status, record) =>
        isAdmin ? (
          <Select
            value={status}
            onChange={(value) => handlePaymentChange(record, value)}
            style={{
              width: 130,
              color: colorMapPayment[status],
              borderColor: colorMapPayment[status],
            }}
          >
            <Option value="not paid">Not Paid</Option>
            <Option value="paid">Paid</Option>
            <Option value="refunded">Refunded</Option>
          </Select>
        ) : (
          <Button
            style={{
              color: colorMapPayment[status],
              borderColor: colorMapPayment[status],
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
          <Button onClick={() => handleView(record)}><EyeOutlined /></Button>
          <Button onClick={() => handleDownload(record)}><DownloadOutlined/></Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
        <style>
          {`
            .mobile-cards {
              display: none;
            }

            @media (max-width: 767px) {
              .desktop-table {
                display: none;
              }

              .mobile-cards {
                display: block;
                width: 100%;
              }

              .mobile-cards .ant-card {
                width: 100%;
                margin: 0 auto 16px;
                padding: 0;
              }

              .mobile-cards .ant-card-body {
                padding: 10px;
                font-size: 9px;
              }

              .mobile-cards .ant-card-body p {
                font-size: 9px;
                margin-bottom: 6px;
              }

              .mobile-cards strong {
                font-size: 9px;
              }

              .mobile-cards,
              .mobile-cards .ant-btn {
                width: 100% !important;
                font-size: 9px !important;
              }
              .mobile-cards .ant-select {
                width: 100% !important;
                font-size: 6px !important;
              }

              .mobile-cards .ant-select .ant-select-selector {
                font-size: 8px !important;
                height: 22px !important;
                padding: 0 4px !important;
              }

              .mobile-cards .ant-select .ant-select-selection-item {
                font-size: 8px !important;
                line-height: 14px !important;
              }

              .mobile-cards .ant-select .ant-select-arrow {
                font-size: 8px !important;
              }
            }
          `}
        </style>
      <div style={{ maxWidth: 1500, margin: '0 auto' }}>
        <Card
          title={<Title level={4}>All Orders</Title>}
          style={{ borderTop: '5px solid #6c2bd9' }}
        >
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div className="desktop-table">
                <Table
                  dataSource={orders}
                  columns={columns}
                  rowKey="_id"
                  pagination={{ pageSize: 10 }}
                />
              </div>

              <div className="mobile-cards">
                {orders.map((order) => (
                  <Card
                    key={order._id}
                    style={{ marginBottom: 16 }}
                    title={`Invoice #${order.invoiceNumber}`}
                  >
                    <p><strong>Customer:</strong> {order.customerName}</p>
                    <p><strong>Phone:</strong> {order.customerPhone}</p>
                    <p><strong>Service:</strong> {order.selectedService}</p>
                    <p><strong>Date:</strong> {dayjs(order.date).format('YYYY-MM-DD')}</p>
                    <p><strong>Delivery:</strong> {dayjs(order.expectedDeliveryDate).format('YYYY-MM-DD')}</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      {isAdmin ? (
                        <Select
                          value={order.status}
                          onChange={(value) => handleStatusChange(order, value)}
                          size="small"
                          style={{ width: '100%' }}
                        >
                          <Option value="Pending">Pending</Option>
                          <Option value="Completed">Completed</Option>
                          <Option value="Cancelled">Cancelled</Option>
                        </Select>
                      ) : (
                        <span>{order.status}</span>
                      )}
                    </p>
                    <p>
                      <strong>Payment:</strong>{' '}
                      {isAdmin ? (
                        <Select
                          value={order.paymentStatus}
                          onChange={(value) => handlePaymentChange(order, value)}
                          size="small"
                          style={{ width: '100%' }}
                        >
                          <Option value="not paid">Not Paid</Option>
                          <Option value="paid">Paid</Option>
                          <Option value="refunded">Refunded</Option>
                        </Select>
                      ) : (
                        <span>{order.paymentStatus}</span>
                      )}
                    </p>
                    <Button
                      style={{ marginTop: 8 }}
                      block
                      onClick={() => handleView(order)}
                    >
                      View Details
                    </Button>
                    <Button
                      style={{ marginTop: 8, backgroundColor:'#5e208e', color:'white' }}
                      block
                      onClick={() => handleDownload(order)}
                    >
                      Download
                    </Button>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Card>

<Modal
  title={
    <div style={{ color: '#5e208e' }}>
      Order Details - {selectedOrder?.invoiceNumber}
    </div>
  }
  open={viewModalVisible}
  onCancel={() => setViewModalVisible(false)}
  footer={[
    <Button key="close" onClick={() => setViewModalVisible(false)}>
      Close
    </Button>,
  ]}
  bodyStyle={{ backgroundColor: '#f0f2f5' }}
    width={800} // Add this line to increase width

>
  {selectedOrder && (
    <div>
      <Descriptions
        column={1}
        bordered
        size="small"
        labelStyle={{ backgroundColor: '#d4beff', color: '#5e208e', fontWeight: 600 }}
        contentStyle={{ backgroundColor: '#fff' }}
      >
        <Descriptions.Item label="Customer Name">
          {selectedOrder.customerName}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {selectedOrder.customerPhone}
        </Descriptions.Item>
        <Descriptions.Item label="Service">
          {selectedOrder.selectedService}
        </Descriptions.Item>
        <Descriptions.Item label="Date">
          {dayjs(selectedOrder.date).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label="Delivery Date">
          {dayjs(selectedOrder.expectedDeliveryDate).format('YYYY-MM-DD')}
        </Descriptions.Item>
        <Descriptions.Item label="Time">
          {selectedOrder.time}
        </Descriptions.Item>
        <Descriptions.Item label="Pickup Fee">
          Rs.{selectedOrder.pickupFee}
        </Descriptions.Item>
        <Descriptions.Item label="Pickup Discount">
          Rs.{selectedOrder.pickupDiscount}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {selectedOrder.status}
        </Descriptions.Item>
        <Descriptions.Item label="Payment Status">
          {selectedOrder.paymentStatus}
        </Descriptions.Item>
        <Descriptions.Item label="Address Line 1">
          {selectedOrder.Addressline1}
        </Descriptions.Item>
        <Descriptions.Item label="Address Line 2">
          {selectedOrder.Addressline2}
        </Descriptions.Item>
        <Descriptions.Item label="Pickup Person Name">
          {selectedOrder.pickupPersonName}
        </Descriptions.Item>
        <Descriptions.Item label="Pickup Person Phone">
          {selectedOrder.pickupPersonPhone}
        </Descriptions.Item>
        <Descriptions.Item label="Employee">
          {selectedOrder.employee || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Note">
          {selectedOrder.note || 'None'}
        </Descriptions.Item>
      </Descriptions>

      <Divider style={{ borderColor: '#5e208e' }}>Items</Divider>

      {selectedOrder.items?.length > 0 ? (
        <Table
          dataSource={selectedOrder.items}
          rowKey={(item, index) => index}
          pagination={false}
          size="small"
          bordered
          style={{ marginTop: 16 }}
          columns={[
            { title: 'Item Name', dataIndex: 'itemName', key: 'itemName' },
            { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
            { title: 'Unit Price ', dataIndex: 'price', key: 'price' },
            {
              title: 'Total Price',
              key: 'totalPrice',
               render: (_, record) => `Rs.${record.quantity * record.price}`,
             },          
          ]}
        />
      ) : (
        <p style={{ marginTop: 16 }}>No items found.</p>
      )}

      <Divider style={{ borderColor: '#5e208e' }} />
      <p style={{ textAlign: 'right', fontWeight: 600, color: '#5e208e' }}>
        Total: Rs.{selectedOrder.total}
      </p>
    </div>
  )}
</Modal>


      </div>
    </Layout>
  );
}
