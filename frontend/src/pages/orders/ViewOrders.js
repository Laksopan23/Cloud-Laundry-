// Same imports
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
  Descriptions,
  Divider,
} from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
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
      title: 'Expected Delivery',
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
      <div className="max-w-[1500px] mx-auto">
        <Card
          title={<Title level={4}>All Orders</Title>}
          className="border-t-[5px] border-[#6c2bd9]"
        >
          {loading ? (
            <div className="text-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table
                  dataSource={orders}
                  columns={columns}
                  rowKey="_id"
                  pagination={{ pageSize: 10 }}
                />
              </div>

              {/* Mobile View */}
              <div className="block md:hidden w-full">
                {orders.map((order) => (
                  <Card
                    key={order._id}
                    title={`Invoice #${order.invoiceNumber}`}
                    className="mb-4 w-full text-xs"
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
                          className="w-full text-[8px]"
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
                          className="w-full text-[8px]"
                        >
                          <Option value="not paid">Not Paid</Option>
                          <Option value="paid">Paid</Option>
                          <Option value="refunded">Refunded</Option>
                        </Select>
                      ) : (
                        <span>{order.paymentStatus}</span>
                      )}
                    </p>
                    <Button block className="mt-2" onClick={() => handleView(order)}>
                      View Details
                    </Button>
                    <Button
                      block
                      className="mt-2 bg-[#5e208e] text-white"
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
            <div className="text-[#5e208e]">
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
          width={800}
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
                  className="mt-4"
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
                <p className="mt-4">No items found.</p>
              )}

              <Divider style={{ borderColor: '#5e208e' }} />
              <p className="text-right font-semibold text-[#5e208e]">
                Total: Rs.{selectedOrder.total}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
}
