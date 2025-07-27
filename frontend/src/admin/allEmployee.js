import React, { useState, useEffect, useMemo } from "react";
import { Card, Input, Select, Spin, message, Avatar } from "antd";
import axios from "axios";
import Layout from "../components/Layout";

const { Search } = Input;
const { Option } = Select;

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/employees");
      setEmployees(response.data);
      message.success("Employees loaded successfully");
    } catch (error) {
      console.error("Error fetching employees:", error);
      message.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterRole ? emp.role === filterRole : true),
    );
  }, [employees, searchQuery, filterRole]);

  // Function to split full name into first and last names
  const getNameParts = (fullName) => {
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    return { firstName, lastName };
  };

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto bg-gray-100 min-h-screen md:p-4">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold m-0">Employees Directory</h1>
        </div>

        <div className="flex gap-5 flex-wrap mb-5">
          <Search
            placeholder="Search by name"
            allowClear
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={(value) => setSearchQuery(value)}
            style={{ width: 300 }}
            value={searchQuery}
            className="w-[300px]"
          />
          <Select
            placeholder="Filter by role"
            allowClear
            style={{ width: 200 }}
            onChange={(value) => setFilterRole(value)}
            className="w-[200px]"
          >
            {[...new Set(employees.map((emp) => emp.role))].map((role) => (
              <Option key={role} value={role}>
                {role}
              </Option>
            ))}
          </Select>
        </div>

        {loading ? (
          <Spin tip="Loading employees..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 justify-items-center">
            {filteredEmployees.map((emp) => {
              const { firstName, lastName } = getNameParts(emp.name || "");
              return (
                <Card
                  key={emp._id}
                  hoverable
                  className="w-full max-w-[450px] rounded-lg sm:max-w-[450px]"
                  title={
                    <div className="flex items-center">
                      <Avatar
                        size={{ xs: 24, sm: 32, md: 40 }}
                        style={{ backgroundColor: "#5e208e", marginRight: 8 }}
                      >
                        {emp.name?.charAt(0).toUpperCase()}
                      </Avatar>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="text-sm sm:text-base">
                          {firstName}
                        </span>
                        {lastName && (
                          <span className="text-sm sm:text-base sm:ml-1">
                            {lastName}
                          </span>
                        )}
                      </div>
                    </div>
                  }
                  extra={<span className="text-blue-500">{emp.role}</span>}
                >
                  <p>
                    <strong>Email:</strong> {emp.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {emp.phone}
                  </p>
                  <p>
                    <strong>Username:</strong> {emp.username}
                  </p>
                  <p>
                    <strong>Employment:</strong> {emp.employmentType}
                  </p>
                  <p>
                    <strong>Start Date:</strong>{" "}
                    {emp.startDate
                      ? new Date(emp.startDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong> {emp.currentAddress}
                  </p>

                  <details className="mt-3">
                    <summary className="cursor-pointer text-blue-500">
                      Emergency Contact
                    </summary>
                    <p>
                      <strong>Name:</strong> {emp.emergencyContactName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {emp.emergencyContactNumber}
                    </p>
                    <p>
                      <strong>Relation:</strong> {emp.emergencyContactRelation}
                    </p>
                  </details>

                  <p className="mt-3">
                    <strong>Bank Info:</strong> {emp.bankName || "N/A"} -{" "}
                    {emp.accountNumber || "N/A"}
                  </p>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeesList;
