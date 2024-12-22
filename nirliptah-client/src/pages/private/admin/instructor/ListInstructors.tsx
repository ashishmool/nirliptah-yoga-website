import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchInstructors, deleteInstructor } from "@/backend/services/instructorService.ts";
import Pagination from "../../../components/Pagination"; // Adjust the import path as needed

const ListInstructors: React.FC = () => {
    const [instructors, setInstructors] = useState<any[]>([]);
    const [filteredInstructors, setFilteredInstructors] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const ITEMS_PER_PAGE = 4;  // Fixed number of items per page

    useEffect(() => {
        // Fetch instructors on component mount
        fetchInstructors(setInstructors);
        fetchInstructors(setFilteredInstructors);
        // Assuming you might need to set the total pages as well
        setTotalPages(Math.ceil(instructors.length / ITEMS_PER_PAGE));
    }, []);

    useEffect(() => {
        // Recalculate total pages when filteredInstructors changes
        setTotalPages(Math.ceil(filteredInstructors.length / ITEMS_PER_PAGE));
    }, [filteredInstructors]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = instructors.filter((instructor) =>
            instructor.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredInstructors(filtered);
        setCurrentPage(1); // Reset to page 1 on search
    };

    const getPaginatedInstructors = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredInstructors.slice(startIndex, endIndex);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this instructor?")) {
            try {
                await deleteInstructor(id); // Use the service to delete the instructor
                // Update the state based on the delete action
                setInstructors((prev) => prev.filter((instructor) => instructor._id !== id));
                setFilteredInstructors((prev) => prev.filter((instructor) => instructor._id !== id));
                setTotalPages(Math.ceil(filteredInstructors.length / ITEMS_PER_PAGE)); // Recalculate total pages
            } catch (error) {
                console.error("Error deleting instructor:", error);
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center mb-6">Instructors</h1>

            <div className="flex justify-between mb-4">
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
                    className="p-2 w-full max-w-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {instructors.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Specialization</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rating</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {getPaginatedInstructors().map((instructor) => (
                        <tr key={instructor._id} className="border-b border-gray-200">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{instructor.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {instructor.specialization?.join(", ") || "No Specialization"}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{instructor.rating}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                <Link
                                    to={`/admin/instructors/update/${instructor._id}`}
                                    className="text-[#9B6763] hover:text-[#B8998C] mr-4"
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
                <p>No instructors found.</p>
            )}

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ListInstructors;
