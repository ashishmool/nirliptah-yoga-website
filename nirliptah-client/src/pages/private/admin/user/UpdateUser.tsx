import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const UpdateUser: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        gender: "",
        medical_conditions: "",
    });

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/getById/${id}`);

                // Format the dob to "yyyy-MM-dd" if it exists
                const formattedDob = response.data.dob ? new Date(response.data.dob).toISOString().split("T")[0] : "";

                setFormData({
                    name: response.data.name || "",
                    dob: formattedDob,
                    gender: response.data.gender || "",
                    medical_conditions: response.data.medical_conditions?.join(", ") || "",
                });
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Failed to fetch user data.");
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        console.log("Payload Data Sending:::: ", formData);

        try {
            const formDataPayload = new FormData();
            formDataPayload.append("name", formData.name);
            formDataPayload.append("dob", formData.dob);
            formDataPayload.append("gender", formData.gender);
            formDataPayload.append("medical_conditions", formData.medical_conditions);

            if (selectedImage) {
                formDataPayload.append("profile_picture", selectedImage);
            }

            await axios.put(`http://localhost:5000/api/users/update/${id}`, formDataPayload);

            toast.success("User updated successfully!");
            navigate("/admin/users");
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="text-[#9B6763] hover:text-[#B8998C]"
                >
                    &#8592; Back
                </button>
            </div>

            <h1 className="text-3xl font-semibold text-center mb-6">Update User</h1>
            {loading ? (
                <p>Loading user data...</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
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

                    <div>
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

                    <div>
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
                            {loading ? "Updating..." : "Update User"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UpdateUser;
