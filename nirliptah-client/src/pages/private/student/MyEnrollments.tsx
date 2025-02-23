import axios from "axios";
import Pagination from "@/pages/components/Pagination.tsx";
import React, { useEffect, useState } from "react";

export default function MyEnrollments() {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const ITEMS_PER_PAGE = 4;
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchUserEnrollments = async () => {
            if (!userId) {
                console.error("User ID not found in localStorage");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/enrollments/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
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
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-md z-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
                </div>
            )}

            <h1 className="text-3xl font-semibold text-center mb-6">My Enrollments</h1>

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
                            <td className="px-4 py-2 text-sm font-medium text-gray-900">
                                {enrollment.workshop_id?.title}
                            </td>
                            <td className="px-4 py-2 text-center text-sm text-gray-700">
                                {enrollment.completion_status === "completed" ? (
                                    <button
                                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 disabled:opacity-50"
                                        onClick={async () => {
                                            setIsLoading(true); // Show loading
                                            try {
                                                const response = await axios.get(
                                                    "http://localhost:5000/api/enrollments/certification",
                                                    {
                                                        headers: { Authorization: `Bearer ${token}` },
                                                    }
                                                );
                                                alert(response.data.message);
                                            } catch (error) {
                                                console.error("Error generating certificate:", error);
                                                alert("Failed to generate certificate.");
                                            }
                                            setIsLoading(false); // Hide loading
                                        }}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Generating..." : "Generate Certificate"}
                                    </button>
                                ) : (
                                    enrollment.completion_status
                                )}
                            </td>
                            <td className="px-4 py-2 text-center text-sm text-gray-700">
                                {enrollment.payment_status}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-red-800 text-center">You have not enrolled in any workshops yet.</p>
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

