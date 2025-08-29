import { create } from 'zustand';

interface StoreState {
  isSceneReady: boolean;
  scrollY: number;
  isDarkMode: boolean;
  modelData: any;
}

interface StoreActions {
  setSceneReady: (ready: boolean) => void;
  setScrollY: (y: number) => void;
  toggleDarkMode: () => void;
  setModelData: (data: any) => void;
}

type Store = StoreState & StoreActions;

const useStore = create<Store>((set) => ({
  isSceneReady: false,
  scrollY: 0,
  isDarkMode: false,
  modelData: null,

  setSceneReady: (ready: boolean) => set({ isSceneReady: ready }),
  setScrollY: (y: number) => set({ scrollY: y }),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setModelData: (data: any) => set({ modelData: data }),
}));

export default useStore;