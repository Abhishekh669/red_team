import { create } from "zustand";

interface AdminStoreType{
    AdminStatus: boolean | null,
    setAdmin : (status : boolean) => void
}


export const useAdminStore = create<AdminStoreType>((set, get)=>{
    return {
        AdminStatus : null,
        setAdmin :(status : boolean) => set({AdminStatus : status})
    }
})