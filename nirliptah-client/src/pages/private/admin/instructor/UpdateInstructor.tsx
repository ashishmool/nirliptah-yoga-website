import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // for notifications

const UpdateInstructor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        specialization: "",
        experience: 0,
        availability: "",
    });

    const [loading, setLoading] = useState(false);

    // Fetch instructor data on component mount
    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/instructors/getById/${id}`);
                const instructor = response.data;
                setFormData({
                    name: instructor.name || "",
                    bio: instructor.bio || "",
                    specialization: instructor.specialization.join(", ") || "",
                    experience: instructor.experience || 0,
                    availability: instructor.availability || "",
                });
            } catch (error) {
                console.error("Error fetching instructor:", error);
                toast.error("Failed to fetch instructor data.");
            }
        };

        if (id) fetchInstructor();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            specialization: formData.specialization.split(",").map((spec) => spec.trim()),
        };

        try {
            await axios.put(`http://localhost:5000/api/instructors/update/${id}`, payload);
            toast.success("Instructor updated successfully!");
            navigate("/admin/instructors");
        } catch (error) {
            console.error("Error updating instructor:", error);
            toast.error("Failed to update instructor.");
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
                <h1 className="text-3xl font-semibold">Update Instructor</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name, Specialization, Rating (Same Row) */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">Specialization (comma-separated)</label>
                        <input
                            id="specialization"
                            name="specialization"
                            type="text"
                            value={formData.specialization}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience in Years (0-30)</label>
                        <input
                            id="experience"
                            name="experience"
                            type="number"
                            value={formData.experience}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            min="0"
                            max="30"
                            required
                        />
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Availability */}
                <div>
                    <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
                    <input
                        id="availability"
                        name="availability"
                        type="text"
                        value={formData.availability}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-white bg-[#9B6763] rounded-md hover:bg-[#B8998C] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {loading ? "Updating..." : "Update Instructor"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateInstructor;
