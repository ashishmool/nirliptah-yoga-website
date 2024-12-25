import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMale, FaFemale, FaTransgenderAlt } from "react-icons/fa";
import axios from "axios";
import Pagination from "../../../components/Pagination"; // Adjust the import path as needed

const ListUsers: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/users");
                setUsers(response.data);
                setFilteredUsers(response.data);
                console.log("Fetched Users Data::: ", response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
                alert("Error loading users.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter((user) =>
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [users, searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to page 1 on search
    };

    const handleDelete = async (userId: string) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/users/delete/${userId}`);
            setUsers(users.filter((user) => user._id !== userId));
            alert("User deleted successfully.");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col h-full">
            <h1 className="text-3xl font-semibold text-center mb-6">Users</h1>

            <div className="flex justify-between items-center mb-4">
                <Link
                    to="/admin/users/add"
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
                    Add User
                </Link>
                <input
                    type="text"
                    placeholder="Search users"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="p-2 w-full max-w-xs border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading users...</p>
            ) : filteredUsers.length > 0 ? (
                <table className="flex-1 flex flex-col min-w-full bg-white border border-gray-300">
                    <thead className="bg-gray-100">
                    <tr className="flex w-full">
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500 text-center">Gender</th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">Role</th>
                        <th className="flex-1 px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="flex flex-col">
                    {paginatedUsers.map((user) => (
                        <tr
                            key={user._id}
                            className="flex w-full border-b border-gray-200 items-center hover:bg-gray-50"
                        >
                            <td className="flex-1 px-4 py-2 text-sm font-medium text-gray-900 text-center">
                                {user.gender === "male" && <FaMale className="inline-block mr-2" />}
                                {user.gender === "female" && <FaFemale className="inline-block mr-2" />}
                                {user.gender === "other" && <FaTransgenderAlt className="inline-block mr-2" />}
                            </td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500">{user.email}</td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500">{user.role}</td>
                            <td className="flex-1 px-4 py-2 text-sm text-gray-500 flex space-x-2">
                                <Link
                                    to={`/admin/users/update/${user._id}`}
                                    className="text-[#9B6763] hover:text-[#B8998C]"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(user._id)}
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
                <p className="text-center text-gray-500">No users found.</p>
            )}

            {/* Pagination */}
            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default ListUsers;
