import React, { useState, useEffect } from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import { toast } from "sonner";
import Pagination from "../../../components/Pagination";
import { FaLayerGroup } from "react-icons/fa6"; // Adjust the import path as needed

const ListCategories: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const ITEMS_PER_PAGE = 4;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/workshop-categories");
                const data = response.data || [];
                setCategories(data);
                setFilteredCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    console.log("Categories::: ", filteredCategories);

    useEffect(() => {
        const filtered = categories.filter((category) =>
            Object.values(category)
                .join(" ")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
        setFilteredCategories(filtered);
        setCurrentPage(1);
    }, [searchQuery, categories]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleDelete = async (id: string) => {
        // Retrieve token from localStorage
        const token = localStorage.getItem("token");
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await axios.delete(`http://localhost:5000/api/workshop-categories/delete/${id}`, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`, // Include Bearer token
                    },
                });
                setCategories((prev) => prev.filter((category) => category._id !== id));
                setFilteredCategories((prev) =>
                    prev.filter((category) => category._id !== id)
                );
                toast.success("Category deleted successfully!");
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate(-1)} className="text-[#9B6763] hover:text-[#B8998C]">
                &#8592; Back
            </button>
            <h1 className="text-3xl font-semibold text-center mb-6">Categories</h1>
            </div>

            <div className="flex mb-4">
                {/* Left Container for Buttons */}
                <div className="flex-6 flex gap-4">
                    <Link
                        to="/admin/categories/add"
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
                        Add Category
                    </Link>
                </div>

                {/* Right Container for Search Input */}
                <div className="flex-2 ml-auto">
                    <input
                        type="text"
                        placeholder="Search categories"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="p-2 w-full max-w-xs border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {categories.length > 0 ? (
                <table className="flex-1 flex flex-col min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr className="flex w-full">
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Photo
                        </th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Name
                        </th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Description
                        </th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="flex flex-col">
                    {paginatedCategories.map((category) => (
                        <tr
                            key={category._id}
                            className="flex w-full border-b border-gray-200 items-center hover:bg-gray-50"
                        >
                            <td className="flex-1 px-4 py-2 text-sm font-medium text-gray-900">
                                <img
                                    src={category?.photo
                                        ? category?.photo.includes('/uploads/category_photos/')
                                            ? `http://localhost:5000${category?.photo}`
                                            : `http://localhost:5000/uploads/${category?.photo}`
                                        : "/default-avatar.png"
                                    }
                                    alt={category.title}
                                    className="w-16 h-16 object-cover rounded"
                                />
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm font-medium text-gray-900">
                                {category.name}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500">
                                {category.description}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500 flex space-x-2">
                                <Link
                                    to={`/admin/categories/update/${category._id}`}
                                    className="text-[#9B6763] hover:text-[#B8998C]"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(category._id)}
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
                <p className="text-gray-500">No categories found.</p>
            )}

            {/* Pagination */}
            {filteredCategories.length > 0 && (
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(filteredCategories.length / ITEMS_PER_PAGE)}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
};

export default ListCategories;
