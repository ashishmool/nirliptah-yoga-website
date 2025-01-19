import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import axios from "axios";
import Pagination from "../../../components/Pagination";
import { toast } from "sonner";

interface Schedule {
    _id: string;
    title: string;
    instructor_id: { name: string };
    workshop_id: { name: string };
    day_of_week: string;
    start_time: string;
    end_time: string;
    status: string;
}

const ListSchedules: React.FC = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [filteredSchedules, setFilteredSchedules] = useState<Schedule[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [selectedInstructor, setSelectedInstructor] = useState<string>("All");
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

    // Filter schedules by week and instructor
    useEffect(() => {
        let updatedSchedules = schedules;

        if (selectedDate) {
            const selectedDay = selectedDate.getDay();
            const startOfWeek = new Date(selectedDate);
            startOfWeek.setDate(selectedDate.getDate() - selectedDay);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            updatedSchedules = updatedSchedules.filter(schedule => {
                const dayIndex = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(
                    schedule.day_of_week
                );
                const scheduleDate = new Date(startOfWeek);
                scheduleDate.setDate(startOfWeek.getDate() + dayIndex);

                return scheduleDate >= startOfWeek && scheduleDate <= endOfWeek;
            });
        }

        if (selectedInstructor !== "All") {
            updatedSchedules = updatedSchedules.filter(
                schedule => schedule.instructor_id?.name === selectedInstructor
            );
        }

        setFilteredSchedules(updatedSchedules);
        setCurrentPage(1); // Reset to page 1 when filters change
    }, [selectedDate, selectedInstructor, schedules]);

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

    // Placeholder for edit functionality
    const handleEdit = (id: string) => {
        toast("Edit functionality to be implemented.");
    };

    // Get unique instructors
    const instructors = Array.from(new Set(schedules.map(schedule => schedule.instructor_id?.name))).filter(Boolean);

    const paginatedSchedules = filteredSchedules.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-7xl mx-auto p-6 flex flex-col">
            <h1 className="text-3xl font-semibold text-center mb-6">Weekly Schedule</h1>

            {/* Instructor Filter */}
            <div className="flex justify-center mb-4">
                <div className="btn-group space-x-2">
                    <button
                        className={`btn btn-dash ${
                            selectedInstructor === "All"
                                ? "bg-[#9b6763] text-white border-none"
                                : "border border-[#9b6763] text-[#9b6763] bg-transparent"
                        }`}
                        onClick={() => setSelectedInstructor("All")}
                    >
                        All
                    </button>
                    {instructors.map((instructor, index) => (
                        <button
                            key={index}
                            className={`btn btn-dash ${
                                selectedInstructor === instructor
                                    ? "bg-[#9b6763] text-white border-none" // Selected button style
                                    : "border border-[#9b6763] text-[#9b6763] bg-transparent" // Unselected button style
                            }`}
                            onClick={() => setSelectedInstructor(instructor)}
                        >
                            {instructor}
                        </button>
                    ))}
                </div>
            </div>


            {loading ? (
                <p className="text-center text-gray-500">Loading schedules...</p>
            ) : filteredSchedules.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Instructor</th>
                            <th>Workshop</th>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedSchedules.map(schedule => (
                            <tr key={schedule._id}>
                                <td>{schedule.title}</td>
                                <td>{schedule.instructor_id?.name}</td>
                                <td>{schedule.workshop_id?.title}</td>
                                <td>{schedule.day_of_week}</td>
                                <td>
                                    {schedule.start_time} - {schedule.end_time}
                                </td>
                                <td>
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
                        <tfoot>
                        <tr>
                            <th>Title</th>
                            <th>Instructor</th>
                            <th>Workshop</th>
                            <th>Day</th>
                            <th>Time</th>
                            <th>Actions</th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-500">No schedules found for this week or instructor.</p>
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
