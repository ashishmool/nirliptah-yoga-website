import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddUser: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        photo: null as File | null,
        role: "student",
        age: 0,
        height: 0,
        weight: 0,
        gender: "prefer not to say",
        medical_conditions: "",
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, photo: file });
            setImagePreview(URL.createObjectURL(file)); // Set the preview URL
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            medical_conditions: formData.medical_conditions.split(",").map((condition) => condition.trim()),
        };

        const formDataObj = new FormData();
        formDataObj.append("name", formData.name);
        formDataObj.append("email", formData.email);
        formDataObj.append("password", formData.password);
        formDataObj.append("role", formData.role);
        formDataObj.append("age", formData.age.toString());
        formDataObj.append("height", formData.height.toString());
        formDataObj.append("weight", formData.weight.toString());
        formDataObj.append("gender", formData.gender);
        formDataObj.append("medical_conditions", payload.medical_conditions.join(","));

        // If there's a profile picture, append it to the form data
        if (formData.photo) {
            formDataObj.append("user_photo", formData.photo);
        }

        try {
            const response = await axios.post("http://localhost:5000/api/users/save", formDataObj, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("User added successfully!");
            console.log("Response:", response.data);
            setFormData({
                name: "",
                email: "",
                password: "",
                photo: null,
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
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-[#9B6763] hover:text-[#B8998C]"
                >
                    &#8592; Back
                </button>
                <h1 className="text-3xl font-semibold">Add New User</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form Inputs */}
                {[
                    { label: "Name", name: "name", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Password", name: "password", type: "password" },
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
                            value={formData[name as keyof typeof formData] as string | number}
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

                {/* Profile Picture */}
                <div>
                    <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                    <input
                        id="profile_picture"
                        name="profile_picture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {imagePreview && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-500">Image Preview:</p>
                            <img
                                src={imagePreview}
                                alt="Selected Profile"
                                className="w-full h-60 object-cover border border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    )}
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
