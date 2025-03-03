import { AbsentRequestType } from "@/components/admin/absent-card"
import { create } from "zustand"


type AbsetnAdminData = {
    absentRequestsData: AbsentRequestType[] | [],
    setAbsentRequestsData: (data: AbsentRequestType[]) => void
}



export const useAbsentAdminStore = create<AbsetnAdminData>((set, get) => ({
    absentRequestsData: [],
    setAbsentRequestsData: (data: AbsentRequestType[]) => set((state) => ({
        absentRequestsData : data
       // Initialize with the new data if it's null
    }))
}))
