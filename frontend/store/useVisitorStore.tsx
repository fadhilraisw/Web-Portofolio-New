import { create } from 'zustand';

interface VisitorData {
  name: string;
  age: string;
  position: string;
  company: string;
  goal: string;
  email: string;
}

interface VisitorStore {
  visitor: VisitorData;
  setVisitorData: (data: Partial<VisitorData>) => void;
}

export const useVisitorStore = create<VisitorStore>((set) => ({
  visitor: {
    name: '', age: '', position: '', company: '', goal: '', email: ''
  },
  setVisitorData: (data) => 
    set((state) => ({ visitor: { ...state.visitor, ...data } })),
}));