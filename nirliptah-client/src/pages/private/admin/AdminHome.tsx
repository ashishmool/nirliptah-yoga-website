import React, {useContext, useEffect, useState} from "react";
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
import WeeklyRoutine from "@/pages/components/WeeklyRoutine.tsx";
import {fetchUserById, fetchUserByRole} from "@/services/userService.ts";
import {toast} from "sonner";
import {AuthContext} from "@/context/AuthContext.tsx";


const AdminHome = () => {
    // // Example Data
    // const barData = [
    //     { role: "instructor", count: 25 },
    //     { role: "student", count: 10 },
    //     { role: "admin", },//nothing to show
    // ];
    //
    // const lineData = [
    //     { month: "Jan", users: 100, workshops: 20 },
    //     { month: "Feb", users: 200, workshops: 25 },
    //     { month: "Mar", users: 150, workshops: 30 },
    //     { month: "Apr", users: 250, workshops: 35 },
    //     { month: "May", users: 300, workshops: 40 },
    // ];
    // const { info, setInfo } = useContext(AuthContext);
    // const [userData, setUserData] = useState<any>(null);
    //
    //
    //
    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         if (info._id) {
    //             try {
    //                 const [user] = await Promise.all([fetchUserByRole(info._id)]);
    //                 setUserData(user);
    //             } catch (error) {
    //                 toast.error("Failed to fetch user data.");
    //             }
    //         }
    //     };
    //
    //     fetchUserData();
    // }, [info._id]);


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


            <div>
                <WeeklyRoutine/>
            </div>

        </div>
    );
};

export default AdminHome;
