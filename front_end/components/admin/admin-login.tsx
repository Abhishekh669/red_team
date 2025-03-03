"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formSchema } from "@/schemas";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCreateAdmin } from "@/utils/hooks/mutate-hooks/admin/use-create-admin";
import { useGetAdmin } from "@/utils/hooks/query-hooks/admin/use-get-admin";
import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
import axios from "axios";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const {data : session} = useGetSession()
  console.log("this is hte session : ", session)
  const { data: admin_data, isLoading: admin_loading } = useGetAdmin();
  const { mutate: create_admin, isPending : creating } = useCreateAdmin();
  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const create = admin_data?.all_admin == 0 ? true : false;


  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("this is values ", values)
     const new_values  = {
      ...values,
      userId : session?.user._id as string
    }
    setLoading(true)
    try {
    if(create){
      create_admin(new_values,{
        onSuccess : (res) =>{
          if(res.admin_data && res.message){
              toast.success("You can now login")
          } else{
            toast.error(res.error)
          }
        },
        onError : () =>{
          toast.error("Failed to create")
        }
      })

    }else{
      axios.post("/api/admin/login",new_values)
      .then((res) =>{
        if(res.data.message === "Logged in successfully" && res.data.success === true){
          toast.success("Successfully logged in ")
          router.push("/dashboard")
          
        }else{
          toast.error(res.data.error || "failed to login")
        }
          
      })
      // login_admin(new_values,{
      //   onSuccess : (res) =>{
      //     if(res.success && res.message){
      //         toast.success("Successfully logged in")
      //         router.push("/dashboard")

      //     } else{
      //       toast.error(res.error)
      //     }
      //   },
      //   onError : () =>{
      //     toast.error("Failed to create")
      //   }
      // })
    }
  } catch (error) {
    toast.error(`something went wrong :${error} `)
    
  }finally{
    setLoading(false)
    form.reset();

  }


  }

  if (admin_loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-black to-gray-900">
        <Loader className="size-5 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-rose-900 to-black">
      <div className="w-full max-w-md bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
        <div className="p-8 flex flex-col gap-y-4">
          <h2 className="text-2xl font-semibold text-center text-rose-400 mb-6">
            {create ? "Register" : "Login"}
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input className="bg-gray-800 text-white border-gray-700 focus:border-rose-400" placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <FormControl>
                      <Input type="password" className="bg-gray-800 text-white border-gray-700 focus:border-rose-400" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full mt-8 bg-rose-700 hover:bg-rose-800 transition-all duration-300 transform hover:scale-105 text-white border border-rose-600"
                disabled={loading}
              >
                {(loading) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {creating ? "Creating..." : "Logging in..."}
                  </>
                ) : (
                  <>{creating ? "Register" : "Log in"}</>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
