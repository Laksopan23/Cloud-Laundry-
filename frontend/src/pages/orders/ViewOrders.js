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
  DatePicker,
  Input, // Added Input from Ant Design
} from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import Layout from '../../components/Layout';
import { generateInvoicePDF } from './Invoice/InvoicePDF';
import OrderDetailsModal from './models/OrderDetailsModal';

const { Title } = Typography;
const { Option } = Select;

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [serviceFilter, setServiceFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleActualDeliveryChange = async (record, date) => {
    try {
      const formattedDate = date ? date.toISOString() : null;
      await axios.put(`http://localhost:5000/api/orders/${record._id}`, {
        actualDeliveryDate: formattedDate,
      });
      message.success('Actual delivery date updated');
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === record._id ? { ...order, actualDeliveryDate: formattedDate } : order
        )
      );
    } catch (error) {
      message.error('Failed to update actual delivery date');
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

  const serviceOptions = [...new Set(orders.map((order) => order.selectedService))].filter(Boolean);

  const filteredOrders = orders.filter((order) => {
    const matchesService = serviceFilter ? order.selectedService === serviceFilter : true;
    const matchesSearch =
      searchTerm === '' ||
      (order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesService && matchesSearch;
  });

  const columns = [
    { title: 'CID', dataIndex: 'cid', key: 'cid', render: (text) => text || '00000', width: 70 },
    { title: 'Invoice #', dataIndex: 'invoiceNumber', key: 'invoiceNumber', width: 80 },
    { title: 'Customer', dataIndex: 'customerName', key: 'customerName', width: 100 },
    { title: 'Service', dataIndex: 'selectedService', key: 'selectedService', width: 120 },
    { title: 'Phone', dataIndex: 'customerPhone', key: 'customerPhone', width: 100 },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
      width: 90,
    },
    {
      title: 'Expected Delivery',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
      width: 110,
    },
    {
      title: 'Actual Delivery',
      dataIndex: 'actualDeliveryDate',
      key: 'actualDeliveryDate',
      render: (date, record) => {
        const canEdit = record.paymentStatus === 'paid' && record.status === 'Completed';
        return !isAdmin && canEdit ? (
          <DatePicker
            value={date ? dayjs(date) : null}
            onChange={(value) => handleActualDeliveryChange(record, value)}
            format="YYYY-MM-DD"
            allowClear={false}
            disabled={!!date}
          />
        ) : (
          <span>{date ? dayjs(date).format('YYYY-MM-DD') : 'N/A'}</span>
        );
      },
      width: 150,
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
              width: 100,
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
              padding: '0 8px',
            }}
            disabled
          >
            {status}
          </Button>
        ),
      width: 110,
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
              width: 100,
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
              padding: '0 8px',
            }}
            disabled
          >
            {status}
          </Button>
        ),
      width: 110,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button onClick={() => handleView(record)}>
            <EyeOutlined />
          </Button>
          <Button onClick={() => handleDownload(record)}>
            <DownloadOutlined />
          </Button>
        </Space>
      ),
      width: 80,
    },
  ];

  // Mobile view rendering for orders
const renderMobileOrders = () => {
  return filteredOrders.map((order) => (
    <Card
      key={order._id}
      style={{
        marginBottom: 16,
        borderRadius: 8,
        border: '1px solid #d9d9d9',
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>
        Invoice #{order.invoiceNumber}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div>
          <strong>Customer:</strong> {order.customerName}
        </div>
        <div>
          <strong>Phone:</strong> {order.customerPhone}
        </div>
        <div>
          <strong>Service:</strong> {order.selectedService}
        </div>
        <div>
          <strong>Date:</strong> {dayjs(order.date).format('YYYY-MM-DD')}
        </div>
        <div>
          <strong>Delivery:</strong> {dayjs(order.expectedDeliveryDate).format('YYYY-MM-DD')}
        </div>
        <div>
          <strong>Status:</strong>{' '}
          {isAdmin ? (
            <Select
              value={order.status}
              onChange={(value) => handleStatusChange(order, value)}
              style={{ width: 120 }}
              size="small"
            >
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
              <Option value="Cancelled">Cancelled</Option>
            </Select>
          ) : (
            <span style={{ color: colorMapStatus[order.status] }}>{order.status}</span>
          )}
        </div>
        <div>
          <strong>Actual Delivery:</strong>{' '}
          {!isAdmin && order.paymentStatus === 'paid' && order.status === 'Completed' ? (
            <DatePicker
              value={order.actualDeliveryDate ? dayjs(order.actualDeliveryDate) : null}
              onChange={(value) => handleActualDeliveryChange(order, value)}
              format="YYYY-MM-DD"
              allowClear={false}
              disabled={!!order.actualDeliveryDate}
              size="small"
            />
          ) : (
            <span>
              {order.actualDeliveryDate ? dayjs(order.actualDeliveryDate).format('YYYY-MM-DD') : 'N/A'}
            </span>
          )}
        </div>
        <div>
          <strong>Payment:</strong>{' '}
          {isAdmin ? (
            <Select
              value={order.paymentStatus}
              onChange={(value) => handlePaymentChange(order, value)}
              style={{ width: 120 }}
              size="small"
            >
              <Option value="not paid">Not Paid</Option>
              <Option value="paid">Paid</Option>
              <Option value="refunded">Refunded</Option>
            </Select>
          ) : (
            <span style={{ color: colorMapPayment[order.paymentStatus] }}>{order.paymentStatus}</span>
          )}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 16,
        }}
      >
        <Button onClick={() => handleView(order)}>View Details</Button>
        <Button
          onClick={() => handleDownload(order)}
          style={{ backgroundColor: '#6c2bd9', color: '#fff' }}
        >
          Download
        </Button>
      </div>
    </Card>
  ));
};


  return (
    <Layout>
      <div className="max-w-[1500px] mx-auto">
        <Card
          title={<Title level={4}>All Orders</Title>}
          className="border-t-[5px] border-[#6c2bd9] rounded-md"
          loading={loading}
        >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row', // changed from column to row
            gap: 16,
            marginBottom: 16,
            alignItems: 'center', // vertically center the inputs
            justifyContent: 'flex-start', // align to start or space-between if you want them spaced out
          }}
          className="" // removed md:flex-row since we enforce row always
        >
          <Input
            placeholder="Search by customer or invoice #"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', maxWidth: 300 }}
            allowClear
          />
          <Select
            placeholder="Filter by service"
            allowClear
            onChange={(value) => setServiceFilter(value)}
            style={{ width: '100%', maxWidth: 200 }}
            value={serviceFilter || undefined}
          >
            {serviceOptions.map((service) => (
              <Option key={service} value={service}>
                {service}
              </Option>
            ))}
          </Select>
        </div>

          <div className="hidden md:block">
            <Table
              dataSource={filteredOrders}
              columns={columns}
              rowKey="_id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 'max-content' }}
              size='small'
            />
          </div>
          <div className="md:hidden">{renderMobileOrders()}</div>
        </Card>

        <OrderDetailsModal
          visible={viewModalVisible}
          onClose={() => setViewModalVisible(false)}
          order={selectedOrder}
        />
      </div>
    </Layout>
  );
}