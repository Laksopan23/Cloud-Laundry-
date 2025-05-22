import React, { useState } from 'react';
import { Input, DatePicker, TimePicker, Button, Typography, message } from 'antd';
import { UserOutlined, ProfileOutlined, ShoppingCartOutlined, CarOutlined } from '@ant-design/icons';
import axios from 'axios';
import Layout from '../../components/Layout';
import AddItemModal from './models/AddItemsModel';

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
  const [itemDetails, setItemDetails] = useState({ customItems: [] });

  const handleAddItem = (data) => {
    setItemDetails({ customItems: data.customItems });
    message.success('Items added!');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const requiredFields = ['customerName', 'customerPhone', 'selectedService', 'date', 'time'];

    const isValid = requiredFields.every((field) => formData[field]) && itemDetails.customItems.length > 0;

    if (!isValid) {
      message.error('Please fill all required fields and add at least one item.');
      return;
    }

    if (
      formData.expectedDeliveryDate &&
      formData.date &&
      formData.expectedDeliveryDate.isBefore(formData.date)
    ) {
      message.error('Expected delivery date must be after the order date.');
      return;
    }

    try {
      const formattedItems = itemDetails.customItems.map((item) => ({
        itemName: item.items,
        quantity: item.qty,
        price: item.price,
      }));

      await axios.post('http://localhost:5000/api/orders', {
        ...formData,
        date: formData.date?.toISOString(),
        expectedDeliveryDate: formData.expectedDeliveryDate?.toISOString(),
        time: formData.time?.format('HH:mm'),
        items: formattedItems,
      });

      message.success('Order saved successfully!');
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
      message.error(error.response?.data?.message || error.message || 'Failed to submit order');
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
      <div className="max-w-4xl mx-auto px-4">
        {/* Personal Details */}
        <div className="bg-white shadow-md rounded-lg mt-5 border-t-4 border-[#6c2bd9] p-5">
          <div className="text-[#6c2bd9] font-bold text-lg flex items-center gap-2 mb-4">
            <UserOutlined /> Personal Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Title level={5}>Customer Name</Title>
              <Input
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                className="h-8"
              />
            </div>
            <div>
              <Title level={5}>Address Line 1</Title>
              <Input
                placeholder="Address Line 1"
                value={formData.Addressline1}
                onChange={(e) => handleChange('Addressline1', e.target.value)}
                className="h-8"
              />
            </div>
            <div>
              <Title level={5}>Customer Phone</Title>
              <Input
                placeholder="Customer Phone"
                value={formData.customerPhone}
                onChange={(e) => handleChange('customerPhone', e.target.value)}
                className="h-8"
              />
            </div>
            <div>
              <Title level={5}>Address Line 2</Title>
              <Input
                placeholder="Address Line 2"
                value={formData.Addressline2}
                onChange={(e) => handleChange('Addressline2', e.target.value)}
                className="h-8"
              />
            </div>
          </div>
        </div>

        {/* Service Type */}
        <div className="bg-white shadow-md rounded-lg mt-5 border-t-4 border-[#6c2bd9] p-5">
          <div className="text-[#6c2bd9] font-bold text-lg flex items-center gap-2 mb-4">
            <ProfileOutlined /> Service Type
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service, index) => {
              const isSelected = selectedService === service.name;
              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedService(service.name);
                    handleChange('selectedService', service.name);
                  }}
                  className={`rounded-lg border transition-all duration-300 flex flex-col justify-center items-center cursor-pointer p-3 text-center ${
                    isSelected ? 'border-[#6c2bd9] bg-[#f3eaff]' : 'border-gray-300 bg-white'
                  }`}
                >
                  <img src={service.img} alt={service.name} className="w-[75px] h-[75px] mb-2" />
                  <div className="text-sm">{service.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white shadow-md rounded-lg mt-5 border-t-4 border-[#6c2bd9] p-5">
          <div className="text-[#6c2bd9] font-bold text-lg flex items-center gap-2 mb-4">
            <ShoppingCartOutlined /> Order Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Title level={5}>Invoice Number</Title>
              <Input className="h-8" placeholder="Auto-generated" value="Auto-generated" disabled />
            </div>
            <div>
              <Title level={5}>Date</Title>
              <DatePicker
                placeholder="Date"
                className="w-full"
                value={formData.date}
                onChange={(date) => handleChange('date', date)}
              />
            </div>
            <div>
              <Title level={5}>Expected Delivery Date</Title>
              <DatePicker
                placeholder="Expected Delivery Date"
                className="w-full"
                value={formData.expectedDeliveryDate}
                onChange={(date) => handleChange('expectedDeliveryDate', date)}
              />
            </div>
            <div>
              <Title level={5}>Time</Title>
              <TimePicker
                placeholder="Time"
                className="w-full"
                value={formData.time}
                onChange={(time) => handleChange('time', time)}
              />
            </div>
          </div>
          <div className="flex justify-center mt-5">
            <Button className="bg-[#6c2bd9] text-white" onClick={() => setIsModalVisible(true)}>
              Add Items
            </Button>
          </div>
        </div>

        <AddItemModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onAddItem={handleAddItem}
          selectedService={selectedService}
        />

        {/* Pickup Details */}
        <div className="bg-white shadow-md rounded-lg mt-5 border-t-4 border-[#6c2bd9] p-5">
          <div className="text-[#6c2bd9] font-bold text-lg flex items-center gap-2 mb-4">
            <CarOutlined /> Pickup Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Title level={5}>Pickup & Delivery Fee</Title>
              <Input
                placeholder="Pickup & Delivery Fee"
                value={formData.pickupFee}
                onChange={(e) => handleChange('pickupFee', e.target.value)}
                className="h-8"
              />
              <Title level={5} className="mt-3">Pickup & Delivery Discount</Title>
              <Input
                placeholder="Pickup & Delivery Discount"
                value={formData.pickupDiscount}
                onChange={(e) => handleChange('pickupDiscount', e.target.value)}
                className="h-8"
              />
              <Title level={5} className="mt-3">Note</Title>
              <TextArea
                placeholder="Note"
                rows={4}
                value={formData.note}
                onChange={(e) => handleChange('note', e.target.value)}
              />
            </div>
              <div className="bg-white shadow-md rounded-lg mt-5 border-t-4 border-[#6c2bd9] p-5 ">
                <div className="font-bold text-[#6c2bd9] mb-3">Delivery Person</div>
              <Title level={5}>Pickup Person Name</Title>
              <Input
                placeholder="Pickup Person Name"
                value={formData.pickupPersonName}
                onChange={(e) => handleChange('pickupPersonName', e.target.value)}
                className="h-8"
              />
              <Title level={5} className="mt-3">Pickup Person Phone</Title>
              <Input
                placeholder="Pickup Person Phone"
                value={formData.pickupPersonPhone}
                onChange={(e) => handleChange('pickupPersonPhone', e.target.value)}
                className="h-8"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <Button className="bg-[#6c2bd9] text-white" onClick={handleSubmit}>
            Save Order
          </Button>
        </div>
      </div>
    </Layout>
  );
}
