import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Pagination from "../../../components/Pagination"; // Adjust the import path as needed

const ListRetreats: React.FC = () => {
    const [retreats, setRetreats] = useState<any[]>([]);
    const [filteredRetreats, setFilteredRetreats] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 2;

    useEffect(() => {
        const fetchRetreats = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/retreats");
                const data = response.data || [];
                setRetreats(data);
                setFilteredRetreats(data);
            } catch (error) {
                console.error("Error fetching retreats:", error);
            }
        };
        fetchRetreats();
    }, []);

    useEffect(() => {
        const filtered = retreats.filter((retreat) =>
            Object.values(retreat)
                .join(" ")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
        setFilteredRetreats(filtered);
        setCurrentPage(1);
    }, [searchQuery, retreats]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this retreat?")) {
            try {
                await axios.delete(`http://localhost:5000/api/retreats/delete/${id}`);
                setRetreats((prev) => prev.filter((retreat) => retreat._id !== id));
                setFilteredRetreats((prev) =>
                    prev.filter((retreat) => retreat._id !== id)
                );
                toast.success("Retreat deleted successfully!");
            } catch (error) {
                console.error("Error deleting retreat:", error);
                toast.error("Failed to delete retreat.");
            }
        }
    };

    const paginatedRetreats = filteredRetreats.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col h-full">
            <h1 className="text-3xl font-semibold text-center mb-6">Retreats</h1>

            <div className="flex justify-between items-center mb-4">
                <Link
                    to="/admin/retreats/add"
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
                    Add Retreat
                </Link>
                <input
                    type="text"
                    placeholder="Search retreats"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="p-2 w-full max-w-xs border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {retreats.length > 0 ? (
                <table className="flex-1 flex flex-col min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr className="flex w-full">
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Image
                        </th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Title
                        </th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Dates
                        </th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Price
                        </th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="flex flex-col">
                    {paginatedRetreats.map((retreat) => (
                        <tr
                            key={retreat._id}
                            className="flex w-full border-b border-gray-200 items-center hover:bg-gray-50"
                        >
                            <td className="flex-1 px-4 py-2 text-sm font-medium text-gray-900">
                                <img
                                    src={`http://localhost:5000${retreat.retreat_photo}`}
                                    alt={retreat.title}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm font-medium text-gray-900">
                                {retreat.title}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500">
                                {new Date(retreat.start_date).toLocaleDateString()} -{" "}
                                {new Date(retreat.end_date).toLocaleDateString()}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500">
                                {retreat.price_per_person}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500 flex space-x-2">
                                <Link
                                    to={`/admin/retreats/update/${retreat._id}`}
                                    className="text-[#9B6763] hover:text-[#B8998C]"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(retreat._id)}
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
                <p className="text-gray-500">No retreats found.</p>
            )}

            {/* Pagination */}
            {filteredRetreats.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredRetreats.length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

        </div>
    );
};

export default ListRetreats;
