import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { fetchAccommodations, deleteAccommodation } from "@/backend/services/accommodationService.ts";
import Pagination from "../../../components/Pagination";

const ListAccommodation: React.FC = () => {
    const [accommodations, setAccommodations] = useState<any[]>([]);
    const [filteredAccommodations, setFilteredAccommodations] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const ITEMS_PER_PAGE = 3;  // Fixed number of items per page

    useEffect(() => {
        // Fetch accommodations on component mount
        fetchAccommodations(setAccommodations);
        fetchAccommodations(setFilteredAccommodations);
        // Assuming you might need to set the total pages as well
        setTotalPages(Math.ceil(accommodations.length / ITEMS_PER_PAGE));
    }, []);

    useEffect(() => {
        // Recalculate total pages when filteredAccommodations changes
        setTotalPages(Math.ceil(filteredAccommodations.length / ITEMS_PER_PAGE));
    }, [filteredAccommodations]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = accommodations.filter((acc) =>
            Object.values(acc)
                .join(" ")
                .toLowerCase()
                .includes(query.toLowerCase())
        );
        setFilteredAccommodations(filtered);
        setCurrentPage(1); // Reset to page 1 on search
    };

    const getPaginatedAccommodations = () => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return filteredAccommodations.slice(startIndex, endIndex);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this accommodation?")) {
            try {
                await deleteAccommodation(id); // Use the service to delete the accommodation
                toast.success("Accommodation Deleted Successfully!")
                // Update the state based on the delete action
                setAccommodations((prev) => prev.filter((acc) => acc._id !== id));
                setFilteredAccommodations((prev) => prev.filter((acc) => acc._id !== id));
                setTotalPages(Math.ceil(filteredAccommodations.length / ITEMS_PER_PAGE)); // Recalculate total pages
            } catch (error) {
                toast.error("Accommodation Delete Failed!")
                console.error("Error deleting accommodation:", error);
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center mb-6">Accommodations</h1>

            <div className="flex justify-between mb-4">
                <Link
                    to="/admin/accommodations/add"
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
                    Add Accommodation
                </Link>
                <input
                    type="text"
                    placeholder="Search accommodations"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="p-2 w-full max-w-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Image</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Available Rooms</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
                </thead>
                <tbody>
                {getPaginatedAccommodations().map((acc) => (
                    <tr key={acc._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            <img
                                src={`http://localhost:5000${acc.photo}`}  // Adjust the path to match where the images are served
                                alt={acc.name}
                                className="w-16 h-16 object-cover rounded"  // Thumbnail styling
                            />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{acc.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{acc.location}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{acc.price_per_night}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{acc.available_rooms}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                            <Link
                                to={`/admin/accommodations/update/${acc._id}`}
                                className="text-[#9B6763] hover:text-[#B8998C] mr-4"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(acc._id)}
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
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ListAccommodation;
