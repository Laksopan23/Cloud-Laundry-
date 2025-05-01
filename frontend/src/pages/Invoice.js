import React from 'react';
import { Input, DatePicker, TimePicker, Button, Card, Typography } from 'antd';
import { UserOutlined, ProfileOutlined, ShoppingCartOutlined, CarOutlined } from '@ant-design/icons';
import Layout from '../components/Layout';
import Laundry from '../images/4.png';

const { TextArea } = Input;
const { Title } = Typography;

export default function LaundryForm() {
  return (
    <Layout>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 20, fontFamily: 'sans-serif' }}>
        <h2 style={{ textAlign: 'center', color: '#6c2bd9' }}>Cloud Laundry.lk – Your Trusted Laundry Partner</h2>

        {/* Personal Details */}
        <Card
          title={<span><UserOutlined /> Personal Details</span>}
          size="small"
          style={{ marginTop: 20, borderTop: '5px solid #6c2bd9' }}
        >
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <Title level={5}>Customer Name</Title>
              <Input placeholder="Customer Name" />
            </div>

                      <div>
                        <img src={Laundry} alt="Logo" style={{ width: "100%" }} />
                      </div>
            <div style={{ flex: 1 }}>
              <Title level={5}>Customer Address 1</Title>
              <Input placeholder="Customer Address 1" />
            </div>
            <div style={{ flex: 1 }}>
              <Title level={5}>Customer Phone</Title>
              <Input placeholder="Customer Phone" />
            </div>
            <div style={{ flex: 1 }}>
              <Title level={5}>Customer Address 2</Title>
              <Input placeholder="Customer Address 2" />
            </div>
          </div>
        </Card>

        {/* Service Type */}
        <Card
          title={<span><ProfileOutlined /> Service Type</span>}
          size="small"
          style={{ marginTop: 20, borderTop: '5px solid #6c2bd9' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {['Laundry', 'Curtains Cleaning', 'Sofa, Carpet & Interior Cleaning', 'House Deep Cleaning'].map((type, index) => (
              <div
                key={index}
                style={{
                  width: 150,
                  height: 150,
                  border: type === 'Curtains Cleaning' ? '2px solid #6c2bd9' : '1px solid #ccc',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: type === 'Curtains Cleaning' ? '#f3eaff' : '#fff',
                  textAlign: 'center',
                  padding: 10,
                  cursor: 'pointer'
                }}
              >
                {type}
              </div>
            ))}
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
              <Input placeholder="Invoice Number" value="Auto-generated" disabled />
            </div>
            <div style={{ flex: 1 }}>
              <Title level={5}>Date</Title>
              <DatePicker placeholder="Date" style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Title level={5}>Expected Delivery Date</Title>
              <DatePicker placeholder="Expected Delivery Date" style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Title level={5}>Time</Title>
              <TimePicker placeholder="Time" style={{ width: '100%' }} />
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
              <Input placeholder="Pickup & Delivery Fee" style={{ marginBottom: 10 }} />
              <Title level={5}>Pickup & Delivery Discount</Title>
              <Input placeholder="Pickup & Delivery Discount" style={{ marginBottom: 10 }} />
              <Title level={5}>Note</Title>
              <TextArea placeholder="Note" rows={4} />
            </div>
            <div style={{ flex: 1 }}>
              <Card
                title={<span style={{ fontWeight: 'bold', color: '#6c2bd9' }}>Delivery Person</span>}
                size="small"
              >
                <Title level={5}>Pickup Person Name</Title>
                <Input placeholder="Pickup Person Name" style={{ marginBottom: 10 }} />
                <Title level={5}>Pickup Person Phone</Title>
                <Input placeholder="Pickup Person Phone" />
              </Card>
            </div>
          </div>
        </Card>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Button style={{ backgroundColor: '#6c2bd9', color: '#fff' }}>Generate Invoice</Button>
        </div>
      </div>
    </Layout>
  );
}
