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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
