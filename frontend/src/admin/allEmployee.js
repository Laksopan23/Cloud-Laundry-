import React, { useState, useEffect, useMemo } from 'react';
import { Card, Input, Select, Spin, message, Avatar, Button } from 'antd';
import axios from 'axios';
import Layout from '../components/Layout';

const { Search } = Input;
const { Option } = Select;

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');

  // Fetch employees from API
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
      message.success('Employees loaded successfully');
    } catch (error) {
      console.error('Error fetching employees:', error);
      message.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (filterRole ? emp.role === filterRole : true)
    );
  }, [employees, searchQuery, filterRole]);

  return (
    <Layout>
      <div style={{
        padding: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{ fontSize: '24px', margin: 0 }}>Employees Directory</h1>
          <Button type="primary" onClick={fetchEmployees}>Refresh</Button>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Search
            placeholder="Search by name"
            allowClear
            onSearch={value => setSearchQuery(value)}
            style={{ width: 300 }}
          />
          <Select
            placeholder="Filter by role"
            allowClear
            style={{ width: 200 }}
            onChange={value => setFilterRole(value)}
          >
            {[...new Set(employees.map(emp => emp.role))].map(role => (
              <Option key={role} value={role}>{role}</Option>
            ))}
          </Select>
        </div>

        {loading ? (
          <Spin tip="Loading employees..." />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {filteredEmployees.map(emp => (
              <Card
                key={emp._id}
                hoverable
                style={{ borderRadius: '8px' }}
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar style={{ backgroundColor: '#1890ff', marginRight: 8 }}>
                      {emp.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <span>{emp.name}</span>
                  </div>
                }
                extra={<span style={{ color: '#1890ff' }}>{emp.role}</span>}
              >
                <p><strong>Email:</strong> {emp.email}</p>
                <p><strong>Phone:</strong> {emp.phone}</p>
                <p><strong>Username:</strong> {emp.username}</p>
                <p><strong>Employment:</strong> {emp.employmentType}</p>
                <p><strong>Start Date:</strong> {emp.startDate ? new Date(emp.startDate).toLocaleDateString() : 'N/A'}</p>
                <p><strong>Address:</strong> {emp.currentAddress}</p>

                <details style={{ marginTop: '10px' }}>
                  <summary style={{ cursor: 'pointer', color: '#1890ff' }}>Emergency Contact</summary>
                  <p><strong>Name:</strong> {emp.emergencyContactName}</p>
                  <p><strong>Phone:</strong> {emp.emergencyContactNumber}</p>
                  <p><strong>Relation:</strong> {emp.emergencyContactRelation}</p>
                </details>

                <p style={{ marginTop: '10px' }}>
                  <strong>Bank Info:</strong> {emp.bankName || 'N/A'} - {emp.accountNumber || 'N/A'}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeesList;
