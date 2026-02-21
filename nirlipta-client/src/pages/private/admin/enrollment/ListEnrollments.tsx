import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Pagination from "../../../components/Pagination";

const ListEnrollments: React.FC = () => {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [filteredEnrollments, setFilteredEnrollments] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 10;
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/enrollments");
                const data = response.data || [];
                setEnrollments(data.enrollments);
                setFilteredEnrollments(data.enrollments);
            } catch (error) {
                console.error("Error fetching enrollments:", error);
            }
        };
        fetchEnrollments();
    }, []);

    useEffect(() => {
        const filtered = enrollments.filter((enrollment) =>
            enrollment.user_id?.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredEnrollments(filtered);
        setCurrentPage(1);
    }, [searchQuery, enrollments]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this enrollment?")) {
            try {
                await axios.delete(`http://localhost:5000/api/enrollments/delete/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },});
                setEnrollments((prev) => prev.filter((enrollment) => enrollment._id !== id));
                setFilteredEnrollments((prev) =>
                    prev.filter((enrollment) => enrollment._id !== id)
                );
                toast.success("Enrollment deleted successfully!");
            } catch (error) {
                console.error("Error deleting enrollment:", error);
            }
        }
    };


    const handleStatusChange = async (id: string, field: string, newValue: string) => {
        if (window.confirm("Are you sure you want to chnage the status?")) {
            try {
                await axios.patch(`http://localhost:5000/api/enrollments/status/${id}`,
                    {[field]: newValue},
                    {headers: {Authorization: `Bearer ${token}`}}
                );

                setEnrollments(prev =>
                    prev.map(enrollment =>
                        enrollment._id === id ? {...enrollment, [field]: newValue} : enrollment
                    )
                );

                setFilteredEnrollments(prev =>
                    prev.map(enrollment =>
                        enrollment._id === id ? {...enrollment, [field]: newValue} : enrollment
                    )
                );

                toast.success(`${field.replace('_', ' ')} updated successfully!`);
            } catch (error) {
                console.error(`Error updating ${field}:`, error);
            }
        }
    };

    const paymentStatusOptions = ["pending", "paid", "failed"];
    const completionStatusOptions = ["not started", "in progress", "completed"];

    const completionStatusMap: Record<string, string> = {
        "not started": "Pending",
        "in progress": "Progressing",
        "completed": "Completed"
    };

    const paymentStatusMap: Record<string, string> = {
        "pending": "Pending",
        "paid": "Paid",
        "failed": "Failed"
    };



    const paginatedEnrollments = filteredEnrollments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col h-full">
            <h1 className="text-3xl font-semibold text-center mb-6">Enrollments</h1>

            <div className="flex mb-4">
                {/* Left Container for Buttons */}
                <div className="flex-6 flex gap-4">
                    <Link
                        to="/admin/enrollments/add"
                        className="inline-flex py-2 px-4 bg-[#9B6763] text-white rounded-md hover:bg-[#B8998C]"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add Enrollment
                    </Link>
                </div>

                {/* Right Container for Search Input */}
                <div className="flex-2 ml-auto">
                    <input
                        type="text"
                        placeholder="Search by Student Name"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="p-2 w-full max-w-xs border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {enrollments.length > 0 ? (
                <table className="w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr className="w-full">
                        <th className="w-[15%] px-4 py-2 text-left text-sm font-medium text-gray-500">Student Name</th>
                        <th className="w-[15%] px-4 py-2 text-left text-sm font-medium text-gray-500">Enrollment Date</th>
                        <th className="w-[20%] px-4 py-2 text-left text-sm font-medium text-gray-500">Workshop Title</th>
                        <th className="w-[20%] px-4 py-2 text-center text-sm font-medium text-gray-500">Enrollment Status</th>
                        <th className="w-[20%] px-4 py-2 text-center text-sm font-medium text-gray-500">Payment Status</th>
                        <th className="w-[10%] px-4 py-2 text-center text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedEnrollments.map((enrollment) => (
                        <tr key={enrollment._id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="w-[15%] px-4 py-2 text-sm font-medium text-gray-900">{enrollment.user_id?.name}</td>
                            <td className="w-[15%] px-4 py-2 text-sm text-gray-500">
                                {new Date(enrollment.enrollment_date).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </td>
                            <td className="w-[20%] px-4 py-2 text-sm font-medium text-gray-900">{enrollment.workshop_id?.title}</td>

                            {/* Enrollment Status */}
                            <td className="w-[20%] px-4 py-2 text-center">
                                <div className="flex justify-center gap-2">
                                    {completionStatusOptions.map((status) => (
                                        <span
                                            key={status}
                                            className={`badge cursor-pointer text-xs px-3 py-1 ${
                                                enrollment.completion_status === status ? "badge-primary" : "badge-outline"
                                            }`}
                                            onClick={() => handleStatusChange(enrollment._id, "completion_status", status)}
                                        >
                {completionStatusMap[status]}
            </span>
                                    ))}
                                </div>
                            </td>


                            {/* Payment Status */}
                            <td className="w-[20%] px-4 py-2 text-center">
                                <div className="flex justify-center gap-2">
                                    {paymentStatusOptions.map((status) => (
                                        <span
                                            key={status}
                                            className={`badge cursor-pointer text-xs px-3 py-1 ${
                                                enrollment.payment_status === status ? "badge-secondary" : "badge-outline"
                                            }`}
                                            onClick={() => handleStatusChange(enrollment._id, "payment_status", status)}
                                        >
                {paymentStatusMap[status]}
            </span>
                                    ))}
                                </div>
                            </td>


                            {/* Actions */}
                            <td className="w-[10%] px-4 py-2 text-sm text-gray-500 flex justify-center space-x-2">
                                <Link
                                    to={`/admin/enrollments/update/${enrollment._id}`}
                                    className="text-[#9B6763] hover:text-[#B8998C]"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(enrollment._id)}
                                    className="text-[#B8978C] hover:text-[#A38F85]"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            ) : (
                <p className="text-gray-500">No enrollments found.</p>
            )}

            {/* Pagination */}
            {filteredEnrollments.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredEnrollments.length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default ListEnrollments;