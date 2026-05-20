import { create } from "zustand"

interface Token {
    token: string | null,
    setToken: (token: any) => void
}

export const useToken = create<Token>((set) => ({
    token: null,
    setToken: (token: any) => ({ token: token })
}))