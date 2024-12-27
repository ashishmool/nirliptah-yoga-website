import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

interface WorkshopFormData {
    title: string;
    description: string;
    difficulty_level: string;
    price: number;
    discount_price: number;
    classroom_info: string;
    address: string;
    map_location: string;
    photo: File | null;
    instructor_id: string;
    category: string;
    newCategory?: string;
    modules: { name: string; duration: string }[];
}

const AddWorkshop: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<WorkshopFormData>({
        title: "",
        description: "",
        difficulty_level: "beginner",
        price: 0,
        discount_price: 0,
        classroom_info: "",
        address: "",
        map_location: "",
        photo: null,
        instructor_id: "",
        category: "",
        modules: [{ name: "", duration: "" }],
    });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [instructors, setInstructors] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/instructors");
                setInstructors(response.data);
            } catch (error) {
                console.error("Error fetching instructors:", error);
                toast.error("Failed to fetch instructors.");
            }
        };
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/workshop-categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to fetch categories.");
            }
        };

        fetchInstructors();
        fetchCategories();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePriceChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        const numericValue = parseFloat(value);

        // Ensure the value is not negative
        if (numericValue < 0) {
            toast.error(`${name === "price" ? "Price" : "Discounted price"} cannot be negative.`);
            return;
        }

        // Check discounted price validation
        if (name === "discount_price" && numericValue >= parseFloat(formData.price)) {
            toast.error("Discounted price must be less than the price.");
            return;
        }

        // Check price validation
        if (name === "price" && parseFloat(formData.discount_price) >= numericValue) {
            toast.error("Discounted price must be less than the price.");
            return;
        }

        setFormData({ ...formData, [name]: value });
    };


    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategory = e.target.value;
        setFormData({ ...formData, category: selectedCategory });
    };

    const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, newCategory: e.target.value });
    };

    const handleModuleChange = (index: number, field: string, value: string) => {
        const updatedModules = [...formData.modules];
        updatedModules[index][field] = value;
        setFormData({ ...formData, modules: updatedModules });
    };

    const addModule = () => {
        setFormData({ ...formData, modules: [...formData.modules, { name: "", duration: "" }] });
    };

    const removeModule = (index: number) => {
        const updatedModules = formData.modules.filter((_, i) => i !== index);
        setFormData({ ...formData, modules: updatedModules });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, photo: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Submit handler
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formDataObj = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === "modules") {
                value.forEach((module: any, index: number) => {
                    formDataObj.append(`modules[${index}][name]`, module.name);
                    formDataObj.append(`modules[${index}][duration]`, module.duration);
                });
            } else if (key === "photo" && value) {
                formDataObj.append("workshop_photo", value as Blob); // Appending workshop photo here
            } else if (value) {
                formDataObj.append(key, value as string);
            }
        });

        try {
            const response = await axios.post("http://localhost:5000/api/workshops/save", formDataObj, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Workshop added successfully!");
            navigate("/admin/workshops");
        } catch (error) {
            console.error("Error adding workshop:", error);
            toast.error("Failed to add workshop.");
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
                <h1 className="text-3xl font-semibold">Add New Workshop</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title and Category in the same line */}
                <div className="flex space-x-6">
                    <div className="flex-1">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleCategoryChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                            <option value="create-new">Create New Category</option>
                        </select>
                    </div>
                </div>

                {/* Show input for new category if "Create New Category" is selected */}
                {formData.category === "create-new" && (
                    <div>
                        <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700">New Category Name</label>
                        <input
                            id="newCategory"
                            name="newCategory"
                            type="text"
                            value={formData.newCategory || ""}
                            onChange={handleNewCategoryChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                )}

                {/* Difficulty Level, Price, and Address in the same line */}
                <div className="flex space-x-6">
                    <div className="flex-1">
                        <label htmlFor="difficulty_level" className="block text-sm font-medium text-gray-700">Difficulty Level</label>
                        <select
                            id="difficulty_level"
                            name="difficulty_level"
                            value={formData.difficulty_level}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handlePriceChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700">Discounted Price</label>
                        <input
                            id="discount_price"
                            name="discount_price"
                            type="number"
                            value={formData.discount_price}
                            onChange={handlePriceChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                {/* Classroom Info and Map Location in the same line */}
                <div className="flex space-x-6">
                    <div className="flex-1">
                        <label htmlFor="classroom_info" className="block text-sm font-medium text-gray-700">Classroom Info</label>
                        <textarea
                            id="classroom_info"
                            name="classroom_info"
                            value={formData.classroom_info}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="map_location" className="block text-sm font-medium text-gray-700">Map Location</label>
                        <input
                            id="map_location"
                            name="map_location"
                            type="text"
                            value={formData.map_location}
                            onChange={handleChange}
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                        required
                    />
                </div>

                {/* Instructor */}
                <div>
                    <label htmlFor="instructor_id" className="block text-sm font-medium text-gray-700">Instructor</label>
                    <select
                        id="instructor_id"
                        name="instructor_id"
                        value={formData.instructor_id}
                        onChange={handleChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                        required
                    >
                        <option value="">Select Instructor</option>
                        {instructors.map((instructor) => (
                            <option key={instructor._id} value={instructor._id}>
                                {instructor.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Image Upload */}
                <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Workshop Image</label>
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

                {/* Modules */}
                <div>
                    <h3 className="text-lg font-semibold">Modules</h3>
                    {formData.modules.map((module, index) => (
                        <div key={index} className="flex space-x-4 mb-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Module Name"
                                    value={module.name}
                                    onChange={(e) => handleModuleChange(index, "name", e.target.value)}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Duration"
                                    value={module.duration}
                                    onChange={(e) => handleModuleChange(index, "duration", e.target.value)}
                                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeModule(index)}
                                className="p-2 bg-[#B8978C] text-white rounded-md"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addModule}
                        className="bg-[#A38F85] text-white p-2 rounded-md"
                    >
                        + Add Module
                    </button>
                </div>

                <div className="mt-6">
                    <button
                        type="submit"
                        className={`w-full bg-[#9B6763] text-white p-3 rounded-md ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Workshop"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddWorkshop;
