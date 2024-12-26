import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // for the back button functionality
import { toast } from "sonner"; // for notifications

const AddInstructor: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        bio: "",
        specialization: "",
        experience: 0,
        availability: "",
    });

    const [loading, setLoading] = useState(false);

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
            await axios.post("http://localhost:5000/api/instructors/save", payload);
            toast.success("Instructor added successfully!");
            setFormData({
                name: "",
                bio: "",
                specialization: "",
                experience: 0,
                availability: "",
            });
            navigate("/admin/instructors"); // navigate to instructors page after successful addition
        } catch (error) {
            console.error("Error adding instructor:", error);
            toast.error("Failed to add instructor.");
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
                <h1 className="text-3xl font-semibold">Add Instructor</h1>
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
                        {loading ? "Adding..." : "Add Instructor"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddInstructor;
