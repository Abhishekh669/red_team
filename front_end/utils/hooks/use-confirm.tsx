import React, { useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

const  useConfirm = (
    title : string,
    message : string
) : [() => React.JSX.Element, ()=> Promise<unknown>] =>  {
    const [promise, setPromise] = useState<{resolve:(value:boolean) => void} | null>(null)

    const confirm = () => new Promise((resolve, reject) =>{
        setPromise({resolve})
    })

    const handleClose = () => {
        setPromise(null);
    }

    const handleCancel = () =>{
        promise?.resolve(false)
        handleClose();
    }

    const handleConfirm = () =>{
        promise?.resolve(true);
        handleClose();

    }


    const  ConfirmDialog = () =>(
        <Dialog open={promise !== null} onOpenChange={handleClose}>
            <DialogContent className='bg-gray-900 text-rose-500'>
            <DialogTitle>
                        {title}
                    </DialogTitle>
                <DialogHeader>
                    
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='pt-2'>
                    <Button 
                        onClick={handleCancel}
                        variant={"outline"}
                        className='rounded-[5px]'
                    >
                       Cancel 
                    </Button>
                    <Button onClick={handleConfirm}  
                        className='bg-black text-white hover:bg-black rounded-[5px]'
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )




  return [ConfirmDialog, confirm];
}

export default useConfirm