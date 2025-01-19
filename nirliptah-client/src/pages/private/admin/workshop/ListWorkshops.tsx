import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Pagination from "../../../components/Pagination"; // Adjust the import path as needed

const ListWorkshops: React.FC = () => {
    const [workshops, setWorkshops] = useState<any[]>([]);
    const [filteredWorkshops, setFilteredWorkshops] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 4;

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/workshops");
                const data = response.data || [];
                setWorkshops(data);
                setFilteredWorkshops(data);
            } catch (error) {
                console.error("Error fetching workshops:", error);
            }
        };
        fetchWorkshops();
    }, []);

    console.log("Workshops::: ", filteredWorkshops);

    useEffect(() => {
        const filtered = workshops.filter((workshop) =>
            Object.values(workshop)
                .join(" ")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
        setFilteredWorkshops(filtered);
        setCurrentPage(1);
    }, [searchQuery, workshops]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this workshop?")) {
            try {
                await axios.delete(`http://localhost:5000/api/workshops/delete/${id}`);
                setWorkshops((prev) => prev.filter((workshop) => workshop._id !== id));
                setFilteredWorkshops((prev) =>
                    prev.filter((workshop) => workshop._id !== id)
                );
                toast.success("Workshop deleted successfully!");
            } catch (error) {
                console.error("Error deleting workshop:", error);
            }
        }
    };

    const paginatedWorkshops = filteredWorkshops.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col h-full">
            <h1 className="text-3xl font-semibold text-center mb-6">Workshops</h1>

            <div className="flex mb-4">
                {/* Left Container for Buttons */}
                <div className="flex-6 flex gap-4">
                    <Link
                        to="/admin/workshops/add"
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
                        Add Workshop
                    </Link>
                    <Link
                        to="/admin/schedules/add"
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
                        Add Schedule
                    </Link>
                </div>

                {/* Right Container for Search Input */}
                <div className="flex-2 ml-auto">
                    <input
                        type="text"
                        placeholder="Search workshops"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="p-2 w-full max-w-xs border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>



            {workshops.length > 0 ? (
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
                            Price
                        </th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Discounted Price
                        </th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="flex flex-col">
                    {paginatedWorkshops.map((workshop) => (
                        <tr
                            key={workshop._id}
                            className="flex w-full border-b border-gray-200 items-center hover:bg-gray-50"
                        >
                            <td className="flex-1 px-4 py-2 text-sm font-medium text-gray-900">
                                <img
                                    src={`http://localhost:5000${workshop.photo}`}
                                    alt={workshop.title}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm font-medium text-gray-900">
                                {workshop.title}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500">
                                {workshop.price}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500">
                                {workshop.discount_price && workshop.discount_price !== 0
                                    ? workshop.discount_price
                                    : "No Discount"}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500 flex space-x-2">
                                <Link
                                    to={`/admin/workshops/update/${workshop._id}`}
                                    className="text-[#9B6763] hover:text-[#B8998C]"
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
            ) : (
                <p className="text-gray-500">No workshops found.</p>
            )}

            {/* Pagination */}
            {filteredWorkshops.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredWorkshops.length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}

        </div>
    );
};

export default ListWorkshops;
