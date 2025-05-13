import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    ordersPerService: {},
    statusBreakdown: {},
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        calculateAnalytics(data);
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
      });
  }, []);

  const calculateAnalytics = (orders) => {
    let totalOrders = orders.length;
    let totalRevenue = 0;
    let ordersPerService = {};
    let statusBreakdown = {};

    orders.forEach((order) => {
      // Total revenue
      order.items.forEach(item => {
        totalRevenue += item.quantity * item.price;
      });

      // Orders per service
      const service = order.selectedService;
      ordersPerService[service] = (ordersPerService[service] || 0) + 1;

      // Status breakdown
      const status = order.status;
      statusBreakdown[status] = (statusBreakdown[status] || 0) + 1;
    });

    setAnalytics({
      totalOrders,
      totalRevenue,
      ordersPerService,
      statusBreakdown,
    });
  };

  return (
    <div>
      <h2>Order Analytics</h2>
      <p><strong>Total Orders:</strong> {analytics.totalOrders}</p>
      <p><strong>Total Revenue:</strong> ${analytics.totalRevenue.toFixed(2)}</p>

      <h3>Orders per Service</h3>
      <ul>
        {Object.entries(analytics.ordersPerService).map(([service, count]) => (
          <li key={service}>{service}: {count}</li>
        ))}
      </ul>

      <h3>Status Breakdown</h3>
      <ul>
        {Object.entries(analytics.statusBreakdown).map(([status, count]) => (
          <li key={status}>{status}: {count}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
