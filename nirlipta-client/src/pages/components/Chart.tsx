import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
} from "recharts";

interface ChartProps {
    barData: { role: string; count?: number }[];
    lineData: { month: string; users: number; workshops: number }[];
}

const Chart: React.FC<ChartProps> = ({ barData, lineData }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="bg-white shadow-md rounded-md p-4">
                <h3 className="text-lg font-semibold mb-4">Overview</h3>
                <BarChart
                    width={350}
                    height={300}
                    data={barData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="role" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#9b6763" />
                </BarChart>
            </div>

            {/* Line Chart */}
            <div className="bg-white shadow-md rounded-md p-4">
                <h3 className="text-lg font-semibold mb-4">Monthly Growth</h3>
                <LineChart
                    width={350}
                    height={300}
                    data={lineData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="workshops" stroke="#82ca9d" />
                </LineChart>
            </div>
        </div>
    );
};

export default Chart;