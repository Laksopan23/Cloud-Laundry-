import React, { useEffect, useState } from 'react';
import {
  Card,
  Spin,
  Alert,
  Descriptions,
  Button,
  Drawer,
  Form,
  Input,
  message,
  Space,
} from 'antd';
import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  IdcardOutlined,
  HomeOutlined,
  BankOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import Layout from '../../components/Layout';

const ProfilePage = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');

    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/employees/profile/${username}`);
        setEmployee(res.data);
        form.setFieldsValue(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchEmployee();
    else {
      setError('No username found in local storage');
      setLoading(false);
    }
  }, [form]);

  const handleUpdate = async (values) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/employees/update/${employee.username}`,
        values
      );
      message.success('Profile updated successfully!');
      setEmployee(res.data.employee);
      setDrawerVisible(false);
    } catch (err) {
      message.error(err.response?.data?.message || 'Update failed');
    }
  };

  if (loading) return <Spin style={{ display: 'block', margin: '100px auto' }} />;
  if (error) return <Alert message={error} type="error" style={{ margin: 20 }} />;

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
        <Card
          title={
            <Space>
              <UserOutlined />
              Employee Profile
            </Space>
          }
          style={{
            width: 600,
            borderRadius: 12,
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          }}
          extra={
            <Button icon={<EditOutlined />} onClick={() => setDrawerVisible(true)}>
              Edit
            </Button>
          }
        >
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Name">{employee.name}</Descriptions.Item>
            <Descriptions.Item label="Email">
              <MailOutlined /> {employee.email}
            </Descriptions.Item>
            <Descriptions.Item label="Username">{employee.username}</Descriptions.Item>
            <Descriptions.Item label="Employee ID">{employee.employeeId}</Descriptions.Item>
            <Descriptions.Item label="Role">{employee.role}</Descriptions.Item>
            <Descriptions.Item label="Phone">
              <PhoneOutlined /> {employee.phone}
            </Descriptions.Item>
            <Descriptions.Item label="DOB">{employee.dateOfBirth?.substring(0, 10)}</Descriptions.Item>
            <Descriptions.Item label="Gender">{employee.gender}</Descriptions.Item>
            <Descriptions.Item label="National ID">
              <IdcardOutlined /> {employee.nationalId}
            </Descriptions.Item>
            <Descriptions.Item label="Employment Type">{employee.employmentType}</Descriptions.Item>
            <Descriptions.Item label="Start Date">{employee.startDate?.substring(0, 10)}</Descriptions.Item>
            <Descriptions.Item label="Address">
              <HomeOutlined /> {employee.currentAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Emergency Contact">
              {employee.emergencyContactName} ({employee.emergencyContactRelation}) -{' '}
              {employee.emergencyContactNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Bank Info">
              <BankOutlined /> {employee.bankName} - {employee.accountNumber}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      <Drawer
        title="Edit Profile"
        placement="right"
        width={400}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Form layout="vertical" form={form} onFinish={handleUpdate}>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Date of Birth">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Input />
          </Form.Item>
          <Form.Item name="nationalId" label="National ID">
            <Input />
          </Form.Item>
          <Form.Item name="employmentType" label="Employment Type">
            <Input />
          </Form.Item>
          <Form.Item name="startDate" label="Start Date">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="currentAddress" label="Current Address">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="emergencyContactName" label="Emergency Contact Name">
            <Input />
          </Form.Item>
          <Form.Item name="emergencyContactNumber" label="Emergency Contact Number">
            <Input />
          </Form.Item>
          <Form.Item name="emergencyContactRelation" label="Emergency Contact Relation">
            <Input />
          </Form.Item>
          <Form.Item name="bankName" label="Bank Name">
            <Input />
          </Form.Item>
          <Form.Item name="accountNumber" label="Account Number">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </Layout>
  );
};

export default ProfilePage;
