import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddSchedule: React.FC = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        workshop_id: "",
        instructor_id: "",
        days_of_week: [] as string[], // Array of selected days (e.g., ["Monday", "Wednesday"])
        start_time: "",
        end_time: "",
        status: "active", // Default status is active
    });

    const [loading, setLoading] = useState(false);
    const [workshops, setWorkshops] = useState([]);
    const [instructors, setInstructors] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [workshopRes, instructorRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/workshops"),
                    axios.get("http://localhost:5000/api/users"),
                ]);

                const instructors = instructorRes.data.filter(
                    (user: any) => user.role === "instructor"
                );
                setWorkshops(workshopRes.data || []);
                setInstructors(instructors);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to fetch initial data.");
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        const days_of_week = [...formData.days_of_week];
        if (checked) {
            days_of_week.push(value);
        } else {
            const index = days_of_week.indexOf(value);
            if (index > -1) {
                days_of_week.splice(index, 1);
            }
        }
        setFormData({ ...formData, days_of_week });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            for (const day of formData.days_of_week) {
                const schedule = {
                    workshop_id: formData.workshop_id,
                    instructor: formData.instructor_id,
                    days_of_week: [day], // Aligning with the schema
                    start_time: formData.start_time,
                    end_time: formData.end_time,
                    status: formData.status,
                };

                await axios.post("http://localhost:5000/api/schedules/save", schedule);
            }

            toast.success("Schedule added successfully!");
            navigate("/admin/schedules");
        } catch (error) {
            console.error("Error adding schedule:", error);
            toast.error("Failed to add schedule. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-[#9B6763] hover:text-[#B8998C]"
                >
                    &#8592; Back
                </button>
                <h1 className="text-3xl font-semibold">Add New Schedule</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="workshop_id" className="block text-sm font-medium text-gray-700">Workshop</label>
                    <select
                        id="workshop_id"
                        name="workshop_id"
                        value={formData.workshop_id}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                        required
                    >
                        <option value="">Select Workshop</option>
                        {workshops.map((workshop: any) => (
                            <option key={workshop._id} value={workshop._id}>
                                {workshop.title}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="instructor_id" className="block text-sm font-medium text-gray-700">Instructor</label>
                    <select
                        id="instructor_id"
                        name="instructor_id"
                        value={formData.instructor_id}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                        required
                    >
                        <option value="">Select Instructor</option>
                        {instructors.map((instructor: any) => (
                            <option key={instructor._id} value={instructor._id}>
                                {instructor.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Days of the Week</label>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <div key={day} className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                name="days_of_week"
                                value={day}
                                checked={formData.days_of_week.includes(day)}
                                onChange={handleDayChange}
                                className="form-checkbox"
                            />
                            <label className="text-sm">{day}</label>
                        </div>
                    ))}
                </div>

                <div className="flex space-x-4">
                    <div className="w-1/2">
                        <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">Start Time</label>
                        <input
                            id="start_time"
                            name="start_time"
                            type="time"
                            value={formData.start_time}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    <div className="w-1/2">
                        <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">End Time</label>
                        <input
                            id="end_time"
                            name="end_time"
                            type="time"
                            value={formData.end_time}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="flex space-x-4">
                        <div>
                            <input
                                type="radio"
                                id="active"
                                name="status"
                                value="active"
                                checked={formData.status === "active"}
                                onChange={handleChange}
                                className="radio"
                            />
                            <label htmlFor="active" className="text-sm">Active</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="cancelled"
                                name="status"
                                value="cancelled"
                                checked={formData.status === "cancelled"}
                                onChange={handleChange}
                                className="radio"
                            />
                            <label htmlFor="cancelled" className="text-sm">Cancelled</label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/admin/schedules")}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-[#9B6763] text-white p-3 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "Saving..." : "Save Schedule"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSchedule;
