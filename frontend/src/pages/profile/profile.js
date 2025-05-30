// Paste this full code into your ProfilePage.jsx or equivalent file
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
  Upload,
  Avatar,
  Row,
  Col,
  Tabs,
} from 'antd';
import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  IdcardOutlined,
  HomeOutlined,
  BankOutlined,
  UploadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import Layout from '../../components/Layout';

const { TabPane } = Tabs;

const colors = {
  primary: '#5e208e',
  secondary: '#d4beff',
  background: '#f0f2f5',
};

const ProfilePage = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [error, setError] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/employees/profile/${username}`);
        setEmployee(res.data);
        form.setFieldsValue(res.data);
        setPhotoUrl(res.data.photoUrl);
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

  const handlePhotoUpload = (info) => {
    if (info.file.status === 'done') {
      const imageUrl = URL.createObjectURL(info.file.originFileObj);
      setPhotoUrl(imageUrl);
      message.success('Photo uploaded!');
    }
  };

  if (loading) {
    return <Spin size="large" className="block mx-auto mt-40" style={{ color: colors.primary }} />;
  }

  if (error) {
    return (
      <Alert
        message={error}
        type="error"
        className="m-5 text-xs sm:text-sm"
        style={{ backgroundColor: colors.secondary, borderColor: colors.primary }}
      />
    );
  }

  return (
    <Layout>
      <div
        className="max-w-6xl mx-auto p-4 sm:p-10 text-xs sm:text-sm"
        style={{ backgroundColor: colors.background, minHeight: '100vh', borderRadius: 12 }}
      >
        <Card
          className="rounded-2xl shadow-2xl transition-transform hover:scale-[1.02]"
          bodyStyle={{ padding: 20 }}
          style={{ borderColor: colors.primary }}
          title={
            <span
              className="text-base sm:text-lg font-semibold flex items-center gap-2"
              style={{ color: colors.primary }}
            >
              <UserOutlined style={{ color: colors.primary }} /> Employee Profile
            </span>
          }
          extra={
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              size="large"
              onClick={() => setDrawerVisible(true)}
              className="hidden sm:inline-flex"
              aria-label="Edit Profile"
              style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.secondary)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
            />
          }
        >
          <Row gutter={[24, 24]} justify="center" align="middle">
            {/* Avatar Section */}
            <Col xs={24} sm={8} className="flex justify-center relative">
              <div className="relative group">
                <Avatar
                  size={120}
                  src={photoUrl}
                  className="border-4 shadow-lg"
                  alt="Profile Photo"
                  style={{ borderColor: colors.primary }}
                />
                <Upload
                  showUploadList={false}
                  customRequest={({ file, onSuccess }) => setTimeout(() => onSuccess('ok'), 0)}
                  onChange={handlePhotoUpload}
                  className="absolute bottom-0 right-0 rounded-full p-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: colors.primary, color: 'white' }}
                  aria-label="Upload Profile Photo"
                >
                  <UploadOutlined />
                </Upload>
              </div>
            </Col>

            {/* Details Tabs Section */}
            <Col xs={24} sm={16}>
              <Tabs
                defaultActiveKey="1"
                tabPosition={window.innerWidth < 640 ? 'top' : 'left'}
                size="small"
                tabBarGutter={10}
                items={[
                  {
                    key: '1',
                    label: (
                      <span className="text-xs sm:text-sm" style={{ color: colors.primary }}>
                        <InfoCircleOutlined /> Basic Info
                      </span>
                    ),
                    children: (
                      <Descriptions
                        column={1}
                        bordered
                        size="small"
                        labelStyle={{ fontWeight: 600, color: colors.primary }}
                        contentStyle={{ fontSize: '0.75rem' }}
                      >
                        <Descriptions.Item label="Name">{employee.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">
                          <MailOutlined style={{ marginRight: 6 }} /> {employee.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Username">{employee.username}</Descriptions.Item>
                        <Descriptions.Item label="Employee ID">{employee.employeeId}</Descriptions.Item>
                        <Descriptions.Item label="Role">{employee.role}</Descriptions.Item>
                      </Descriptions>
                    ),
                  },
                  {
                    key: '2',
                    label: (
                      <span className="text-xs sm:text-sm" style={{ color: colors.primary }}>
                        <PhoneOutlined /> Contact
                      </span>
                    ),
                    children: (
                      <Descriptions
                        column={1}
                        bordered
                        size="small"
                        labelStyle={{ fontWeight: 600, color: colors.primary }}
                        contentStyle={{ fontSize: '0.75rem' }}
                      >
                        <Descriptions.Item label="Phone">{employee.phone}</Descriptions.Item>
                        <Descriptions.Item label="DOB">
                          {employee.dateOfBirth?.substring(0, 10)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Gender">{employee.gender}</Descriptions.Item>
                        <Descriptions.Item label="National ID">{employee.nationalId}</Descriptions.Item>
                      </Descriptions>
                    ),
                  },
                  {
                    key: '3',
                    label: (
                      <span className="text-xs sm:text-sm" style={{ color: colors.primary }}>
                        <HomeOutlined /> Address
                      </span>
                    ),
                    children: (
                      <Descriptions
                        column={1}
                        bordered
                        size="small"
                        labelStyle={{ fontWeight: 600, color: colors.primary }}
                        contentStyle={{ fontSize: '0.75rem' }}
                      >
                        <Descriptions.Item label="Employment Type">{employee.employmentType}</Descriptions.Item>
                        <Descriptions.Item label="Start Date">
                          {employee.startDate?.substring(0, 10)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Current Address">{employee.currentAddress}</Descriptions.Item>
                      </Descriptions>
                    ),
                  },
                  {
                    key: '4',
                    label: (
                      <span className="text-xs sm:text-sm" style={{ color: colors.primary }}>
                        <IdcardOutlined /> Emergency Contact
                      </span>
                    ),
                    children: (
                      <Descriptions
                        column={1}
                        bordered
                        size="small"
                        labelStyle={{ fontWeight: 600, color: colors.primary }}
                        contentStyle={{ fontSize: '0.75rem' }}
                      >
                        <Descriptions.Item label="Name">{employee.emergencyContactName}</Descriptions.Item>
                        <Descriptions.Item label="Relation">{employee.emergencyContactRelation}</Descriptions.Item>
                        <Descriptions.Item label="Phone">{employee.emergencyContactNumber}</Descriptions.Item>
                      </Descriptions>
                    ),
                  },
                  {
                    key: '5',
                    label: (
                      <span className="text-xs sm:text-sm" style={{ color: colors.primary }}>
                        <BankOutlined /> Bank Info
                      </span>
                    ),
                    children: (
                      <Descriptions
                        column={1}
                        bordered
                        size="small"
                        labelStyle={{ fontWeight: 600, color: colors.primary }}
                        contentStyle={{ fontSize: '0.75rem' }}
                      >
                        <Descriptions.Item label="Bank Name">{employee.bankName}</Descriptions.Item>
                        <Descriptions.Item label="Account Number">{employee.accountNumber}</Descriptions.Item>
                      </Descriptions>
                    ),
                  },
                ]}
              />
            </Col>
          </Row>

          {/* Floating Edit Button on Mobile */}
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            size="large"
            className="fixed bottom-6 right-6 z-50 sm:hidden shadow-lg"
            onClick={() => setDrawerVisible(true)}
            aria-label="Edit Profile"
            style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.secondary)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
          />
        </Card>

        <Drawer
          title="Edit Profile"
          placement="right"
          width={window.innerWidth < 500 ? '100%' : 400}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ paddingBottom: 80, backgroundColor: colors.background }}
          headerStyle={{ borderBottomColor: colors.primary, color: colors.primary }}
        >
          <Form layout="vertical" form={form} onFinish={handleUpdate}>
            {[
              ['phone', 'Phone'],
              ['dateOfBirth', 'Date of Birth', 'date'],
              ['gender', 'Gender'],
              ['nationalId', 'National ID'],
              ['employmentType', 'Employment Type'],
              ['startDate', 'Start Date', 'date'],
              ['currentAddress', 'Current Address', 'textarea'],
              ['emergencyContactName', 'Emergency Contact Name'],
              ['emergencyContactNumber', 'Emergency Contact Number'],
              ['emergencyContactRelation', 'Emergency Contact Relation'],
              ['bankName', 'Bank Name'],
              ['accountNumber', 'Account Number'],
            ].map(([name, label, type]) => (
              <Form.Item
                key={name}
                name={name}
                label={label}
                labelCol={{ style: { color: colors.primary, fontWeight: '600' } }}
              >
                {type === 'textarea' ? (
                  <Input.TextArea size="small" />
                ) : (
                  <Input type={type === 'date' ? 'date' : 'text'} size="small" />
                )}
              </Form.Item>
            ))}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.secondary)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = colors.primary)}
              >
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </Layout>
  );
};

export default ProfilePage;
