import { create } from 'zustand';

type LoadingPerfumeTypes = {
    loadingJewellery: boolean,
    setLoadingPerfume: (newState: boolean) => void
}

const useLoadingPerfume = create<LoadingPerfumeTypes>((set) => ({
    loadingJewellery: true,
    setLoadingPerfume: (newState) => set({ loadingJewellery: newState })
}))

export default useLoadingPerfume;