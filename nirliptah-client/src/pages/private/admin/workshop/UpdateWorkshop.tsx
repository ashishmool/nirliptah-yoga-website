import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

interface Module {
    name: string;
    duration: number; // Duration in minutes
}

interface WorkshopFormData {
    title: string;
    description: string;
    difficulty_level: string;
    discount_price: number;
    price: number;
    classroom_info: string;
    address: string;
    map_location: string;
    photo: File | null;
    instructor_id: string;
    category: string;
    newCategory?: string;
    modules: Module[];
}

const UpdateWorkshop: React.FC = () => {
    const { id } = useParams<{ id: string }>();
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
        instructor_id: "", // Initialize as an empty object with an _id and name
        category: "", // Same for category
        modules: [],
    });
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [instructors, setInstructors] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isNewCategory, setIsNewCategory] = useState(false);

    // Fetch instructors
    useEffect(() => {
        const fetchInstructors = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:5000/api/instructors");
                setInstructors(response.data);
            } catch (error) {
                console.error("Error fetching instructors:", error);
                toast.error("Failed to fetch instructors.");
            } finally {
                setLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:5000/api/workshop-categories");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to fetch categories.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Fetch workshop data on component mount
    useEffect(() => {
        const fetchWorkshopData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/workshops/${id}`);
                const workshop = response.data;
                setFormData({
                    title: workshop.title || "",
                    description: workshop.description || "",
                    difficulty_level: workshop.difficulty_level || "beginner",
                    price: workshop.price || 0,
                    discount_price: workshop.discount_price || 0,
                    classroom_info: workshop.classroom_info || "",
                    address: workshop.address || "",
                    map_location: workshop.map_location || "",
                    photo: null, // Don't auto-load photo into form data
                    instructor_id: workshop.instructor_id._id || "",
                    category: workshop.category._id || "",
                    modules: workshop.modules || [],

                });

                if (workshop.photo) {
                    setImagePreview(`http://localhost:5000${workshop.photo}`);
                }
            } catch (error) {
                console.error("Error fetching workshop data:", error);
                toast.error("Failed to load workshop data.");
            } finally {
                setLoading(false);
            }
        };

        fetchWorkshopData();
    }, [id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData({ ...formData, photo: file });
            setImagePreview(URL.createObjectURL(file)); // Display preview
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleInstructorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedInstructorId = e.target.value;
        setFormData({ ...formData, instructor_id: selectedInstructorId });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryId = e.target.value;
        setFormData({ ...formData, category: selectedCategoryId });
        setIsNewCategory(selectedCategoryId === "create-new"); // Show input field if "Create New Category" is selected
    };

    const handleModuleChange = (index: number, field: keyof Module, value: string | number) => {
        const updatedModules = [...formData.modules];
        updatedModules[index] = { ...updatedModules[index], [field]: value };
        setFormData({ ...formData, modules: updatedModules });
    };

    const addModule = () => {
        setFormData({
            ...formData,
            modules: [...formData.modules, { name: "", duration: 0 }],
        });
    };

    const removeModule = (index: number) => {
        const updatedModules = formData.modules.filter((_, i) => i !== index);
        setFormData({ ...formData, modules: updatedModules });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formDataObj = new FormData();
        formDataObj.append("title", formData.title);
        formDataObj.append("description", formData.description);
        formDataObj.append("difficulty_level", formData.difficulty_level);
        formDataObj.append("price", formData.price.toString());
        formDataObj.append("discount_price", formData.discount_price.toString());
        formDataObj.append("classroom_info", formData.classroom_info);
        formDataObj.append("address", formData.address);
        formDataObj.append("map_location", formData.map_location);
        formDataObj.append("instructor_id", formData.instructor_id);
        formDataObj.append("category", formData.category);

        formDataObj.append("modules", JSON.stringify(formData.modules)); // Send modules as JSON string
        if (formData.photo) {
            formDataObj.append("photo", formData.photo);
        }
        if (isNewCategory && formData.newCategory) {
            formDataObj.append("newCategory", formData.newCategory); // Add new category if applicable
        }

        try {
            console.log("Prepare Data Payload::::", formData);
            await axios.put(`http://localhost:5000/api/workshops/update/${id}`, formDataObj, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Workshop updated successfully!");
            navigate("/admin/workshops");
        } catch (error) {
            console.error("Error updating workshop:", error);
            toast.error("Failed to update workshop.");
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
                <h1 className="text-3xl font-semibold mb-6">Update Workshop</h1>
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
                        {isNewCategory && (
                            <input
                                id="newCategory"
                                name="newCategory"
                                type="text"
                                value={formData.newCategory || ""}
                                onChange={handleChange}
                                className="mt-2 block w-full p-3 border border-gray-300 rounded-md"
                                placeholder="Enter new category name"
                            />
                        )}
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
                        onChange={handleInstructorChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                    >
                        <option value="">Select an instructor</option>
                        {instructors.map((instructor) => (
                            <option key={instructor._id} value={instructor._id}>
                                {instructor.name}
                            </option>
                        ))}
                    </select>


                </div>

                {/* Modules */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Modules</label>
                    {formData.modules.map((module, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <input
                                type="text"
                                value={module.name}
                                onChange={(e) => handleModuleChange(index, "name", e.target.value)}
                                placeholder="Module name"
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                            />
                            <input
                                type="number"
                                value={module.duration}
                                onChange={(e) => handleModuleChange(index, "duration", Number(e.target.value))}
                                placeholder="Duration (minutes)"
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => removeModule(index)}
                                className="text-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addModule}
                        className="text-blue-500"
                    >
                        Add Module
                    </button>
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
                            alt="Workshop Preview"
                            className="mt-2 w-32 h-32 object-cover rounded-md"
                        />
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Workshop"}
                </button>
            </form>
        </div>
    );
};

export default UpdateWorkshop;
