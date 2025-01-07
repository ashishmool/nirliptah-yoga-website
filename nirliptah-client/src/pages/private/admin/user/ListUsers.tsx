import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMale, FaFemale, FaTransgenderAlt } from "react-icons/fa";
import axios from "axios";
import Pagination from "../../../components/Pagination"; // Adjust the import path as needed
import { toast } from "sonner"; // For toast notifications

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
            toast.success("User deleted successfully.");
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            const payload = { role: newRole }; // Only send the updated role
            await axios.patch(`http://localhost:5000/api/users/patch/${userId}`, payload);
            setUsers(
                users.map((user) =>
                    user._id === userId ? { ...user, role: newRole } : user
                )
            );
            toast.success(`User role updated to ${newRole}`);
        } catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update user role.");
        }
    };


    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col">
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
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                        <tr>
                            <th>Profile</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedUsers.map((user) => (
                            <tr key={user._id}>
                                {/* Profile */}
                                <td>
                                    <div className="avatar">
                                        <div className="mask mask-squircle w-12 h-12">
                                            <img
                                                src={`http://localhost:5000${user.photo}`}
                                                alt={`${user.name || "User"}'s avatar`}
                                            />
                                        </div>
                                    </div>
                                </td>

                                {/* Email */}
                                <td>{user.email}</td>

                                {/* Name */}
                                <td>{user.name || "N/A"}</td>

                                {/* Gender */}
                                <td className="flex items-center gap-2">
                                    {user.gender === "male" && (
                                        <>
                                            <FaMale className="text-blue-500" />
                                            <span>Male</span>
                                        </>
                                    )}
                                    {user.gender === "female" && (
                                        <>
                                            <FaFemale className="text-pink-500" />
                                            <span>Female</span>
                                        </>
                                    )}
                                    {user.gender === "other" && (
                                        <>
                                            <FaTransgenderAlt className="text-purple-500" />
                                            <span>Other</span>
                                        </>
                                    )}
                                    {!user.gender && (
                                        <>
                                            <span className="text-gray-500">N/A</span>
                                        </>
                                    )}
                                </td>

                                {/* Role */}
                                <td>
                                    <span className="badge badge-ghost badge-sm">{user.role}</span>
                                </td>

                                {/* Actions */}
                                <td>
                                    <Link
                                        to={`/admin/users/update/${user._id}`}
                                        className="btn btn-xs btn-ghost"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(user._id)}
                                        className="btn btn-xs btn-error mr-2"
                                    >
                                        Delete
                                    </button>
                                    {user.role === "student" && (
                                        <button
                                            onClick={() => handleRoleChange(user._id, "instructor")}
                                            className="btn btn-xs btn-info mr-2"
                                        >
                                            Make Instructor
                                        </button>
                                    )}
                                    {user.role === "instructor" && (
                                        <button
                                            onClick={() => handleRoleChange(user._id, "student")}
                                            className="btn btn-xs btn-warning mr-2"
                                        >
                                            Make Student
                                        </button>
                                    )}
                                </td>

                            </tr>
                        ))}
                        </tbody>
                        <tfoot>
                        <tr>
                            <th>Profile</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Gender</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </tfoot>
                    </table>

                </div>
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
