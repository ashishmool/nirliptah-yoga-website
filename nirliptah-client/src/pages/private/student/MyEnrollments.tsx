import axios from "axios";
import Pagination from "@/pages/components/Pagination.tsx";
import {useEffect, useState} from "react";

export default function MyEnrollments() {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUserEnrollments = async () => {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                console.error("User ID not found in localStorage");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/enrollments/user/${userId}`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                setEnrollments(response.data || []);
                console.log("Fetched Enrollments for user::", userId, "and enrollments:::", response.data);
            } catch (error) {
                console.error("Error fetching user enrollments:", error);
            }
        };
        fetchUserEnrollments();
    }, []);


    const paginatedEnrollments = enrollments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-5xl mx-auto p-6 mt-24">
            <h1 className="text-2xl font-semibold text-center mb-6">My Enrollments</h1>

            {enrollments.length > 0 ? (
                <table className="w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Enrollment Date</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Workshop</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Status</th>
                        <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Payment</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedEnrollments.map((enrollment) => (
                        <tr key={enrollment._id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-500">
                                {new Date(enrollment.enrollment_date).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </td>
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">{enrollment.workshop_id?.title}</td>
                            <td className="px-4 py-2 text-center text-sm text-gray-700">{enrollment.completion_status}</td>
                            <td className="px-4 py-2 text-center text-sm text-gray-700">{enrollment.payment_status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500 text-center">You have no enrollments yet.</p>
            )}

            {enrollments.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(enrollments.length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}
