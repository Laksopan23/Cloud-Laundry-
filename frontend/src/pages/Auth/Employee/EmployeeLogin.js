import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, Space } from 'antd';

const { Title } = Typography;

const EmployeeLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    try {
      const res = await axios.post('http://localhost:5000/api/employees/login', credentials);
      const { username, role } = res.data;

      localStorage.setItem('username', username);
      localStorage.setItem('role', role);

      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dash');
      }
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSignupNavigate = () => {
    navigate('/mos');
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
           Login
        </Title>
        <Form onFinish={handleLogin}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              name="username"
              placeholder="Username"
              value={credentials.username}
              onChange={handleChange}
              style={{ height: '40px', fontSize: '16px' }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleChange}
              style={{ height: '40px', fontSize: '16px' }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                height: '40px',
                fontSize: '16px',
                background: '#1890ff',
                borderColor: '#1890ff'
              }}
            >
              Login
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="link"
              block
              onClick={handleSignupNavigate}
              style={{
                fontSize: '16px',
                color: '#1890ff'
              }}
            >
              Don't have an account? Sign up
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EmployeeLogin;