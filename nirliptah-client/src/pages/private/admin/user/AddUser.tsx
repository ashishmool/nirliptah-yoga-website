import React, { useState } from "react";
import axios from "axios";

const AddUser: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profile_picture: "",
        role: "student",
        age: 0,
        height: 0,
        weight: 0,
        gender: "prefer not to say",
        medical_conditions: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            medical_conditions: formData.medical_conditions.split(",").map((condition) => condition.trim()),
        };

        try {
            const response = await axios.post("http://localhost:5000/api/users/add", payload);
            alert("User added successfully!");
            console.log("Response:", response.data);
            setFormData({
                name: "",
                email: "",
                password: "",
                profile_picture: "",
                role: "student",
                age: 0,
                height: 0,
                weight: 0,
                gender: "prefer not to say",
                medical_conditions: "",
            }); // Reset form
        } catch (error) {
            console.error("Error adding user:", error);
            alert("Failed to add user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-3xl font-semibold text-center mb-6">Add New User</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Inputs */}
                {[
                    { label: "Name", name: "name", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Password", name: "password", type: "password" },
                    { label: "Profile Picture (URL)", name: "profile_picture", type: "text" },
                    { label: "Age", name: "age", type: "number" },
                    { label: "Height (cm)", name: "height", type: "number" },
                    { label: "Weight (kg)", name: "weight", type: "number" },
                ].map(({ label, name, type }) => (
                    <div key={name}>
                        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
                        <input
                            id={name}
                            name={name}
                            type={type}
                            value={formData[name]}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                ))}

                {/* Gender */}
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-Binary</option>
                        <option value="prefer not to say">Prefer Not to Say</option>
                    </select>
                </div>

                {/* Role */}
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                {/* Medical Conditions */}
                <div>
                    <label htmlFor="medical_conditions" className="block text-sm font-medium text-gray-700">Medical Conditions (comma-separated)</label>
                    <input
                        id="medical_conditions"
                        name="medical_conditions"
                        type="text"
                        value={formData.medical_conditions}
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
                        className="w-full py-3 mt-4 text-white bg-[#9B6763] rounded-md hover:bg-[#B8998C] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {loading ? "Adding..." : "Add User"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUser;
