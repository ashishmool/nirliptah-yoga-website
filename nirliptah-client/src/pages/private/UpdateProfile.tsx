import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const UpdateProfile: React.FC = () => {
    const id = localStorage.getItem('user_id');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState<{
        name: string;
        email: string,
        username: string,
        dob: string;
        phone:" ",
        gender: string;
        medical_conditions: string;
        photo: string | null;
    }>({
        name: "",
        username: "",
        email: "",
        dob: "",
        phone:" ",
        gender: "",
        medical_conditions: "",
        photo: null, // Ensure it's explicitly defined as null initially
    });


    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = async () => {
        try {
            console.log("User ID from params:", id);

            const response = await axios.get(`http://localhost:5000/api/users/getById/${id}`);

            // Format the dob to "yyyy-MM-dd" if it exists
            const formattedDob = response.data.dob
                ? new Date(response.data.dob).toISOString().split("T")[0]
                : "";

            setFormData({
                name: response.data.name || "",
                email: response.data.email || "",
                username: response.data.username || "",
                phone: response.data.phone || "",
                dob: formattedDob,
                gender: response.data.gender || "",
                medical_conditions: response.data.medical_conditions?.join(", ") || "",
                photo: response.data.photo || null,
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Failed to fetch user data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("Payload to Update::: ", formData);

        try {
            const formDataPayload = new FormData();
            formDataPayload.append("name", formData.name);
            formDataPayload.append("username", formData.username);
            formDataPayload.append("email", formData.email);
            formDataPayload.append("phone", formData.phone);
            formDataPayload.append("dob", formData.dob);
            formDataPayload.append("gender", formData.gender);
            formDataPayload.append("medical_conditions", formData.medical_conditions);

            if (selectedImage) {
                formDataPayload.append("user_photo", selectedImage);
            }

            // Make the PATCH request to update the profile
            await axios.patch(
                `http://localhost:5000/api/users/patch/${id}`,
                formDataPayload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Profile updated successfully!");

            // Fetch the updated user data
            const response = await axios.get(`http://localhost:5000/api/users/getById/${id}`);
            const updatedPhoto = response.data.photo;

            if (updatedPhoto) {
                // Save the updated photo in localStorage
                localStorage.setItem("photo", updatedPhoto);
                console.log("Updated Photo URL:", updatedPhoto);
            }

            // Navigate after successful update
            window.location.href = "/";

        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="max-w-3xl mx-auto p-6 mt-24">
            <h1 className="text-3xl font-semibold text-center mb-6">Update Profile</h1>
            {loading ? (
                <p>Loading user data...</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {formData.photo && (
                        <img
                            src={formData?.photo
                                ? formData?.photo.includes('/uploads/user_photos/')
                                    ? `http://localhost:5000${formData?.photo}`
                                    : `http://localhost:5000/uploads/${formData?.photo}`
                                : "/default-avatar.png"
                            }
                            alt={formData.name}
                            className="w-16 h-16 object-cover rounded"
                        />
                    )}

                    <div className="space-y-4">
                        {/* Row 1: Name, Email, Username */}
                        <div className="flex gap-4">
                            {/* Name */}
                            <div className="w-1/3">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Email */}
                            <div className="w-1/3">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 text-sm text-gray-400 rounded-md"
                                    disabled={true}
                                />
                            </div>

                            {/* Username */}
                            <div className="w-1/3">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 text-sm text-gray-400 rounded-md"
                                    disabled={true}
                                />
                            </div>
                        </div>

                        {/* Row 2: Date of Birth, Gender, Phone */}
                        <div className="flex gap-4">
                            {/* Date of Birth */}
                            <div className="w-1/3">
                                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                <input
                                    id="dob"
                                    name="dob"
                                    type="date"
                                    value={formData.dob}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>

                            {/* Gender */}
                            <div className="w-1/3">
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Phone */}
                            <div className="w-1/3">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                    </div>


                    <div>
                        <label htmlFor="medical_conditions" className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                        <input
                            id="medical_conditions"
                            name="medical_conditions"
                            type="text"
                            value={formData.medical_conditions}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div>
                        <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                        <input
                            id="user_photo"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="text-sm"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-white bg-[#9B6763] rounded-md hover:bg-[#B8998C]"
                        >
                            {loading ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UpdateProfile;
