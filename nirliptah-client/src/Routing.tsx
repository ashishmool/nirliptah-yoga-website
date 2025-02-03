import { Routes, Route, Navigate } from "react-router-dom";

// PAGES
import {
    Home,
    Error,
    Policies,
    AboutDetails,
    Contact,
} from "@/pages";
import AdminDashboard from "@/pages/private/admin/AdminDashboard.tsx";
import ListUsers from "@/pages/private/admin/user/ListUsers.tsx";
import AddUser from "@/pages/private/admin/user/AddUser.tsx";
import UpdateUser from "@/pages/private/admin/user/UpdateUser.tsx";
import ListWorkshops from "@/pages/private/admin/workshop/ListWorkshops.tsx";
import AddWorkshop from "@/pages/private/admin/workshop/AddWorkshop.tsx";
import UpdateWorkshop from "@/pages/private/admin/workshop/UpdateWorkshop.tsx";
import Reset from "@/pages/auth/Reset.tsx";
import ResetPassword from "@/pages/auth/ResetPassword.tsx";
import SingleWorkshop from "@/pages/public/workshop/SingleWorkshop.tsx";
import AdminHome from "@/pages/private/admin/AdminHome.tsx";
import Workshops from "@/pages/public/workshop/Workshops.tsx";
import ListSchedule from "@/pages/private/admin/schedule/ListSchedules.tsx";
import AddSchedule from "@/pages/private/admin/schedule/AddSchedule.tsx";

// Helper functions for role-based access
const isAdmin = () => localStorage.getItem("role") === "admin";
const isStudent = () => localStorage.getItem("role") === "student";

export default function Routing() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="*" element={<Error />} />
            <Route path="policies" element={<Policies />} />
            <Route path="about" element={<AboutDetails />} />
            <Route path="reset" element={<Reset />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="workshops/:id" element={<SingleWorkshop />} />
            <Route path="workshops/" element={<Workshops />} />
            <Route path="contact" element={<Contact />} />

            {/* Admin Routes */}
            {isAdmin() ? (
                <Route path="admin" element={<AdminDashboard />}>

                    <Route path="home" element={<AdminHome />} />

                    {/* Workshop Routes */}
                    <Route path="workshops" element={<ListWorkshops />} />
                    <Route path="workshops/add" element={<AddWorkshop />} />
                    <Route path="workshops/update/:id" element={<UpdateWorkshop />} />

                    {/* Schedule Routes */}
                    <Route path="schedules" element={<ListSchedule />} />
                    <Route path="schedules/add" element={<AddSchedule />} />

                    {/* User Routes */}
                    <Route path="users" element={<ListUsers />} />
                    <Route path="users/add" element={<AddUser />} />
                    <Route path="users/update/:id" element={<UpdateUser />} />

                </Route>
            ) : (
                <Route path="admin/*" element={<Navigate to="/error" />} />
            )}


            {/* Student Routes */}
            {isStudent() ? (
                <Route path="student" element={<Home />}>
                    {/* Add more student-specific routes here if needed */}
                </Route>
            ) : (
                <Route path="student/*" element={<Navigate to="/error" />} />
            )}
        </Routes>
    );
}
