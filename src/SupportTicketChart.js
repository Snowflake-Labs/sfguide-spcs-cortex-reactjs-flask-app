import React, { useState, useEffect } from 'react';
import {
  ComposedChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  Line
} from 'recharts';
import { Typography } from '@mui/material';

function SupportTicketChart() {
  const [chartData, setChartData] = useState([
    { name: 'Oct 26', totalTickets: 170, resolvedTickets: 90, satisfaction: 82 },
    { name: 'Oct 27', totalTickets: 250, resolvedTickets: 210, satisfaction: 88 },
    { name: 'Oct 28', totalTickets: 50, resolvedTickets: 30, satisfaction: 70 },
    { name: 'Oct 29', totalTickets: 70, resolvedTickets: 40, satisfaction: 78 },
    { name: 'Oct 30', totalTickets: 100, resolvedTickets: 60, satisfaction: 75 },
    { name: 'Oct 31', totalTickets: 200, resolvedTickets: 150, satisfaction: 85 },
    { name: 'Nov 1', totalTickets: 150, resolvedTickets: 100, satisfaction: 80 },
  ]);

  const CustomTick = ({ x, y, payload }) => {
    const color = payload.value === "Nov 1" ? "#fff" : "#666";
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill={color} transform="rotate(-45)">
          {payload.value}
        </text>
      </g>
    );
  };  
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = [...chartData];
      const nov1Data = newData[6];

      // Increment total tickets
      nov1Data.totalTickets += Math.floor(Math.random() * 10);

      // Generate random resolved tickets ensuring it's less than or equal to total tickets
      const randomResolvedTickets = Math.floor(Math.random() * 15); // increasing the max random value for more drastic change
      nov1Data.resolvedTickets = Math.min(nov1Data.resolvedTickets + randomResolvedTickets, nov1Data.totalTickets);
      nov1Data.satisfaction = 50 + Math.floor(Math.random() * 20); // making the change more drastic

      setChartData(newData);
    }, 5000);

    return () => clearInterval(interval);
  }, [chartData]);

  return (
    <div>
        <Typography variant="h6" sx={{ textAlign: 'left' }}>
            Support Tickets Report
        </Typography>
        <ComposedChart
            width={400}
            height={400}
            data={chartData}
            margin={{ top: 20, right: 0, left: -30, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={<CustomTick />} height={70} interval={0} />
            <YAxis orientation="left" yAxisId="left" domain={[0, 'dataMax + 50']} angle={-45} textAnchor="end" />
            <YAxis orientation="right" yAxisId="right" domain={[0, 100]} hide={true} />
            <Tooltip />
            <Legend verticalAlign="bottom" wrapperStyle={{ lineHeight: '40px', marginLeft: '25px' }} />
            <Bar yAxisId="left" dataKey="resolvedTickets" fill="#82ca9d" name="Resolved Tickets" />
            <Bar yAxisId="left" dataKey="totalTickets" fill="#8884d8" name="Total Tickets" />
            <Line
                yAxisId="right"
                type="monotone"
                dataKey="satisfaction"
                stroke="#ff7300"
                name="Cust Satisfaction"
                dot={({ cx, cy, payload, value }) => {
                    if (payload.name === 'Nov 1') {
                        return <circle cx={cx} cy={cy} r={8} fill="#ff7300" />;
                    }
                    return <circle cx={cx} cy={cy} r={4} fill="#ff7300" />;
                }}
            />
        </ComposedChart>
    </div>
  );
}

export default SupportTicketChart;
