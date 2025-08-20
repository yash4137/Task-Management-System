import React, { useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  useUserAuth();

  const {user} = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  return (
    <DashboardLayout activeMenu="Dashboard">Dashboard</DashboardLayout>
  )
};

export default Dashboard;