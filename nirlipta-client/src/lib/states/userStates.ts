import { create } from "zustand";

type UserState = {
    isLoggedIn: boolean; // Tracks if the user is logged in
    setIsLoggedIn: (state: boolean) => void; // Function to update the state
};

const useUserState = create<UserState>((set) => ({
    isLoggedIn: false, // Initial state
    setIsLoggedIn: (state) => set({ isLoggedIn: state }),
}));

export default useUserState;


