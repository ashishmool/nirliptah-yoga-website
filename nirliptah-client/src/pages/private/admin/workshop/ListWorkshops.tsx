import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const ListWorkshops: React.FC = () => {
    const [workshops, setWorkshops] = useState<any[]>([]);
    const [filteredWorkshops, setFilteredWorkshops] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const ITEMS_PER_PAGE = 4; // Fixed number of items per page

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/workshops");
                const data = response.data || [];
                setWorkshops(data);
                setFilteredWorkshops(data);
                setTotalPages(Math.ceil(data.length / ITEMS_PER_PAGE)); // Recalculate total pages based on 4 items per page
            } catch (error) {
                console.error("Error fetching workshops:", error);
            }
        };

        fetchWorkshops();
    }, []); // Fetch only once on mount

    useEffect(() => {
        // Recalculate total pages when filteredWorkshops changes
        setTotalPages(Math.ceil(filteredWorkshops.length / ITEMS_PER_PAGE));
    }, [filteredWorkshops]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = workshops.filter((workshop) =>
            Object.values(workshop)
                .join(" ")
                .toLowerCase()
                .includes(query.toLowerCase())
        );
        setFilteredWorkshops(filtered);
        setCurrentPage(1); // Reset to page 1 on search
    };

    const getPaginatedWorkshops = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredWorkshops.slice(startIndex, endIndex);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this workshop?")) {
            try {
                await axios.delete(`http://localhost:5000/api/workshops/delete/${id}`);
                setWorkshops((prev) => prev.filter((workshop) => workshop._id !== id));
                setFilteredWorkshops((prev) => prev.filter((workshop) => workshop._id !== id));
                setTotalPages(Math.ceil(filteredWorkshops.length / ITEMS_PER_PAGE)); // Recalculate total pages
                toast.success("Workshop deleted successfully!");
            } catch (error) {
                console.error("Error deleting workshop:", error);
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center mb-6">Workshops</h1>

            <div className="flex justify-between mb-4">
                <Link
                    to="/admin/workshops/add"
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
                    Add Workshop
                </Link>
                <input
                    type="text"
                    placeholder="Search workshops"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="p-2 w-full max-w-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Image</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Instructor</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Discounted Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
                </thead>
                <tbody>
                {getPaginatedWorkshops().map((workshop) => (
                    <tr key={workshop._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            <img
                                src={`http://localhost:5000${workshop.photo}`}
                                alt={workshop.title}
                                className="w-16 h-16 object-cover rounded"
                            />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{workshop.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{workshop.instructor_id?.name || 'No Instructor'}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{workshop.price}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                            {workshop.discount_price && workshop.discount_price !== 0 ? (
                                workshop.discount_price
                            ) : (
                                "No Discount"
                            )}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-500">
                            <Link
                                to={`/admin/workshops/update/${workshop._id}`}
                                className="text-[#9B6763] hover:text-[#B8998C] mr-4"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(workshop._id)}
                                className="text-[#B8978C] hover:text-[#A38F85]"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md mr-2 disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md ml-2 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ListWorkshops;
