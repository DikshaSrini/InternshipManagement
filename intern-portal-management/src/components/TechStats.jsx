import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip } from 'recharts';
import { CSVLink } from 'react-csv';
import { jsPDF } from 'jspdf';

const TechStats = ({ interns }) => {
  // Check if interns is undefined or null and initialize as empty array if necessary
  if (!interns || interns.length === 0) {
    return <p>No intern data available.</p>;
  }

  // Aggregating the tech stack data with intern names
  const aggregatedData = {};

  interns.forEach((intern) => {
    if (intern.preferences) {
      intern.preferences.forEach((tech) => {
        if (aggregatedData[tech]) {
          aggregatedData[tech].count += 1;
          aggregatedData[tech].interns.push(intern.name);
        } else {
          aggregatedData[tech] = { count: 1, interns: [intern.name] };
        }
      });
    }
  });

  const totalVotes = Object.values(aggregatedData).reduce((acc, data) => acc + data.count, 0);

  const chartData = Object.keys(aggregatedData).map((tech) => ({
    name: tech,
    value: aggregatedData[tech].count,
    percentage: ((aggregatedData[tech].count / totalVotes) * 100).toFixed(2),
    interns: aggregatedData[tech].interns.join(', '),  // List of interns who voted for this tech
  }));

  const COLORS = ["#ff8c00", "#8b0000", "#228b22", "#20b2aa", "#6495ed", "#ff1493", "#ff6347", "#8a2be2", "#ff4500", "#2e8b57"];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Tech Stack Poll Results', 20, 20);
    let yOffset = 30;
    chartData.forEach((data) => {
      doc.text(`${data.name}: ${data.value} votes (${data.percentage}%) - Voted by: ${data.interns}`, 20, yOffset);
      yOffset += 10;
    });
    doc.save('tech_stack_results.pdf');
  };

  return (
    <div>
      <h2>Tech Stack Popularity</h2>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="value" fill="#8884d8" />
          <BarTooltip />
        </BarChart>
      </ResponsiveContainer>

      {/* CSV Export Button */}
      <CSVLink data={chartData} filename={"tech_stack_results.csv"}>
        <button>Export CSV</button>
      </CSVLink>

      {/* PDF Export Button */}
      <button onClick={handleExportPDF}>Export PDF</button>

      {/* List of aggregated data */}
      <ul>
        {chartData.map((data) => (
          <li key={data.name}>
            {data.name}: {data.value} votes ({data.percentage}%) - Voted by: {data.interns}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TechStats;
