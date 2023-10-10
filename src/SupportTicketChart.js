import React from 'react';
import { Typography, Paper } from '@mui/material';
import {
  ComposedChart, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  LabelList, Line
} from 'recharts';
import Box from '@mui/material/Box';

function SupportTicketChart() {
  const data = [
    { name: 'Mon', totalTickets: 100, resolvedTickets: 60, satisfaction: 75 },
    { name: 'Tue', totalTickets: 200, resolvedTickets: 150, satisfaction: 85 },
    { name: 'Wed', totalTickets: 150, resolvedTickets: 100, satisfaction: 80 },
    { name: 'Thu', totalTickets: 170, resolvedTickets: 90, satisfaction: 82 },
    { name: 'Fri', totalTickets: 250, resolvedTickets: 210, satisfaction: 88 },
    { name: 'Sat', totalTickets: 50, resolvedTickets: 30, satisfaction: 70 },
    { name: 'Sun', totalTickets: 70, resolvedTickets: 40, satisfaction: 78 },
  ];

  return (
    <div style={{ overflow: 'auto' }}>
        <Typography variant="h6" sx={{ textAlign: 'left' }}>
            Customer Support Tickets Report
        </Typography>
        <ComposedChart
            width={450}
            height={400}
            data={data}
            margin={{ top: 20, right: 0, left: -30, bottom: 5 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} interval={0} />
            <YAxis orientation="left" yAxisId="left" domain={[0, 'dataMax + 50']} angle={-45} textAnchor="end"/>
            <YAxis orientation="right" yAxisId="right" domain={[0, 100]} />
            <Tooltip />
            <Legend verticalAlign="bottom" wrapperStyle={{ lineHeight: '40px' }} />
            <Bar yAxisId="left" dataKey="resolvedTickets" fill="#82ca9d" name="Resolved Tickets" />
            <Bar yAxisId="left" dataKey="totalTickets" fill="#8884d8" name="Total Tickets" />
            <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#ff7300" name="Cust Satisfaction"/>
        </ComposedChart>
    </div>
);
}

export default SupportTicketChart;
