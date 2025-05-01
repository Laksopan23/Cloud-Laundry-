import React, { useState } from 'react';
import { Input, DatePicker, TimePicker, Button, Card, Typography, message } from 'antd';
import { UserOutlined, ProfileOutlined, ShoppingCartOutlined, CarOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

import Layout from '../components/Layout';

import Laundry from '../images/4.png';
import Curtains from '../images/4.png';
import Sofa from '../images/4.png';
import House from '../images/4.png';

const { TextArea } = Input;
const { Title } = Typography;

export default function LaundryForm() {
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    customerAddress1: '',
    customerAddress2: '',
    customerPhone: '',
    selectedService: '',
    date: null,
    expectedDeliveryDate: null,
    time: null,
    pickupFee: '',
    pickupDiscount: '',
    note: '',
    pickupPersonName: '',
    pickupPersonPhone: '',
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/orders', {
        ...formData,
        date: formData.date ? formData.date.toISOString() : null,
        expectedDeliveryDate: formData.expectedDeliveryDate ? formData.expectedDeliveryDate.toISOString() : null,
        time: formData.time ? formData.time.format('HH:mm') : null,
      });
      message.success('Order submitted successfully!');
    } catch (error) {
      console.error(error);
      message.error('Failed to submit order');
    }
  };

  const services = [
    { name: 'Laundry', img: Laundry },
    { name: 'Curtains Cleaning', img: Curtains },
    { name: 'Sofa, Carpet & Interior Cleaning', img: Sofa },
    { name: 'House Deep Cleaning', img: House }
  ];

  return (
    <Layout>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Personal Details */}
        <Card
          title={<span><UserOutlined /> Personal Details</span>}
          size="small"
          style={{ marginTop: 20, borderTop: '5px solid #6c2bd9' }}
        >
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <Title level={5}>Customer Name</Title>
              <Input
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Title level={5}>Customer Address 1</Title>
              <Input
                placeholder="Customer Address 1"
                value={formData.customerAddress1}
                onChange={(e) => handleChange('customerAddress1', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <Title level={5}>Customer Phone</Title>
              <Input
                placeholder="Customer Phone"
                value={formData.customerPhone}
                onChange={(e) => handleChange('customerPhone', e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Title level={5}>Customer Address 2</Title>
              <Input
                placeholder="Customer Address 2"
                value={formData.customerAddress2}
                onChange={(e) => handleChange('customerAddress2', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Service Type */}
        <Card
          title={<span><ProfileOutlined /> Service Type</span>}
          size="small"
          style={{ marginTop: 20, borderTop: '5px solid #6c2bd9' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 20 }}>
            {services.map((service, index) => {
              const isSelected = selectedService === service.name;
              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedService(service.name);
                    handleChange('selectedService', service.name);
                  }}
                  style={{
                    width: 150,
                    height: 150,
                    border: isSelected ? '2px solid #6c2bd9' : '1px solid #ccc',
                    borderRadius: 10,
                    background: isSelected ? '#f3eaff' : '#fff',
                    textAlign: 'center',
                    padding: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.border = '2px solid #6c2bd9'}
                  onMouseLeave={e => e.currentTarget.style.border = isSelected ? '2px solid #6c2bd9' : '1px solid #ccc'}
                >
                  <img src={service.img} alt={service.name} style={{ width: 60, height: 60, marginBottom: 10 }} />
                  <div>{service.name}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Order Details */}
        <Card
          title={<span><ShoppingCartOutlined /> Order Details</span>}
          size="small"
          style={{ marginTop: 20, borderTop: '5px solid #6c2bd9' }}
        >
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <Title level={5}>Invoice Number</Title>
              <Input placeholder="Auto-generated" value="Auto-generated" disabled />
            </div>
            <div style={{ flex: 1 }}>
              <Title level={5}>Date</Title>
              <DatePicker
                placeholder="Date"
                style={{ width: '100%' }}
                value={formData.date}
                onChange={(date) => handleChange('date', date)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <Title level={5}>Expected Delivery Date</Title>
              <DatePicker
                placeholder="Expected Delivery Date"
                style={{ width: '100%' }}
                value={formData.expectedDeliveryDate}
                onChange={(date) => handleChange('expectedDeliveryDate', date)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Title level={5}>Time</Title>
              <TimePicker
                placeholder="Time"
                style={{ width: '100%' }}
                value={formData.time}
                onChange={(time) => handleChange('time', time)}
              />
            </div>
          </div>
          <Button style={{ marginTop: 20, backgroundColor: '#6c2bd9', color: '#fff' }}>Add Items</Button>
        </Card>

        {/* Pickup Details */}
        <Card
          title={<span><CarOutlined /> Pickup Details</span>}
          size="small"
          style={{ marginTop: 20, borderTop: '5px solid #6c2bd9' }}
        >
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <Title level={5}>Pickup & Delivery Fee</Title>
              <Input
                placeholder="Pickup & Delivery Fee"
                value={formData.pickupFee}
                onChange={(e) => handleChange('pickupFee', e.target.value)}
              />
              <Title level={5}>Pickup & Delivery Discount</Title>
              <Input
                placeholder="Pickup & Delivery Discount"
                value={formData.pickupDiscount}
                onChange={(e) => handleChange('pickupDiscount', e.target.value)}
              />
              <Title level={5}>Note</Title>
              <TextArea
                placeholder="Note"
                rows={4}
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <Card
                title={<span style={{ fontWeight: 'bold', color: '#6c2bd9' }}>Delivery Person</span>}
                size="small"
              >
                <Title level={5}>Pickup Person Name</Title>
                <Input
                  placeholder="Pickup Person Name"
                  value={formData.pickupPersonName}
                  onChange={(e) => handleChange('pickupPersonName', e.target.value)}
                />
                <Title level={5}>Pickup Person Phone</Title>
                <Input
                  placeholder="Pickup Person Phone"
                  value={formData.pickupPersonPhone}
                  onChange={(e) => handleChange('pickupPersonPhone', e.target.value)}
                />
              </Card>
            </div>
          </div>
        </Card>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button
            style={{ backgroundColor: '#6c2bd9', color: '#fff' }}
            onClick={handleSubmit}
          >
            Generate Invoice
          </Button>
        </div>
      </div>
    </Layout>
  );
}
