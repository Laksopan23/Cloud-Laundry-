
import React from 'react';
import { Modal, Descriptions, Divider, Table, Button } from 'antd';
import dayjs from 'dayjs';

export default function OrderDetailsModal({ visible, onClose, order }) {
  return (
    <Modal
      title={<div className="text-[#5e208e]">Order Details - {order?.invoiceNumber}</div>}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      bodyStyle={{ backgroundColor: '#f0f2f5' }}
      width={800}
    >
      {order && (
        <>
          <Descriptions
            column={1}
            bordered
            size="small"
            labelStyle={{
              backgroundColor: '#d4beff',
              color: '#5e208e',
              fontWeight: 600,
            }}
          >
            <Descriptions.Item label="Customer Name">{order.customerName}</Descriptions.Item>
            <Descriptions.Item label="Phone">{order.customerPhone}</Descriptions.Item>
            <Descriptions.Item label="Service">{order.selectedService}</Descriptions.Item>
            <Descriptions.Item label="Date">{dayjs(order.date).format('YYYY-MM-DD')}</Descriptions.Item>
            <Descriptions.Item label="Expected Delivery Date">{dayjs(order.expectedDeliveryDate).format('YYYY-MM-DD')}</Descriptions.Item>
            <Descriptions.Item label="Actual Delivery Date">
              {order.actualDeliveryDate ? dayjs(order.actualDeliveryDate).format('YYYY-MM-DD') : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Time">{order.time}</Descriptions.Item>
            <Descriptions.Item label="Pickup Fee">Rs.{order.pickupFee}</Descriptions.Item>
            <Descriptions.Item label="Pickup Discount">Rs.{order.pickupDiscount}</Descriptions.Item>
            <Descriptions.Item label="Status">{order.status}</Descriptions.Item>
            <Descriptions.Item label="Payment Status">{order.paymentStatus}</Descriptions.Item>
            <Descriptions.Item label="Address Line 1">{order.Addressline1}</Descriptions.Item>
            <Descriptions.Item label="Address Line 2">{order.Addressline2}</Descriptions.Item>
            <Descriptions.Item label="Pickup Person Name">{order.pickupPersonName}</Descriptions.Item>
            <Descriptions.Item label="Pickup Person Phone">{order.pickupPersonPhone}</Descriptions.Item>
            <Descriptions.Item label="Employee">{order.employee || 'N/A'}</Descriptions.Item>
            <Descriptions.Item label="Note">{order.note || 'None'}</Descriptions.Item>
          </Descriptions>

          <Divider style={{ borderColor: '#5e208e' }}>Items</Divider>
          <Table
            dataSource={order.items}
            rowKey={(item, index) => index}
            pagination={false}
            size="small"
            bordered
            columns={[
              { title: 'Item Name', dataIndex: 'itemName', key: 'itemName' },
              { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
              { title: 'Unit Price', dataIndex: 'price', key: 'price' },
              {
                title: 'Total Price',
                key: 'totalPrice',
                render: (_, record) => `Rs.${record.quantity * record.price}`,
              },
            ]}
          />
          <Divider />
          <p className="text-right font-semibold text-[#5e208e]">Total: Rs.{order.total}</p>
        </>
      )}
    </Modal>
  );
}
