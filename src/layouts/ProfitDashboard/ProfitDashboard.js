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
  GetDayProfit, 
  GetWeeklyProfit, 
  GetMonthProfit, 
  GetYearProfit, 
  GetDailyProfitData, 
  GetWeeklyProfitData, 
  GetYearlyProfitData,
 
} from 'Services/profitService';
import { 
  
  GetDayProfitComparison,
  GetWeekProfitComparison,
  GetMonthProfitComparison,
  GetYearProfitComparison
} from 'Services/ProfitComparison'
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProfitDashboard() {
  const [dailyProfit, setDailyProfit] = useState(0);
  const [weeklyProfit, setWeeklyProfit] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [yearlyProfit, setYearlyProfit] = useState(0);
  
  const [dailyProfitData, setDailyProfitData] = useState({});
  const [weeklyProfitData, setWeeklyProfitData] = useState({});
  const [yearlyProfitData, setYearlyProfitData] = useState({});
  
  const [dailyProfitComparison, setDailyProfitComparison] = useState(0);
  const [weeklyProfitComparison, setWeeklyProfitComparison] = useState(0);
  const [monthlyProfitComparison, setMonthlyProfitComparison] = useState(0);
  const [yearlyProfitComparison, setYearlyProfitComparison] = useState(0);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 
  useEffect(() => {
    const fetchProfits = async () => {
      try {
        const [dailyRev, weeklyRev, monthlyRev, yearlyRev, 
                dailyData, weeklyData, yearlyData,
                dailyComp, weeklyComp, monthlyComp, yearlyComp] = await Promise.all([
          GetDayProfit(),
          GetWeeklyProfit(),
          GetMonthProfit(),
          GetYearProfit(),
          GetDailyProfitData(),
          GetWeeklyProfitData(),
          GetYearlyProfitData(),
          GetDayProfitComparison(),
          GetWeekProfitComparison(),
          GetMonthProfitComparison(),
          GetYearProfitComparison()
        ]);

        // Set state with the fetched data
        setDailyProfit(dailyRev);
        setWeeklyProfit(weeklyRev);
        setMonthlyProfit(monthlyRev);
        setYearlyProfit(yearlyRev);

        setDailyProfitData(dailyData);
        setWeeklyProfitData(weeklyData);
        setYearlyProfitData(yearlyData);

        setDailyProfitComparison(dailyComp);
        setWeeklyProfitComparison(weeklyComp);
        setMonthlyProfitComparison(monthlyComp);
        setYearlyProfitComparison(yearlyComp);
        setLoading(false); 
      } catch (error) {
        console.error('Failed to fetch profit data:', error);
        setLoading(false);
      }
    };

    fetchProfits();
  }, []);

  const formatChartData = (data, labels) => {
    const salesData = labels.map(label => data[label] || 0);
    return {
      labels: labels,
      datasets: [
        {
          label: "Profit",
          data: salesData,
          backgroundColor: '#42A5F5',
        },
      ],
    };
  };

  const weeklySalesChartData = formatChartData(weeklyProfitData, ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const dailySalesChartData = formatChartData(dailyProfitData, ["00:00", "03:00", "06:00", "09:00", "12:00", "15:00", "18:00", "21:00"]);
  const yearlySalesChartData = formatChartData(yearlyProfitData, ["Jan-Feb", "Mar-Apr", "May-Jun", "Jul-Aug", "Sep-Oct", "Nov-Dec"]);
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
        style={buttonStyles}
      >
        Profit
      </button>
      <button 
        onClick={() => navigate('/SalesDashboard')} 
        style={buttonStyles}
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
                count={dailyProfit.toLocaleString()}
                percentage={{
                  color: dailyProfitComparison > 0 ? "success" : "error",
                  amount: `${dailyProfitComparison.toFixed(2)}%`,
                  label: "compared to yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="leaderboard"
                title={<b>Weekly Profit</b>}
                count={weeklyProfit.toLocaleString()}
                percentage={{
                  color: weeklyProfitComparison > 0 ? "success" : "error",
                  amount: `${weeklyProfitComparison.toFixed(2)}%`,
                  label: "compared to last week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title={<b>Monthly Profit</b>}
                count={monthlyProfit.toLocaleString()}
                percentage={{
                  color: monthlyProfitComparison > 0 ? "success" : "error",
                  amount: `${monthlyProfitComparison.toFixed(2)}%`,
                  label: "compared to last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title={<b>Yearly Profit</b>}
                count={yearlyProfit.toLocaleString()}
                percentage={{
                  color: yearlyProfitComparison > 0 ? "success" : "error",
                  amount: `${yearlyProfitComparison.toFixed(2)}%`,
                  label: "compared to last year",
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
                  options={chartOptions('Weekly Profit Data')}
                  style={styles.chart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3} style={styles.chartContainer}>
                <Bar
                  data={dailySalesChartData}
                  options={chartOptions('Daily Profit Data (3-Hour Intervals)')}
                  style={styles.chart}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3} style={styles.chartContainer}>
                <Bar
                  data={yearlySalesChartData}
                  options={chartOptions('Yearly Profit Data')}
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
const buttonStyles = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '15px 30px',
  fontSize: '18px',
  borderRadius: '8px',
  border: 'none',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  letterSpacing: '1px',
  textTransform: 'uppercase',
};

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

// Chart options
const chartOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: true, text: title },
  },
  scales: {
    x: { beginAtZero: true },
    y: {
      beginAtZero: true,
      ticks: { callback: (value) => `$${value}` },
    },
  },
});

export default ProfitDashboard;
