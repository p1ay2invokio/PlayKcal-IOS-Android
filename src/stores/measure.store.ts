import { create } from 'zustand'

interface UserState {
    current: any;
    sex: any;
    dob: any;
    height: any;
    weight: any;
    targetWeight: any
    fast: any;
    goal: any;
}

interface UserActions {
    setSex: (sex: string) => void;
    setDob: (dob: any) => void;
    setHeight: (height: number) => void;
    setWeight: (weight: number) => void;
    setTargetWeight: (targetDay: number) => void;
    nextPage: (page?: number) => void;
    previousPage: () => void
    setFast: (kg_perweek: number) => void
    setGoal: (goal: string) => void
    setCurrent: (to: any) => void
}

type UserStore = UserState & UserActions;


export const useMeasureStore = create<UserStore>((set) => ({
    current: 0,
    sex: null,
    dob: new Date().toISOString(),
    height: 150,
    weight: 60,
    targetWeight: 60,
    fast: 0.8,
    goal: null,
    setDob: (dob: any) => set({ dob: dob }),
    setSex: (sex: string) => set({ sex: sex }),
    setHeight: (height: number) => set({ height: height }),
    setWeight: (weight: number) => set({ weight: weight }),
    setTargetWeight: (targetWeight: number) => set({ targetWeight: targetWeight }),
    nextPage: (page?: number) => set((state: any) => ({ current: page ? state.current + page : state.current + 1 })),
    previousPage: () => set((state: any) => ({ current: state.current - 1 })),
    setFast: (kg_perweek: number) => set({ fast: kg_perweek }),
    setGoal: (goal: string) => set({ goal: goal }),
    setCurrent: (to: 0) => set({ current: to })
}))