import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchInstructors, deleteInstructor } from "@/backend/services/instructorService";
import DataTable from "../../../../shared/dataTable/dataTable";

const ListInstructors: React.FC = () => {
    const [instructors, setInstructors] = useState<unknown[]>([]);
    const [filteredInstructors, setFilteredInstructors] = useState<unknown[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchInstructors();
                setInstructors(data || []); // Fallback to empty array
                setFilteredInstructors(data || []);
            } catch (error) {
                console.error("Error fetching instructors:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = instructors.filter((instructor) => {
                return instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
            }
        );
        setFilteredInstructors(filtered);
    }, [instructors, searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteInstructor(id);
            setInstructors((prev) => prev.filter((instructor) => instructor._id !== id));
        } catch (error) {
            console.error("Error deleting instructor:", error);
        }
    };

    const columns = [
        {
            accessorKey: "name",
            header: "Name",
            cell: (instructors) => <span className="text-gray-900">{instructors.getValue()}</span>,
        },
        {
            accessorKey: "specialization",
            header: "Specialization",
            cell: (instructors) => (
                <span className="text-gray-500">
                    {instructors.getValue()?.join(", ") || "No Specialization"}
                </span>
            ),
        },
        {
            accessorKey: "experience",
            header: "Experience",
            cell: (instructors) => <span className="text-gray-500">{instructors.getValue()}</span>,
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: (instructors) => {
                const instructor = instructors.row.original;
                return (
                    <div className="flex space-x-2">
                        <Link
                            to={`/admin/instructors/update/${instructor._id}`}
                            className="text-[#9B6763] hover:text-[#B8998C]"
                        >
                            Edit
                        </Link>
                        <button
                            onClick={() => handleDelete(instructor._id)}
                            className="text-[#B8978C] hover:text-[#A38F85]"
                        >
                            Delete
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col h-full">
            <h1 className="text-3xl font-semibold text-center mb-6">Instructors</h1>
            <div className="flex justify-between items-center mb-4">
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Instructor
                </Link>
                <input
                    type="text"
                    placeholder="Search instructors"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="p-2 w-full max-w-xs border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {filteredInstructors.length > 0 ? (
                <DataTable defaultData={filteredInstructors} columns={columns} itemsPerPage={7} />
            ) : (
                <p className="text-gray-500">No instructors found.</p>
            )}
        </div>
    );
};

export default ListInstructors;
