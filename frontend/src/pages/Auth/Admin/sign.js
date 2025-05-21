import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Select, Typography, Alert } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'admin',
    adminSecret: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
    setError('');
  };

  const handleSignup = async () => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: formData.role,
      };

      const headers = formData.role === 'admin' ? { 'x-admin-secret': formData.adminSecret } : {};

      const res = await axios.post(
        `http://localhost:5000/api/users/signup`,
        payload,
        { headers }
      );

      const { token, role } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', formData.username);
      localStorage.setItem('role', role);

      navigate(role === 'admin' ? '/admin-dashboard' : '/employee-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6' }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', width: '100%', maxWidth: 700 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>User Signup</Title>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        <Form layout="vertical" onFinish={handleSignup}>
          <Form.Item label="Name" required>
            <Input
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Email" required>
            <Input
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Username" required>
            <Input
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Password" required>
            <Input.Password
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item label="Role" required>
            <Select value={formData.role} onChange={handleRoleChange}>
              <Option value="employee">Employee</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
          {formData.role === 'admin' && (
            <Form.Item label="Admin Secret" required>
              <Input.Password
                name="adminSecret"
                placeholder="Enter admin secret"
                value={formData.adminSecret}
                onChange={handleChange}
              />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Signup
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UserSignup;
