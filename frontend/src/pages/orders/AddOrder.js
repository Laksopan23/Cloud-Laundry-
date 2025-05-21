import React, { useState } from 'react';
import { Input, DatePicker, TimePicker, Button, Card, Typography, message } from 'antd';
import { UserOutlined, ProfileOutlined, ShoppingCartOutlined, CarOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import Layout from '../../components/Layout';
import AddItemModal from './models/AddItemsModel'; // adjust path as needed

// Note: Image imports are placeholders; update to correct images
import Laundry from '../../images/laundry.png';
import Curtains from '../../images/curtins.png';
import Sofa from '../../images/sofa.png';
import House from '../../images/house.png';

const { TextArea } = Input;
const { Title } = Typography;

export default function LaundryForm() {
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    customerName: '',
    Addressline1: '',
    Addressline2: '',
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

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemDetails, setItemDetails] = useState({ customItems: [] }); // Custom items from modal

  const handleAddItem = (data) => {
    setItemDetails(prevDetails => ({
      customItems: data.customItems, // updating customItems
    }));
    message.success('Items added!');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log('handleSubmit triggered');
    console.log('Form Data before validation:', formData);
    console.log('Item Details:', itemDetails);

    const requiredFields = ['customerName', 'customerPhone', 'selectedService', 'date', 'time'];

    // Check required fields presence (also verify date and time types)
    const isValid = requiredFields.every((field) => {
      const val = formData[field];
      if (val === null || val === '') {
        return false;
      }
      return true;
    }) && itemDetails.customItems.length > 0;

    if (!isValid) {
      message.error('Please fill all required fields and add at least one item.');
      return;
    }

    // Validate expectedDeliveryDate > date if both are set
    try {
      if (
        formData.expectedDeliveryDate &&
        formData.date &&
        formData.expectedDeliveryDate.isBefore(formData.date)
      ) {
        message.error('Expected delivery date must be after the order date.');
        return;
      }
    } catch (error) {
      console.error('Date comparison error:', error);
      message.error('Invalid date values.');
      return;
    }

    try {
      // Map customItems to backend's expected items format
      const formattedItems = itemDetails.customItems.map((item) => ({
        itemName: item.items,
        quantity: item.qty,
        price: item.price,
      }));

      console.log('Sending data to server:', {
        ...formData,
        date: formData.date ? formData.date.toISOString() : null,
        expectedDeliveryDate: formData.expectedDeliveryDate ? formData.expectedDeliveryDate.toISOString() : null,
        time: formData.time ? formData.time.format('HH:mm') : null,
        items: formattedItems,
      });

      const response = await axios.post('http://localhost:5000/api/orders', {
        ...formData,
        date: formData.date ? formData.date.toISOString() : null,
        expectedDeliveryDate: formData.expectedDeliveryDate ? formData.expectedDeliveryDate.toISOString() : null,
        time: formData.time ? formData.time.format('HH:mm') : null,
        items: formattedItems, // Send only formatted items
      });

      console.log('Server response:', response.data);

      message.success('Order saved successfully!');
      // Reset form and state
      setFormData({
        customerName: '',
        Addressline1: '',
        Addressline2: '',
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
      setSelectedService(null);
      setItemDetails({ customItems: [] });
    } catch (error) {
      console.error('Submit error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit order';
      message.error(errorMessage);
    }
  };

  const services = [
    { name: 'Laundry', img: Laundry },
    { name: 'Curtains Cleaning', img: Curtains },
    { name: 'Sofa, Carpet & Interior Cleaning', img: Sofa },
    { name: 'Domestic Cleaning', img: House }
  ];

  return (
    <Layout>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Personal Details */}
        <Card
          title={  <span style={{ fontSize: '18px', fontWeight: 'bold',color:'#6c2bd9' }}>
          <UserOutlined /> Personal Details</span>}
          size="small"
          style={{ marginTop: 20, borderTop: '5px solid #6c2bd9',padding:"20px" }}
        >
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <Title level={5}>Customer Name</Title>
              <Input
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                style={{ height: '32px' }} // Adjust height here
              />
            </div>
            <div style={{ flex: 1 }}>
              <Title level={5}>Address Line 1</Title>
              <Input
                placeholder="Address Line 1"
                value={formData.Addressline1}
                onChange={(e) => handleChange('Addressline1', e.target.value)}
                style={{ height: '32px' }} // Adjust height here

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
                style={{ height: '32px' }} // Adjust height here
              />
            </div>
            <div style={{ flex: 1 }}>
              <Title level={5}>Address Line 2</Title>
              <Input
                placeholder="Address Line 2"
                value={formData.Addressline2}
                onChange={(e) => handleChange('Addressline2', e.target.value)}
                style={{ height: '32px' }} // Adjust height here
              />
            </div>
          </div>
        </Card>

        {/* Service Type */}
        <Card
          title={  <span style={{ fontSize: '18px', fontWeight: 'bold',color:'#6c2bd9' }}>
            <ProfileOutlined /> Service Type</span>}
          size="small"
          style={{ marginTop: 20, borderTop: '5px solid #6c2bd9',padding:"20px" }}
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
                  <img src={service.img} alt={service.name} style={{ width: 75, height: 75, marginBottom: 10 }} />
                  <div>{service.name}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Order Details */}
        <Card
          title={  <span style={{ fontSize: '18px', fontWeight: 'bold',color:'#6c2bd9' }}>
          <ShoppingCartOutlined /> Order Details</span>}
          size="small"
          style={{ marginTop: 20, borderTop: '5px solid #6c2bd9',padding:"20px" }}
        >
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <Title level={5}>Invoice Number</Title>
              <Input style={{ height: '32px' }} placeholder="Auto-generated" value="Auto-generated" disabled />
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
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <Button
              style={{ backgroundColor: '#6c2bd9', color: '#fff' }}
              onClick={() => setIsModalVisible(true)}
            >
              Add Items
            </Button>
          </div>
        </Card>

        <AddItemModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAddItem={handleAddItem}
          selectedService={selectedService}
        />

        {/* Pickup Details */}
        <Card
          title={  <span style={{ fontSize: '18px', fontWeight: 'bold',color:'#6c2bd9' }}>
          <CarOutlined /> Pickup Details</span>}
          size="small"
          style={{ marginTop: 20, borderTop: '5px solid #6c2bd9',padding:"20px" }}
        >
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <Title level={5}>Pickup & Delivery Fee</Title>
              <Input
                placeholder="Pickup & Delivery Fee"
                value={formData.pickupFee}
                onChange={(e) => handleChange('pickupFee', e.target.value)}
                style={{ height: '32px' }}
              />
              <Title level={5}>Pickup & Delivery Discount</Title>
              <Input
                placeholder="Pickup & Delivery Discount"
                value={formData.pickupDiscount}
                onChange={(e) => handleChange('pickupDiscount', e.target.value)}
                style={{ height: '32px' }}
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
                style={{padding:"20px"}}
              >
                <Title level={5}>Pickup Person Name</Title>
                <Input
                  placeholder="Pickup Person Name"
                  value={formData.pickupPersonName}
                  onChange={(e) => handleChange('pickupPersonName', e.target.value)}
                  style={{ height: '32px' }}
                />
                <Title level={5}>Pickup Person Phone</Title>
                <Input
                  placeholder="Pickup Person Phone"
                  value={formData.pickupPersonPhone}
                  onChange={(e) => handleChange('pickupPersonPhone', e.target.value)}
                  style={{ height: '32px' }}
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
            Save Order
          </Button>
        </div>
      </div>
    </Layout>
  );
}
