"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Loader, UserPlus } from "lucide-react";
import { OnboardingRequestCard, UserType } from "./authorize-user";
import toast from "react-hot-toast";
import { useGetUnverifiedUsers } from "@/utils/hooks/query-hooks/admin/use-get-unverified-user";
import { useVerifyUser } from "@/utils/hooks/mutate-hooks/admin/use-verify-users";
import { useRejectUser } from "@/utils/hooks/mutate-hooks/admin/use-reject-users";

export default function AuthorizePage() {
  const { data: unverified_users, isLoading: unverified_users_loading } =
    useGetUnverifiedUsers();
  const { mutate: verify_user, isPending: verify_pending } = useVerifyUser();
  const { mutate: reject_user, isPending: reject_pending } = useRejectUser();
  const [requests, setRequests] = useState(unverified_users?.users); // Fetch all the unverified students and teachers
  const [filteredRequest, setFilteredRequests] = useState(requests);
  const [searchTerm, setSearchTerm] = useState("");
  console.log("this is hte unverified user ; ", unverified_users);

  useEffect(() => {
    if (unverified_users_loading) return;
    if (unverified_users?.users) setRequests(unverified_users?.users);
  }, [unverified_users?.users, unverified_users_loading]);

  useEffect(() => {
    if (unverified_users_loading) return;
    const filtered = requests?.filter(
      (request: UserType) =>
        request?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRequests(filtered);
  }, [searchTerm, requests, unverified_users_loading]);

  useEffect(() => {
    if (unverified_users_loading) return;
    if (unverified_users?.users) setRequests(unverified_users?.users);
  }, [unverified_users?.users, unverified_users_loading]);

  console.log("filtered requests : ", filteredRequest);

  const handleAccept = async ({ id }: { id: string }) => {
    if (id) {
      console.log("this is hte user id : ", id);
      verify_user(id, {
        onSuccess: (res) => {
          if (res.message && res.status) {
            toast.success(res.message);
          } else {
            toast.error(res.error);
          }
        },
        onError: (err) => {
          toast.error(err);
        },
      });
    }
  };

  const handleReject = async (id: string) => {
    if (id) {
      console.log("this ishte reject id : ", id);
      reject_user(id, {
        onSuccess: (res) => {
          if (res.message && res.status) {
            toast.success(res.message);
          } else if (res.error) {
            toast.error(res.error);
          }
        },
        onError: (err) => {
          toast.error(err);
        },
      });
    }
  };

  if (unverified_users_loading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader className="size-5 animate-spin text-red-600" />
      </div>
    );

  return (
    <div className=" w-full  h-full  ">
      <div className="flex justify-between items-center ">
        <h1 className="text-3xl font-bold text-red-600">Authorize Requests</h1>
        <Button
          variant="outline"
          size="icon"
          className="relative border-red-400 bg-gray-900 hover:bg-gray-800 hover:text-red-600 text-red-600"
        >
          <Bell className="h-4 w-4" />
          {requests?.length > 0 && (
            <div className="absolute -top-2 -right-1 size-4 bg-rose-500 rounded-full flex items-center justify-center text-white">
              {requests?.length}
            </div>
          )}
        </Button>
      </div>
      <div className="flex flex-col gap-y-6 mt-4">
        <div className="w-full">
          <Input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md bg-gray-900 text-white placeholder:text-red-600 border-gray-700 focus:border-rose-500 focus:ring-rose-500"
          />
        </div>
        <div className="flex justify-center lg:justify-start flex-wrap gap-y-10 gap-x-10">
          {filteredRequest?.map((request: UserType) => (
            <OnboardingRequestCard
              key={request._id}
              request={request}
              onAccept={handleAccept}
              onReject={handleReject}
              rejecting={reject_pending}
              verifying={verify_pending}
            />
          ))}
        </div>
        {filteredRequest?.length === 0 && (
          <div className="text-center mt-16 text-red-600">
            <UserPlus className="mx-auto h-16 w-16 text-red-600" />
            <p className="text-2xl font-semibold text-red-600 mt-4">
              No onboarding requests found
            </p>
            <p className="text-black mt-2">
              New requests will appear here when available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
