import { create } from 'zustand'

interface DateCurrent {
    currentDate: any,
    setCurrentDate: (date: any) => void
}

export const useCurrentPickDate = create<DateCurrent>((set) => ({
    currentDate: new Date(),
    setCurrentDate: (date: any) => set({ currentDate: date })
}))