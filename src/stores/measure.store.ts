import { create } from 'zustand'

interface UserState {
    current: any;
    sex: any;
    dob: any;
    height: any;
    weight: any;
    fast: any;
}

interface UserActions {
    setSex: (sex: string) => void;
    setDob: (dob: any) => void;
    setHeight: (height: number) => void;
    setWeight: (weight: number) => void;
    nextPage: (page?: number) => void;
    previousPage: () => void
    setFast: (kg_perweek: number) => void
    setCurrent: (to: any) => void;
    reset: () => void
}

type UserStore = UserState & UserActions;


const getMaxDate = () => {
    const date = new Date()
    console.log("BEFORE : ", date.getFullYear())  // 2026
    date.setFullYear(date.getFullYear() - 15)
    console.log("AFTER : ", date.getFullYear())   // 2011
    return date
}


export const useMeasureStore = create<UserStore>((set) => ({
    current: 0,
    sex: 'male',
    dob: getMaxDate().toISOString(),
    height: 150,
    weight: 40,
    fast: 300,
    setDob: (dob: any) => set({ dob: dob }),
    setSex: (sex: string) => set({ sex: sex }),
    setHeight: (height: number) => set({ height: height }),
    setWeight: (weight: number) => set({ weight: weight }),
    nextPage: (page?: number) => set((state: any) => ({ current: page ? state.current + page : state.current + 1 })),
    previousPage: () => set((state: any) => ({ current: state.current - 1 })),
    setFast: (kg_perweek: number) => set({ fast: kg_perweek }),
    setCurrent: (to: 0) => set({ current: to }),
    reset: () => set({
        current: 0,
        sex: 'male',
        dob: getMaxDate().toISOString(),
        height: 150,
        weight: 40,
        fast: 300,
    })
}))