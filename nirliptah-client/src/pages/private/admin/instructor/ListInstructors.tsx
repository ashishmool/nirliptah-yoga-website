import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchInstructors, deleteInstructor } from "@/backend/services/instructorService";
import Pagination from "../../../components/Pagination"; // Adjust the import path as needed

const ListInstructors: React.FC = () => {
    const [instructors, setInstructors] = useState<any[]>([]);
    const [filteredInstructors, setFilteredInstructors] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        fetchInstructors(setInstructors);
    }, []);

    useEffect(() => {
        const filtered = instructors.filter((instructor) =>
            instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredInstructors(filtered);
    }, [instructors, searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to page 1 on search
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this instructor?")) {
            await deleteInstructor(id);
            setInstructors((prev) => prev.filter((instructor) => instructor._id !== id));
        }
    };

    const paginatedInstructors = filteredInstructors.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col h-full">
            <h1 className="text-3xl font-semibold text-center mb-6">Instructors</h1>

            <div className="flex justify-between items-center mb-4">
                <Link
                    to="/admin/instructors/add"
                    className="inline-flex items-center py-2 px-4 bg-[#9B6763] text-white rounded-md hover:bg-[#B8998C]"
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
                    Add Instructor
                </Link>
                <input
                    type="text"
                    placeholder="Search instructors"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="p-2 w-full max-w-xs border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
            </div>


            {instructors.length > 0 ? (
                <table className="flex-1 flex flex-col min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr className="flex w-full">
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">Specialization</th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">Rating</th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="flex flex-col">
                    {paginatedInstructors.map((instructor) => (
                        <tr
                            key={instructor._id}
                            className="flex w-full border-b border-gray-200 items-center hover:bg-gray-50"
                        >
                            <td className="flex-1 px-4 py-2 text-sm font-medium text-gray-900">{instructor.name}</td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500">
                                {instructor.specialization?.join(", ") || "No Specialization"}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500">{instructor.rating}</td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500 flex space-x-2">
                                <Link
                                    to={`/admin/instructors/update/${instructor._id}`}
                                    className="text-[#9B6763] hover:text-[#B8998C]"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(instructor._id)}
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
                <p className="text-gray-500">No instructors found.</p>
            )}

            {/* Pagination */}
            <div className="mt-4">
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredInstructors.length / ITEMS_PER_PAGE)}
                onPageChange={setCurrentPage}
            />
            </div>
        </div>
    );
};

export default ListInstructors;
