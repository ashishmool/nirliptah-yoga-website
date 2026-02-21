import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

interface CategoryFormData {
    name: string;
    description: string;
    photo: File | null;
}

const UpdateCategory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CategoryFormData>({
        name: "",
        description: "",
        photo: null,
    });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/workshop-categories/${id}`);
                const category = response.data;
                setFormData({
                    name: category.name,
                    description: category.description,
                    photo: null,
                });
                if (category.photo) {
                    setImagePreview(`http://localhost:5000${category.photo}`); // Set the fetched image URL for preview
                }
            } catch (error) {
                console.error("Error fetching category:", error);
                toast.error("Failed to fetch category.");
            }
        };

        fetchCategory();
    }, [id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, photo: file });
            setImagePreview(URL.createObjectURL(file)); // Display preview for the newly selected file
        }
    };

    // const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     setLoading(true);
    //
    //     const formDataObj = new FormData();
    //
    //     Object.entries(formData).forEach(([key, value]) => {
    //         if (key === "photo" && value) {
    //             formDataObj.append("category_photo", value as Blob);
    //         } else if (value) {
    //             formDataObj.append(key, value as string);
    //         }
    //     });
    //
    //     try {
    //         const response = await axios.put(
    //             `http://localhost:5000/api/workshop-categories/update/${id}`,
    //             formDataObj,
    //             {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                     Authorization: `Bearer ${localStorage.getItem("token")}`, // Add Bearer token
    //                 },
    //             }
    //         );
    //         toast.success("Category updated successfully!");
    //         navigate("/admin/categories");
    //     } catch (error) {
    //         console.error("Error updating category:", error);
    //         toast.error("Failed to update category.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formDataObj = new FormData();
        formDataObj.append("name", formData.name);
        formDataObj.append("description", formData.description);

        if (formData.photo) {
            formDataObj.append("category_photo", formData.photo); // Ensure field name matches backend expectation
        }

        // Retrieve token from localStorage
        const token = localStorage.getItem("token");

        try {
            console.log("Prepare Data Payload::::", formData);
            await axios.put(`http://localhost:5000/api/workshop-categories/update/${id}`, formDataObj, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`, // Include Bearer token
                },
            });
            toast.success("Category updated successfully!");
            navigate("/admin/categories");
        } catch (error) {
            console.error("Error updating category:", error);
            toast.error("Failed to update category.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <button onClick={() => navigate(-1)} className="text-[#9B6763] hover:text-[#B8998C]">
                    &#8592; Back
                </button>
                <h1 className="text-3xl font-semibold">Edit Category</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Category Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                {/* Category Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Category Description
                    </label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                        rows={4}
                        required
                    />
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Category Preview"
                            className="mt-2 w-32 h-32 object-cover rounded-md"
                        />
                    )}
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <button
                        type="submit"
                        className={`w-full bg-[#9B6763] text-white p-3 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Category"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateCategory;