import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ListRetreats: React.FC = () => {
    const [retreats, setRetreats] = useState<any[]>([]);
    const [filteredRetreats, setFilteredRetreats] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRetreats = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/retreats");
                setRetreats(response.data || []);
                setFilteredRetreats(response.data || []);
                setTotalPages(Math.ceil((response.data.length || 1) / 5));
            } catch (error) {
                console.error("Error fetching retreats:", error);
            }
        };

        fetchRetreats();
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = retreats.filter((retreat) =>
            Object.values(retreat)
                .join(" ")
                .toLowerCase()
                .includes(query.toLowerCase())
        );
        setFilteredRetreats(filtered);
        setCurrentPage(1);
        setTotalPages(Math.ceil(filtered.length / 5));
    };

    const getPaginatedRetreats = () => {
        const startIndex = (currentPage - 1) * 5;
        const endIndex = startIndex + 5;
        return filteredRetreats.slice(startIndex, endIndex);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this retreat?")) {
            try {
                await axios.delete(`http://localhost:5000/api/retreats/delete/${id}`);
                setRetreats((prev) => prev.filter((retreat) => retreat._id !== id));
                setFilteredRetreats((prev) => prev.filter((retreat) => retreat._id !== id));
                setTotalPages(Math.ceil(filteredRetreats.length / 5));
            } catch (error) {
                console.error("Error deleting retreat:", error);
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center mb-6">Retreats</h1>

            <div className="flex justify-between mb-4">
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
                    className="p-2 w-full max-w-xs border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Start Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">End Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Max Participants</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
                </thead>
                <tbody>
                {getPaginatedRetreats().map((retreat) => (
                    <tr key={retreat._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{retreat.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{retreat.description}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{retreat.start_date}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{retreat.end_date}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{retreat.price_per_person}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{retreat.max_participants}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                            <Link
                                to={`/admin/retreats/update/${retreat._id}`}
                                className="text-[#9B6763] hover:text-[#B8998C] mr-4"
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

export default ListRetreats;
