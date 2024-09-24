import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getDailyRevenue, getWeeklyRevenue, getMonthlyRevenue, getYearlyRevenue, getWeeklySalesData, getDailySalesData, getYearlySalesData } from 'Services/revenueService';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);
  const [weeklySalesData, setWeeklySalesData] = useState({});
  const [dailySalesData, setDailySalesData] = useState({});
  const [yearlySalesData, setYearlySalesData] = useState({});
  
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRevenues = async () => {
      try {
        const dailyRev = await getDailyRevenue();
        const weeklyRev = await getWeeklyRevenue();
        const monthlyRev = await getMonthlyRevenue();
        const yearlyRev = await getYearlyRevenue();
        const weeklySales = await getWeeklySalesData();
        const dailySales = await getDailySalesData();
        const yearlySales = await getYearlySalesData();

        setDailyRevenue(dailyRev);
        setWeeklyRevenue(weeklyRev);
        setMonthlyRevenue(monthlyRev);
        setYearlyRevenue(yearlyRev);
        setWeeklySalesData(weeklySales);
        setDailySalesData(dailySales);
        setYearlySalesData(yearlySales);

        // Log the chart data to ensure it's structured correctly
        console.log(weeklySales);
        console.log(dailySales);
        console.log(yearlySales);
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
      }
    };

    fetchRevenues();
  }, []);

  

  const formatChartData = (data) => {
    const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const salesData = labels.map(day => data[day] || 0);

    return {
      labels: labels,
      datasets: [
        {
          label: "Sales",
          data: salesData,
          backgroundColor: '#42A5F5',
        },
      ],
    };
  };

  const formatChartDataDaily = (data) => {
    const labels = ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"];
    const salesData = labels.map(hour => data[hour] || 0);

    return {
      labels: labels,
      datasets: [
        {
          label: "Sales",
          data: salesData,
          backgroundColor: '#42A5F5',
        },
      ],
    };
  };

  const formatChartDataYearly = (data) => {
    const months = [
      "Jan-Feb", "Mar-Apr", "May-Jun", "Jul-Aug", "Sep-Oct", "Nov-Dec"
    ];
    const salesData = months.map(month => data[month] || 0);

    return {
      labels: months,
      datasets: [
        {
          label: "Sales",
          data: salesData,
          backgroundColor: '#42A5F5',
        },
      ],
    };
  };

  const weeklySalesChartData = formatChartData(weeklySalesData);
  const dailySalesChartData = formatChartDataDaily(dailySalesData);
  const yearlySalesChartData = formatChartDataYearly(yearlySalesData);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <button 
    onClick={() => navigate('/ProfitDashboard')} 
    style={{
        backgroundColor: '#4CAF50', // Green background
        color: 'white',              // White text
        padding: '15px 30px',        // Padding to make the button larger
        fontSize: '18px',            // Larger font size
        borderRadius: '8px',         // Rounded corners
        border: 'none',              // No border
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Soft shadow
        cursor: 'pointer',           // Pointer cursor on hover
        transition: 'all 0.3s ease', // Smooth transition on hover
        letterSpacing: '1px',        // Spacing between letters
        textTransform: 'uppercase',  // Make the text uppercase
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'} // Darken background on hover
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}  // Reset background on mouse out
>
    Profit
</button>
<button 
    onClick={() => navigate('/SalesDashboard')} 
    style={{
        backgroundColor: '#4CAF50', // Green background
        color: 'white',              // White text
        padding: '15px 30px',        // Padding to make the button larger
        fontSize: '18px',            // Larger font size
        borderRadius: '8px',         // Rounded corners
        border: 'none',              // No border
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Soft shadow
        cursor: 'pointer',           // Pointer cursor on hover
        transition: 'all 0.3s ease', // Smooth transition on hover
        letterSpacing: '1px',        // Spacing between letters
        textTransform: 'uppercase',  // Make the text uppercase
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#45a049'} // Darken background on hover
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4CAF50'}  // Reset background on mouse out
>
    Sale
</button>

      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title={<b>Daily Sale</b>}
                count={dailyRevenue.toLocaleString()}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than last week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="leaderboard"
                title={<b>Weekly Revenue</b>}
                count={weeklyRevenue.toLocaleString()}
                percentage={{
                  color: "success",
                  amount: "+5%",
                  label: "than last week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title={<b>Monthly Revenue</b>}
                count={monthlyRevenue.toLocaleString()}
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title={<b>Yearly Revenue</b>}
                count={yearlyRevenue.toLocaleString()}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3} style={styles.chartContainer}>
                <Bar
                  data={weeklySalesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Weekly Sales Data',
                      },
                    },
                    elements: {
                      bar: {
                        borderWidth: 2,
                        borderColor: '#1E88E5',
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        grid: {
                          borderColor: '#e3e3e3',
                          borderWidth: 1,
                          drawBorder: false,
                        },
                        ticks: {
                          color: '#555555',
                        },
                      },
                    },
                  }}
                  style={styles.chart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3} style={styles.chartContainer}>
                <Bar
                  data={dailySalesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Daily Sales Data (3-Hour Intervals)',
                      },
                    },
                    elements: {
                      bar: {
                        borderWidth: 2,
                        borderColor: '#1E88E5',
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        grid: {
                          borderColor: '#e3e3e3',
                          borderWidth: 1,
                          drawBorder: false,
                        },
                        ticks: {
                          color: '#555555',
                        },
                      },
                    },
                  }}
                  style={styles.chart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3} style={styles.chartContainer}>
                <Bar
                  data={yearlySalesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: 'Yearly Sales Data',
                      },
                    },
                    elements: {
                      bar: {
                        borderWidth: 2,
                        borderColor: '#1E88E5',
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                      y: {
                        grid: {
                          borderColor: '#e3e3e3',
                          borderWidth: 1,
                          drawBorder: false,
                        },
                        ticks: {
                          color: '#555555',
                        },
                      },
                    },
                  }}
                  style={styles.chart}
                />
              </MDBox>
            </Grid>
            {/* Other charts */}
          </Grid>
        </MDBox>
        {/* Other components */}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

// Inline CSS styles
const styles = {
  chartContainer: {
    backgroundColor: '#FFFFFF', // Background color
    borderRadius: '16px', // Curved edges
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow effect
    padding: '16px', // Optional: Add some padding
    height: '300px', // Container height for better visibility
  },
  chart: {
    height: '100%', // Ensures the chart fills the container height
  },
};

export default Dashboard;
