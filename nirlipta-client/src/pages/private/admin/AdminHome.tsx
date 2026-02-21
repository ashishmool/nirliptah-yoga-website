import React, {useEffect, useState} from "react";
import WeeklyRoutine from "@/pages/components/WeeklyRoutine.tsx";
import {fetchUserCount} from "@/services/userService.ts";
import {toast} from "sonner";
import {AuthContext} from "@/context/AuthContext.tsx";
import {fetchWorkshopCategories, fetchWorkshops} from "@/services/workshopService.ts";
import {FaBookBookmark, FaGraduationCap, FaUserClock, FaUserGraduate} from "react-icons/fa6";


const AdminHome = () => {

    const [workshops, setWorkshops] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        fetchUserCount(setUsers);
        fetchWorkshopCategories(setCategories);
        fetchWorkshops(setWorkshops);
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center mb-6">Dashboard Analytics</h1>

            {/* Stats Section */}
            <div className="stats shadow mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat rounded-lg p-4">
                    <div className="stat-figure text-gray-300">
                        <FaUserGraduate className="inline-block h-8 w-8" />
                    </div>
                    <div className="stat-title text-center text-[#9B6763]">Total Students</div>
                    <div className="stat-value text-primary text-center">{users?.studentCount}</div>
                    <div className="stat-desc text-center">Enrolled</div>
                </div>

                <div className="stat p-4">
                    <div className="stat-figure text-gray-300">
                        <FaBookBookmark className="inline-block h-8 w-8" />
                    </div>
                    <div className="stat-title text-center text-[#9B6763]">Total Workshops</div>
                    <div className="stat-value text-primary text-center">{workshops.length}</div>
                    <div className="stat-desc text-center">in all categories</div>
                </div>

                <div className="stat rounded-lg p-4">
                    <div className="stat-figure text-gray-300">
                        <FaGraduationCap className="inline-block h-8 w-8" />
                    </div>
                    <div className="stat-title text-center text-[#9B6763]">Categories</div>
                    <div className="stat-value text-primary text-center">{categories.length}</div>
                    <div className="stat-desc text-center">for Workshop</div>
                </div>
            </div>

            <div>
                <WeeklyRoutine />
            </div>
        </div>
    );
};

export default AdminHome;
