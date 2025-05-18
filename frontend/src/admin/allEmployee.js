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
      <style>
        {`
          .employees-container {
            padding: 30px;
            max-width: 1200px;
            margin: 0 auto;
            background-color: #f5f5f5;
            min-height: 100vh;
          }

          .employees-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            justify-items: center;
          }

          .employee-card {
            width: 100%;
            max-width: 300px;
            border-radius: 8px;
          }

          @media (max-width: 768px) {
            .employees-container {
              max-width: 100%; /* Ensure container doesn't exceed viewport width */
              padding: 15px; /* Reduce padding for mobile */
            }

            .employees-grid {
              grid-template-columns: minmax(0, 300px); /* Single centered column */
              justify-items: center; /* Center the card in the grid */
              justify-content: center; /* Center the grid itself in the container */
            }
          }
        `}
      </style>

      <div className="employees-container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{ fontSize: '24px', margin: 0 }}>Employees Directory</h1>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Search
            placeholder="Search by name"
            allowClear
            onChange={e => setSearchQuery(e.target.value)} // Update searchQuery as user types
            onSearch={value => setSearchQuery(value)} // Still handle search button/Enter key
            style={{ width: 300 }}
            value={searchQuery} // Bind the input value to searchQuery state
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
          <div className="employees-grid">
            {filteredEmployees.map(emp => (
              <Card
                key={emp._id}
                hoverable
                className="employee-card"
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar style={{ backgroundColor: '#5e208e', marginRight: 8 }}>
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