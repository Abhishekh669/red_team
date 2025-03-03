import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { allFields, onboardingSchema } from "@/types";
import { useOnboarding } from "@/utils/hooks/mutate-hooks/onboarding/use-onboarding";
import * as z from "zod";

interface OnboardingProps {
  onboardingOption: boolean;
  userId: string;
}

type FormData = z.infer<typeof onboardingSchema>;

function OnboardingPage({ onboardingOption, userId }: OnboardingProps) {
  const { mutate: onboard_user, isPending: onboarding } = useOnboarding();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      codeName: "",
      phoneNumber: "",
      address: "",
      qualification: "",
      mainField: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = (values) => {
    if (userId) {
      onboard_user(
        { ...values, userId },
        {
          onSuccess: (res) => {
            if (res.message && res.onboarded_user) {
              toast.success("Onboarded Successfully");
            } else {
              toast.error(res.error);
            }
          },
          onError: () => {
            toast.error("Failed to onboard user");
          },
        }
      );
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <Dialog open={onboardingOption}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border border-gray-800">
            <DialogTitle className="text-rose-400">Onboarding</DialogTitle>
          <DialogHeader>
            <DialogDescription className="text-gray-400">
              Update user details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Code Name
              </label>
              <Input
                className="bg-gray-800 text-white border-gray-700 focus:border-rose-400"
                placeholder="eg: CockyCock"
                {...register("codeName")}
                disabled={onboarding}
              />
              {errors.codeName && (
                <p className="text-sm text-red-500">
                  {errors.codeName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <Input
                className="bg-gray-800 text-white border-gray-700 focus:border-rose-400"
                placeholder="eg: +9812345678"
                {...register("phoneNumber")}
                disabled={onboarding}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Address
              </label>
              <Textarea
                className="bg-gray-800 text-white border-gray-700 focus:border-rose-400"
                placeholder="eg: Pokhara, Bagar"
                {...register("address")}
                disabled={onboarding}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Age
              </label>
              <Input
                className="bg-gray-800 text-white border-gray-700 focus:border-rose-400"
                placeholder="eg: 22"
                {...register("age", { valueAsNumber: true })}
                disabled={onboarding}
                type="number"
              />
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Qualification
              </label>
              <Textarea
                className="bg-gray-800 text-white border-gray-700 focus:border-rose-400"
                placeholder="eg: NEB +2"
                {...register("qualification")}
                disabled={onboarding}
              />
              {errors.qualification && (
                <p className="text-sm text-red-500">
                  {errors.qualification.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Field
              </label>
              <Select 
              value={watch("field")}
              onValueChange={(val  : FormData["field"]) => setValue("field",val) }
              disabled={onboarding}
              >
                <SelectTrigger className="bg-gray-800 text-white border-gray-700 rounded-md px-2 focus:border-rose-400 w-full p-2">
                  <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 text-white">
                  {allFields &&
                    allFields.map((f: string) => (
                      <SelectItem key={f} value={f} className="hover:bg-gray-800">
                        {f}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.field && (
                <p className="text-sm text-red-500">{errors.field.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Main Field
              </label>
              <Input
                className="bg-gray-800 text-white border-gray-700 focus:border-rose-400"
                placeholder="eg: Web Penetration"
                {...register("mainField")}
                disabled={onboarding}
              />
              {errors.mainField && (
                <p className="text-sm text-red-500">
                  {errors.mainField.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-4 bg-rose-700 hover:bg-rose-800 transition-all duration-300 transform hover:scale-105 text-white border border-rose-600"
            >
              {onboarding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </form>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="w-full bg-gray-700 hover:bg-gray-800 transition-all"
                disabled={onboarding}
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OnboardingPage;
