import axios from "axios";
import { toast } from "sonner";
import {updateAccommodation} from "@/backend/services/accommodationService.ts";

const API_BASE_URL = "http://localhost:5000/api/rooms";

// Fetch all accommodation rooms
export const fetchAccommodationRooms = async (setRooms: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
        const response = await axios.get(API_BASE_URL);
        setRooms(response.data);
    } catch (error) {
        console.error("Error fetching accommodation rooms:", error);
        toast.error("Failed to fetch accommodation rooms.");
    }
};

// Fetch a specific accommodation room by ID
export const fetchAccommodationRoomById = async (
    id: string,
    setRoomData: React.Dispatch<React.SetStateAction<any>>
) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        setRoomData(response.data);
    } catch (error) {
        console.error("Error fetching accommodation room:", error);
        toast.error("Failed to load accommodation room data.");
    }
};

// Create a new accommodation room


export const createRoom = async (data: FormData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/save`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Room created successfully!");
        return response.data;
    } catch (error) {
        console.error("Error creating room:", error);
        throw new Error("Failed to create room.");
    }
};


// Update an accommodation room by ID
export const updateAccommodationRoom = async (id: string, data: any) => {
    try {
        const formData = new FormData();

        // Append fields to FormData
        formData.append("room_type", data.room_type);
        formData.append("max_occupancy", data.max_occupancy);
        formData.append("price", data.price);
        formData.append("quantity", data.quantity);
        formData.append("accommodation", data.accommodation);

        if (data.photo) {
            formData.append("photo", data.photo);
        }

        await axios.put(`${API_BASE_URL}/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        toast.success("Room updated successfully!");

    } catch (error) {
        console.error("Error updating room:", error);
        toast.error("Failed to update room.");
    }
};

// Delete an accommodation room by ID
export const deleteAccommodationRoom = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
        try {
            await axios.delete(`${API_BASE_URL}/delete/${id}`);
            toast.success("Room deleted successfully!");
        } catch (error) {
            console.error("Error deleting room:", error);
            toast.error("Failed to delete room.");
        }
    }
};

export const createRoomAndUpdateAccommodation = async (
    roomsData: FormData[],
    accommodationId: string
) => {
    try {
        const roomIds: string[] = [];

        // Step 1: Create each room and collect their IDs
        for (const roomData of roomsData) {
            const createdRoom = await createRoom(roomData);
            roomIds.push(createdRoom._id); // Collect the room IDs
        }

        // Step 2: Prepare form data for updating accommodation
        const formData = new FormData();
        formData.append("room_type", JSON.stringify(roomIds)); // Append all room IDs as a JSON array

        // Step 3: Update the accommodation
        await updateAccommodation(accommodationId, formData);

        toast.success("Rooms created and linked to accommodation successfully!");
    } catch (error) {
        console.error("Error during room creation and accommodation update:", error);
        toast.error("Failed to create rooms and update accommodation.");
    }
};


