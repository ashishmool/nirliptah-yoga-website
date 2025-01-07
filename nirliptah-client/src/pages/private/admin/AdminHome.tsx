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

const AdminHome = () => {
    // Example Data
    const barData = [
        { name: "Instructors", count: 25 },
        { name: "Workshops", count: 10 },
        { name: "Accommodations", count: 8 },
    ];

    const lineData = [
        { month: "Jan", users: 100, workshops: 20 },
        { month: "Feb", users: 200, workshops: 25 },
        { month: "Mar", users: 150, workshops: 30 },
        { month: "Apr", users: 250, workshops: 35 },
        { month: "May", users: 300, workshops: 40 },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center mb-6">Dashboard Analytics</h1>

            {/* Stats Section */}
            <div className="stats shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block h-8 w-8 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            ></path>
                        </svg>
                    </div>
                    <div className="stat-title">Total Instructors</div>
                    <div className="stat-value text-primary">25</div>
                    <div className="stat-desc">5 new this month</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block h-8 w-8 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            ></path>
                        </svg>
                    </div>
                    <div className="stat-title">Total Workshops</div>
                    <div className="stat-value text-secondary">10</div>
                    <div className="stat-desc">2 new this month</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <div className="avatar online">
                            <div className="w-16 rounded-full">
                                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Task Progress" />
                            </div>
                        </div>
                    </div>
                    <div className="stat-value">86%</div>
                    <div className="stat-title">Tasks Completed</div>
                    <div className="stat-desc text-secondary">31 tasks remaining</div>
                </div>
            </div>

            {/* Charts Section */}
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
                        <XAxis dataKey="name" />
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
        </div>
    );
};

export default AdminHome;
