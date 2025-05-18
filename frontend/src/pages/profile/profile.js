import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert } from 'antd';
import axios from 'axios';
import Layout from '../../components/Layout'

const ProfilePage = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('username');

    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/employees/profile/${username}`);
        setEmployee(res.data);
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
  }, []);

  if (loading) return <Spin style={{ display: 'block', margin: '100px auto' }} />;
  if (error) return <Alert message={error} type="error" style={{ margin: 20 }} />;

  return (
    <Layout>
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <Card
        title="Employee Profile"
        bordered
        style={{
          width: 400,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: '12px',
          padding: '20px',
        }}
      >
        <p><strong>Name:</strong> {employee.name}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Username:</strong> {employee.username}</p>
        <p><strong>Employee ID:</strong> {employee.employeeId}</p>
        <p><strong>Role:</strong> {employee.role}</p>
      </Card>
    </div>
    </Layout>
  );
};

export default ProfilePage;
