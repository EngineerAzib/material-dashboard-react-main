import React, { useEffect, useState } from 'react';
import Grid from "@mui/material/Grid";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { useNavigate } from 'react-router-dom';
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import { Audio } from 'react-loader-spinner'; // Import loader
import {
  getDailyRevenue,
  getWeeklyRevenue,
  getMonthlyRevenue,
  getYearlyRevenue
} from 'Services/revenueService';
import {
  GetTotalDalySale,
  GetTotalWeeklySale,
  GetTotalMonthlySale,
  GetTotalYearlySale,
  GetDailySales,
  GetWeeklySales,
  GetYearlySales
} from 'Services/saleService';
import {
  GetDailySaleMinusPaymentReceived,
  GetWeeklySaleMinusPaymentReceived,
  GetMonthlySaleMinusPaymentReceived,
  GetYearlySaleMinusPaymentReceived
} from 'Services/saleminusrecivedpayment';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SalesDashboard() {
  const navigate = useNavigate();

  // Revenue states
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [yearlyRevenue, setYearlyRevenue] = useState(0);

  // Sales states
  const [dailySales, setDailySales] = useState(0);
  const [weeklySales, setWeeklySales] = useState(0);
  const [monthlySales, setMonthlySales] = useState(0);
  const [yearlySales, setYearlySales] = useState(0);

  // Sales minus payment received
  const [dailyMinusPayment, setDailyMinusPayment] = useState(0);
  const [weeklyMinusPayment, setWeeklyMinusPayment] = useState(0);
  const [monthlyMinusPayment, setMonthlyMinusPayment] = useState(0);
  const [yearlyMinusPayment, setYearlyMinusPayment] = useState(0);

  // Sales chart data
  const [dailySalesData, setDailySalesData] = useState({});
  const [weeklySalesData, setWeeklySalesData] = useState({});
  const [yearlySalesData, setYearlySalesData] = useState({});

  // Loading state
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const [
          dailyRev, weeklyRev, monthlyRev, yearlyRev,
          dailySale, weeklySale, monthlySale, yearlySale,
          dailySaleData, weeklySaleData, yearlySaleData,
          dailyMinus, weeklyMinus, monthlyMinus, yearlyMinus
        ] = await Promise.all([
          getDailyRevenue(),
          getWeeklyRevenue(),
          getMonthlyRevenue(),
          getYearlyRevenue(),
          GetTotalDalySale(),
          GetTotalWeeklySale(),
          GetTotalMonthlySale(),
          GetTotalYearlySale(),
          GetDailySales(),
          GetWeeklySales(),
          GetYearlySales(),
          GetDailySaleMinusPaymentReceived(),
          GetWeeklySaleMinusPaymentReceived(),
          GetMonthlySaleMinusPaymentReceived(),
          GetYearlySaleMinusPaymentReceived()
        ]);

        // Set revenue data
        setDailyRevenue(dailyRev);
        setWeeklyRevenue(weeklyRev);
        setMonthlyRevenue(monthlyRev);
        setYearlyRevenue(yearlyRev);

        // Set total sales data
        setDailySales(dailySale);
        setWeeklySales(weeklySale);
        setMonthlySales(monthlySale);
        setYearlySales(yearlySale);

        // Set sales minus payment data
        setDailyMinusPayment(dailyMinus);
        setWeeklyMinusPayment(weeklyMinus);
        setMonthlyMinusPayment(monthlyMinus);
        setYearlyMinusPayment(yearlyMinus);

        // Set sales data for charts
        setDailySalesData(dailySaleData);
        setWeeklySalesData(weeklySaleData);
        setYearlySalesData(yearlySaleData);

        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchSalesData();
  }, []);

  const formatChartData = (data, labels) => ({
    labels,
    datasets: [
      {
        label: "Sales",
        data: labels.map(label => data[label] || 0),
        backgroundColor: '#42A5F5',
      },
    ],
  });

  // Data for charts
  const weeklySalesChartData = formatChartData(weeklySalesData, ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const dailySalesChartData = formatChartData(dailySalesData, ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"]);
  const yearlySalesChartData = formatChartData(yearlySalesData, ["Jan-Feb", "Mar-Apr", "May-Jun", "Jul-Aug", "Sep-Oct", "Nov-Dec"]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Audio
          height="100"
          width="100"
          color="#4fa94d"
          ariaLabel="audio-loading"
          visible={true}
        />
      </div>
    );
  }
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
                title={<b>Daily Sales</b>}
                count={dailySales.toLocaleString()}
                percentage={{
                  color: "success",
                  amount: `${dailyMinusPayment.toLocaleString()}`,
                  label: "Remaining Today Amount",
                }}
                   percentage1={{
                 color: "error", 
                  amount: `${dailyRevenue.toLocaleString()}`,
                  label: "Recived Today",
                  
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
            <ComplexStatisticsCard
                color="info"
                icon="leaderboard"
                title={<b>Weekly Sales</b>}
                count={weeklySales.toLocaleString()}
                percentage={{
                  color: "success",
                  amount: `${weeklyMinusPayment.toLocaleString()}`,
                  label: "Remaining Weekly Amount",
                }}
                percentage1={{
                 color: "error", 
                  amount: `${weeklyRevenue.toLocaleString()}`,
                  label: "Received Weekly",
                  
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
            <ComplexStatisticsCard
                color="success"
                icon="store"
                title={<b>Monthly Sales</b>}
                count={monthlySales.toLocaleString()}
                percentage={{
                  color: "success",
                  amount: `${monthlyMinusPayment.toLocaleString()}`,
                  label: "Remaining Monthly Amount",
                }}
                percentage1={{
                 color: "error", 
                  amount: `${monthlyRevenue.toLocaleString()}`,
                  label: "Received Monthly",
                  
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
            <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title={<b>Yearly Sales</b>}
                count={yearlySales.toLocaleString()}
                percentage={{
                  color: "succes",
                  amount: `${yearlyMinusPayment.toLocaleString()}`,
                  label: "Remaining Yearly Amount",
                 
                }}
                percentage1={{
                 color: "error", 
                  amount: `${yearlyRevenue.toLocaleString()}`,
                  label: "Received Yearly",
                  
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
                      legend: { position: 'top' },
                      title: { display: true, text: 'Weekly Sales Data' },
                    },
                    elements: {
                      bar: { borderWidth: 2, borderColor: '#1E88E5' },
                    },
                    scales: {
                      x: {  grid: {
                          display: true,
                          color: '#e0e0e0', 
                      }
                        },
                      y: {
                        grid: { borderColor: '#e3e3e3', borderWidth: 1, drawBorder: false },
                        ticks: { color: '#555555' },
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
                      legend: { position: 'top' },
                      title: { display: true, text: 'Daily Sales Data (3-Hour Intervals)' },
                    },
                    elements: {
                      bar: { borderWidth: 2, borderColor: '#1E88E5' },
                    },
                    scales: {
                      x: { grid: {
    display: true,
    color: '#e0e0e0', // Color of the grid lines
  }, },
                      y: {
                        grid: { borderColor: '#e3e3e3', borderWidth: 1, drawBorder: false },
                        ticks: { color: '#555555' },
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
                      legend: { position: 'top' },
                      title: { display: true, text: 'Yearly Sales Data' },
                    },
                    elements: {
                      bar: { borderWidth: 2, borderColor: '#1E88E5' },
                    },
                    scales: {
                      x: {  grid: {
    display: true,
    color: '#e0e0e0', // Color of the grid lines
  }, },
                      y: {
                        grid: { borderColor: '#e3e3e3', borderWidth: 1, drawBorder: false },
                        ticks: { color: '#555555' },
                      },
                    },
                  }}
                  style={styles.chart}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

// Inline CSS styles
const styles = {
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    height: '300px',
  },
  chart: {
    height: '100%',
  },
};

export default SalesDashboard;