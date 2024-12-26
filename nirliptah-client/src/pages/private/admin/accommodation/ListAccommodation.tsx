import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Pagination from "../../../components/Pagination"; // Adjust the import path as needed

const ListAccommodation: React.FC = () => {
    const [accommodations, setAccommodations] = useState<any[]>([]);
    const [filteredAccommodations, setFilteredAccommodations] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 4;

    useEffect(() => {
        const fetchAccommodations = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/accommodations");
                const data = response.data || [];
                setAccommodations(data);
                setFilteredAccommodations(data);
            } catch (error) {
                console.error("Error fetching accommodations:", error);
            }
        };
        fetchAccommodations();
    }, []);

    useEffect(() => {
        const filtered = accommodations.filter((accommodation) =>
            Object.values(accommodation)
                .join(" ")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
        setFilteredAccommodations(filtered);
        setCurrentPage(1);
    }, [searchQuery, accommodations]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this accommodation?")) {
            try {
                await axios.delete(`http://localhost:5000/api/accommodations/delete/${id}`);
                setAccommodations((prev) => prev.filter((acc) => acc._id !== id));
                setFilteredAccommodations((prev) =>
                    prev.filter((acc) => acc._id !== id)
                );
                toast.success("Accommodation deleted successfully!");
            } catch (error) {
                console.error("Error deleting accommodation:", error);
            }
        }
    };

    const paginatedAccommodations = filteredAccommodations.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col h-full">
            <h1 className="text-3xl font-semibold text-center mb-6">Accommodations</h1>

            <div className="flex justify-between items-center mb-4">
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
                    className="p-2 w-full max-w-xs border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {accommodations.length > 0 ? (
                <table className="flex-1 flex flex-col min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr className="flex w-full">
                        <th className="flex-1 px-4 py-2 text-center text-sm font-medium text-gray-500">
                            Image
                        </th>
                        <th className="flex-1 px-4 py-2 text-center text-sm font-medium text-gray-500">
                            Name
                        </th>
                        <th className="flex-1 px-4 py-2 text-center text-sm font-medium text-gray-500">
                            Location
                        </th>
                        <th className="flex-1 px-4 py-2 text-center text-sm font-medium text-gray-500">
                            Price per Night
                        </th>
                        <th className="flex-1 px-4 py-2 text-center text-sm font-medium text-gray-500">
                            Rooms
                        </th>
                        <th className="flex-1 px-4 py-2 text-center text-sm font-medium text-gray-500">
                            Room Capacity
                        </th>
                        <th className="flex-1 px-4 py-2 text-center text-sm font-medium text-gray-500">
                            Total Capacity
                        </th>
                        <th className="flex-1 px-4 py-2 text-center text-sm font-medium text-gray-500">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="flex flex-col">
                    {paginatedAccommodations.map((acc) => (
                        <tr
                            key={acc._id}
                            className="flex w-full border-b border-gray-200 items-center hover:bg-gray-50"
                        >
                            <td className="flex-1 px-4 py-2 text-center">
                                <img
                                    src={`http://localhost:5000${acc.photo}`}
                                    alt={acc.name}
                                    className="w-16 h-16 object-cover rounded mx-auto"
                                />
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 text-center">
                                {acc.name}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500 text-center">
                                {acc.location}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500 text-center">
                                {acc.price_per_night}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500 text-center">
                                {acc.available_rooms}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500 text-center">
                                {acc.max_occupancy}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500 text-center">
                                {acc.available_rooms * acc.max_occupancy}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500 text-center flex justify-center space-x-2">
                                <Link
                                    to={`/admin/accommodations/update/${acc._id}`}
                                    className="text-[#9B6763] hover:text-[#B8998C]"
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
            ) : (
                <p className="text-gray-500">No accommodations found.</p>
            )}

            {/* Pagination */}
            {filteredAccommodations.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredAccommodations.length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default ListAccommodation;
