import { Routes, Route, Navigate } from "react-router-dom";

// PAGES
import {
    Home,
    Error,
    Policies,
    AboutDetails,
    BrowseDetails, Contact,
} from "@/pages";
import AdminDashboard from "@/pages/private/admin/AdminDashboard.tsx";
import AddRetreat from "@/pages/private/admin/retreat/AddRetreat.tsx";
import AddAccommodation from "@/pages/private/admin/accommodation/AddAccommodation.tsx";
import AddInstructor from "@/pages/private/admin/instructor/AddInstructor.tsx";
import ListRetreats from "@/pages/private/admin/retreat/ListRetreats.tsx";
import UpdateRetreat from "@/pages/private/admin/retreat/UpdateRetreat.tsx";
import ListInstructors from "@/pages/private/admin/instructor/ListInstructors.tsx";
import UpdateInstructor from "@/pages/private/admin/instructor/UpdateInstructor.tsx";
import ListAccommodation from "@/pages/private/admin/accommodation/ListAccommodation.tsx";
import UpdateAccommodation from "@/pages/private/admin/accommodation/UpdateAccommodation.tsx";
import ListUsers from "@/pages/private/admin/user/ListUsers.tsx";
import AddUser from "@/pages/private/admin/user/AddUser.tsx";
import UpdateUser from "@/pages/private/admin/user/UpdateUser.tsx";
import ListWorkshops from "@/pages/private/admin/workshop/ListWorkshops.tsx";
import AddWorkshop from "@/pages/private/admin/workshop/AddWorkshop.tsx";
import UpdateWorkshop from "@/pages/private/admin/workshop/UpdateWorkshop.tsx";
import Reset from "@/components/reset/Reset.tsx";
import ResetPassword from "@/components/reset/ResetPassword.tsx";
import SingleWorkshop from "@/pages/public/workshop/SingleWorkshop.tsx";
import InstructorDashboard from "@/pages/private/instructor/InstructorDashboard.tsx";
import StudentDashboard from "@/pages/private/student/StudentDashboard.tsx";
import AdminHome from "@/pages/private/admin/AdminHome.tsx";



// Lazy Loading
// import {lazy} from "react";
// import {Suspense} from "react";


// const Home = lazy(()=> import("./core/public/Home"))
// const Login = lazy(()=> import("./core/public/Login"))

//Wrap with Suspense for Every Lazy Loading
//<Route index element={<Suspense> <Home /> </Suspense>} />

//errorElement

// const privateRoutes = [
//     {
//         path:"/admin",
//         element:
//             <Suspense>
//                 <AdminDashboard />
//             </Suspense>,
//         errorElement:<>Error</>,
//         children:[
//             {path: "/admin/retreats",
//             element:
//                 <Suspense>
//                     <ListRetreats />
//                 </Suspense>,
//                 errorElement:<>Error</>,
//              }
//         ]
//     }
// ]

// Instructor and Student Pages


// Helper functions for role-based access
const isAdmin = () => localStorage.getItem("role") === "admin";
const isInstructor = () => localStorage.getItem("role") === "instructor";
const isStudent = () => localStorage.getItem("role") === "student";

export default function Routing() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route index element={<Home />} />
            <Route path="*" element={<Error />} />
            <Route path="policies" element={<Policies />} />
            <Route path="about" element={<AboutDetails />} />
            <Route path="collections" element={<BrowseDetails />} />
            <Route path="reset" element={<Reset />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="workshops/:id" element={<SingleWorkshop />} />
            <Route path="contact" element={<Contact />} />

            {/* User Profile */}
            <Route path="user-profile" element={<UpdateUser />} />{/* User Profile */}


            {/* Admin Routes */}
            {isAdmin() ? (
                <Route path="admin" element={<AdminDashboard />}>

                    <Route path="home" element={<AdminHome />} />
                    {/* Retreat Routes */}
                    <Route path="retreats" element={<ListRetreats />} />
                    <Route path="retreats/add" element={<AddRetreat />} />
                    <Route path="retreats/update/:id" element={<UpdateRetreat />} />

                    {/* Accommodation Routes */}
                    <Route path="accommodations" element={<ListAccommodation />} />
                    <Route path="accommodations/add" element={<AddAccommodation />} />
                    <Route path="accommodations/update/:id" element={<UpdateAccommodation />} />

                    {/* Instructor Routes */}
                    <Route path="instructors" element={<ListInstructors />} />
                    <Route path="instructors/add" element={<AddInstructor />} />
                    <Route path="instructors/update/:id" element={<UpdateInstructor />} />

                    {/* Workshop Routes */}
                    <Route path="workshops" element={<ListWorkshops />} />
                    <Route path="workshops/add" element={<AddWorkshop />} />
                    <Route path="workshops/update/:id" element={<UpdateWorkshop />} />

                    {/* User Routes */}
                    <Route path="users" element={<ListUsers />} />
                    <Route path="users/add" element={<AddUser />} />
                    <Route path="users/update/:id" element={<UpdateUser />} />

                </Route>
            ) : (
                <Route path="admin/*" element={<Navigate to="/error" />} />
            )}

            {/* Instructor Routes */}
            {isInstructor() ? (
                <Route path="instructor" element={<InstructorDashboard />}>
                    {/* Add more instructor-specific routes here if needed */}
                </Route>
            ) : (
                <Route path="instructor/*" element={<Navigate to="/error" />} />
            )}

            {/* Student Routes */}
            {isStudent() ? (
                <Route path="student" element={<StudentDashboard />}>
                    {/* Add more student-specific routes here if needed */}
                </Route>
            ) : (
                <Route path="student/*" element={<Navigate to="/error" />} />
            )}
        </Routes>
    );
}
