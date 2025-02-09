import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface CategoryFormData {
    name: string;
    description: string;
    photo: File | null;
}

const AddCategory: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CategoryFormData>({
        name: "",
        description: "",
        photo: null,
    });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, photo: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formDataObj = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === "photo" && value) {
                formDataObj.append("category_photo", value as Blob);
            } else if (value) {
                formDataObj.append(key, value as string);
            }
        });

        try {
            const response = await axios.post("http://localhost:5000/api/workshop-categories/save", formDataObj, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Category added successfully!");
            navigate("/admin/categories");
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Failed to add category.");
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
                <h1 className="text-3xl font-semibold">Add New Category</h1>
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
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Category Image</label>
                    <input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                    />
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-3 h-40 object-cover" />}
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <button
                        type="submit"
                        className={`w-full bg-[#9B6763] text-white p-3 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Category"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCategory;