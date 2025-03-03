import {atom, useAtom} from "jotai"



const modalState = atom(false)

export const useCreateOnboarding = () =>{
    return useAtom(modalState);
}