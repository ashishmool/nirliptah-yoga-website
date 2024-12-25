import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";

const AdminHome = () => {
    // Example Data
    const barData = [
        { name: "Instructors", count: 25 },
        { name: "Workshops", count: 10 },
        { name: "Accommodations", count: 8 },
    ];

    const pieData = [
        { name: "Bookings", value: 400 },
        { name: "Registrations", value: 300 },
        { name: "Cancellations", value: 100 },
    ];

    const lineData = [
        { month: "Jan", users: 100, workshops: 20 },
        { month: "Feb", users: 200, workshops: 25 },
        { month: "Mar", users: 150, workshops: 30 },
        { month: "Apr", users: 250, workshops: 35 },
        { month: "May", users: 300, workshops: 40 },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center mb-6">Dashboard Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Bar Chart */}
                <div className="bg-white shadow-md rounded-md p-4">
                    <h3 className="text-lg font-semibold mb-4">Overview</h3>
                    <BarChart
                        width={400}
                        height={300}
                        data={barData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                </div>

                {/* Pie Chart */}
                <div className="bg-white shadow-md rounded-md p-4">
                    <h3 className="text-lg font-semibold mb-4">Activities</h3>
                    <PieChart width={300} height={300}>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>

                {/* Line Chart */}
                <div className="bg-white shadow-md rounded-md p-4">
                    <h3 className="text-lg font-semibold mb-4">Monthly Growth</h3>
                    <LineChart
                        width={400}
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
        </div>
    );
};

export default AdminHome;
