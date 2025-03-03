import { UserType } from "@/components/authorize/authorize-user"
import {create} from  "zustand"
interface SessionStoreType{
    user : UserType | null,
    setSession : (user : UserType) => void,
}


export const useSessionStore = create<SessionStoreType>((set, get)=>{
    return {
        user : null,
        setSession : (user : UserType) => set({user})
    }
})