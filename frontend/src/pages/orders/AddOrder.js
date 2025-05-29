import React, { useState } from 'react';
import {
  Input,
  DatePicker,
  TimePicker,
  Button,
  Typography,
  message,
  Form,
} from 'antd';
import {
  UserOutlined,
  ProfileOutlined,
  ShoppingCartOutlined,
  CarOutlined,
} from '@ant-design/icons';
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
  const [form] = Form.useForm();
  const [selectedService, setSelectedService] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemDetails, setItemDetails] = useState({ customItems: [] });

  const handleAddItem = (data) => {
    setItemDetails({ customItems: data.customItems });
    message.success('Items added!');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (itemDetails.customItems.length === 0) {
        message.error('Please add at least one item.');
        return;
      }

      if (
        values.expectedDeliveryDate &&
        values.date &&
        values.expectedDeliveryDate.isBefore(values.date)
      ) {
        message.error('Expected delivery date must be after the order date.');
        return;
      }

      const formattedItems = itemDetails.customItems.map((item) => ({
        itemName: item.items,
        quantity: item.qty,
        price: item.price,
      }));

      await axios.post('http://localhost:5000/api/orders', {
        ...values,
        date: values.date?.toISOString(),
        expectedDeliveryDate: values.expectedDeliveryDate?.toISOString(),
        time: values.time?.format('HH:mm'),
        items: formattedItems,
      });

      message.success('Order saved successfully!');
      form.resetFields();
      setSelectedService(null);
      setItemDetails({ customItems: [] });
    } catch (error) {
      if (error.name !== 'ValidationError') {
        message.error(
          error.response?.data?.message || error.message || 'Failed to submit order'
        );
      }
    }
  };

  const services = [
    { name: 'Laundry', img: Laundry },
    { name: 'Curtains Cleaning', img: Curtains },
    { name: 'Sofa, Carpet & Interior Cleaning', img: Sofa },
    { name: 'Domestic Cleaning', img: House },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4">
        <Form layout="vertical" form={form}>
          {/* Personal Details */}
          <div className="bg-white shadow-md rounded-lg mt-5 border-t-4 border-[#6c2bd9] p-5">
            <div className="text-[#6c2bd9] font-bold text-lg flex items-center gap-2 mb-4">
              <UserOutlined /> Personal Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Form.Item
                label="Customer Name"
                name="customerName"
                rules={[{ required: true, message: 'Customer name is required' }]}
              >
                <Input placeholder="Customer Name" className="h-8" />
              </Form.Item>
              <Form.Item
                label="Customer Phone"
                name="customerPhone"
                rules={[{ required: true, message: 'Customer phone is required' }]}
              >
                <Input placeholder="Customer Phone" className="h-8" />
              </Form.Item>
              <Form.Item
                label="Address Line 1"
                name="Addressline1"
                rules={[{ required: true, message: 'Address Line 1 is required' }]}
              >
                <Input placeholder="Address Line 1" className="h-8" />
              </Form.Item>
              <Form.Item
                label="Address Line 2"
                name="Addressline2"
                rules={[{ required: true, message: 'Address Line 2 is required' }]}
              >
                <Input placeholder="Address Line 2" className="h-8" />
              </Form.Item>
            </div>
          </div>

          {/* Service Type */}
          <Form.Item
            name="selectedService"
            rules={[{ required: true, message: 'Please select a service' }]}
          >
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
                        form.setFieldValue('selectedService', service.name);
                      }}
                      className={`rounded-lg border transition-all duration-300 flex flex-col justify-center items-center cursor-pointer p-3 text-center ${
                        isSelected ? 'border-[#6c2bd9] bg-[#f3eaff]' : 'border-gray-300 bg-white'
                      }`}
                    >
                      <img
                        src={service.img}
                        alt={service.name}
                        className="w-[75px] h-[75px] mb-2"
                      />
                      <div className="text-sm">{service.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Form.Item>

          {/* Order Details */}
          <div className="bg-white shadow-md rounded-lg mt-5 border-t-4 border-[#6c2bd9] p-5">
            <div className="text-[#6c2bd9] font-bold text-lg flex items-center gap-2 mb-4">
              <ShoppingCartOutlined /> Order Details
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Form.Item label="Invoice Number">
                <Input className="h-8" placeholder="Auto-generated" value="Auto-generated" disabled />
              </Form.Item>
              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true, message: 'Please select a date' }]}
              >
                <DatePicker placeholder="Date" className="w-full" />
              </Form.Item>
              <Form.Item
                label="Expected Delivery Date"
                name="expectedDeliveryDate"
                rules={[{ required: true, message: 'Expected delivery date is required' }]}
              >
                <DatePicker placeholder="Expected Delivery Date" className="w-full" />
              </Form.Item>
              <Form.Item
                label="Time"
                name="time"
                rules={[{ required: true, message: 'Please select a time' }]}
              >
                <TimePicker placeholder="Time" className="w-full" />
              </Form.Item>
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
                <Form.Item
                  label="Pickup & Delivery Fee"
                  name="pickupFee"
                  rules={[{ required: true, message: 'Pickup fee is required' }]}
                >
                  <Input placeholder="Pickup & Delivery Fee" className="h-8" />
                </Form.Item>
                <Form.Item
                  label="Pickup & Delivery Discount"
                  name="pickupDiscount"
                  rules={[{ required: true, message: 'Pickup discount is required' }]}
                >
                  <Input placeholder="Pickup & Delivery Discount" className="h-8" />
                </Form.Item>
                <Form.Item
                  label="Note"
                  name="note"
                  
                >
                  <TextArea placeholder="Note" rows={4} />
                </Form.Item>
              </div>
              <div className="bg-white shadow-md rounded-lg mt-5 border-t-4 border-[#6c2bd9] p-5">
                <div className="font-bold text-[#6c2bd9] mb-3">Delivery Person</div>
                <Form.Item
                  label="Pickup Person Name"
                  name="pickupPersonName"
                  rules={[{ required: true, message: 'Pickup person name is required' }]}
                >
                  <Input placeholder="Pickup Person Name" className="h-8" />
                </Form.Item>
                <Form.Item
                  label="Pickup Person Phone"
                  name="pickupPersonPhone"
                  rules={[{ required: true, message: 'Pickup person phone is required' }]}
                >
                  <Input placeholder="Pickup Person Phone" className="h-8" />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button className="bg-[#6c2bd9] text-white" onClick={handleSubmit}>
              Save Order
            </Button>
          </div>
        </Form>
      </div>
    </Layout>
  );
}
