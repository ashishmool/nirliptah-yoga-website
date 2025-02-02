import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import axios from "axios";
import Pagination from "../../../components/Pagination";
import { toast } from "sonner";
import { FaPauseCircle, FaCheckCircle, FaBan } from "react-icons/fa";

interface Schedule {
    _id: string;
    title: string;
    workshop_id: { title: string };
    days_of_week: string[];
    start_time: string;
    end_time: string;
    status: "active" | "paused" | "canceled";
}

const ListSchedules: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
    const [selectedDay, setSelectedDay] = useState<string | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const ITEMS_PER_PAGE = 10;

    // Fetch schedules from the backend
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/schedules");
                setSchedules(response.data);
                setFilteredSchedules(response.data);
            } catch (error) {
                toast.error("Error fetching schedules.");
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, []);

    // Filter schedules by day
    useEffect(() => {
        let updatedSchedules = schedules;

        if (selectedDay) {
            updatedSchedules = updatedSchedules.filter(schedule =>
                schedule.days_of_week.includes(selectedDay)
            );
        }

        setFilteredSchedules(updatedSchedules);
        setCurrentPage(1); // Reset to page 1 when filters change
    }, [selectedDay, schedules]);

    // Handle delete schedule
    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this schedule?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/schedules/delete/${id}`);
            toast.success("Schedule deleted successfully.");
            setSchedules(schedules.filter(schedule => schedule._id !== id));
        } catch (error) {
            toast.error("Error deleting schedule.");
        }
    };

    // Handle status update
    const updateStatus = async (id: string, newStatus: "active" | "paused" | "canceled") => {
        try {
            await axios.patch(`http://localhost:5000/api/schedules/${id}/status`, { status: newStatus });
            toast.success(`Status updated to ${newStatus}.`);
            setSchedules(schedules.map(schedule =>
                schedule._id === id ? { ...schedule, status: newStatus } : schedule
            ));
        } catch (error) {
            toast.error("Error updating status.");
        }
    };

    // Placeholder for edit functionality
    const handleEdit = (id: string) => {
        toast("Edit functionality to be implemented.");
    };

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const paginatedSchedules = filteredSchedules.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Clear day filter
    const clearFilters = () => {
        setSelectedDay(undefined);
    };

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col">
            <h1 className="text-3xl font-semibold text-center mb-6">Weekly Schedule</h1>

            {/* Day Filter */}
            <div className="flex justify-center mb-4">
                <div className="btn-group space-x-2">
                    {daysOfWeek.map((day, index) => (
                        <button
                            key={index}
                            className={`btn btn-dash ${
                                selectedDay === day
                                    ? "bg-[#9b6763] text-white border-none"
                                    : "border border-[#9b6763] text-[#9b6763] bg-transparent"
                            }`}
                            onClick={() => setSelectedDay(day)}
                        >
                            {day}
                        </button>
                    ))}
                    {/* Clear Filters Button */}
                    <button
                        className="btn btn-dash text-gray-500 hover:text-[#9b6763] hover:bg-transparent focus:outline-none"
                        onClick={clearFilters}
                    >
                        Clear Filters
                    </button>

                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-500">Loading schedules...</p>
            ) : filteredSchedules.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table w-full table-auto">
                        <thead>
                        <tr>
                            <th className="px-4 py-2">Workshop</th>
                            <th className="px-4 py-2">Time</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedSchedules.map(schedule => (
                            <tr key={schedule._id}>
                                <td className="px-4 py-2">{schedule.workshop_id?.title}</td>
                                <td className="px-4 py-2">
                                    {schedule.start_time} - {schedule.end_time}
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex items-center space-x-2">
                                        {schedule.status === "active" && (
                                            <>
                                                <FaCheckCircle
                                                    className="text-green-500 cursor-pointer"
                                                    onClick={() => updateStatus(schedule._id, "paused")}
                                                    title="Click to pause"
                                                />
                                                <button
                                                    className="btn btn-xs btn-error"
                                                    onClick={() => updateStatus(schedule._id, "canceled")}
                                                >
                                                    Cancel Schedule
                                                </button>
                                            </>
                                        )}
                                        {schedule.status === "paused" && (
                                            <>
                                                <FaPauseCircle
                                                    className="text-yellow-500 cursor-pointer"
                                                    onClick={() => updateStatus(schedule._id, "active")}
                                                    title="Click to activate"
                                                />
                                                <button
                                                    className="btn btn-xs btn-error"
                                                    onClick={() => updateStatus(schedule._id, "canceled")}
                                                >
                                                    Cancel Schedule
                                                </button>
                                            </>
                                        )}
                                        {schedule.status === "canceled" && (
                                            <>
                                                <FaBan className="text-red-500" title="Canceled" />
                                                <button
                                                    className="btn btn-xs btn-success"
                                                    onClick={() => updateStatus(schedule._id, "active")}
                                                >
                                                    Reactivate Schedule
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleEdit(schedule._id)}
                                        className="btn btn-xs btn-ghost mr-2"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(schedule._id)}
                                        className="btn btn-xs btn-error"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500">No schedules found for this day.</p>
            )}

            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredSchedules.length / ITEMS_PER_PAGE)}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default ListSchedules;
