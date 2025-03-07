"use client";
import EditUserData from "@/components/admin/EditUserData";
import TestCard, { testData } from "@/components/admin/test-card";
import TestDataAdmin from "@/components/admin/test-data-admin";
import { UserType } from "@/components/authorize/authorize-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateTest } from "@/utils/hooks/mutate-hooks/admin/use-create-test";
import { useGetAllTestData } from "@/utils/hooks/query-hooks/admin/use-get-all-test-data";
import { useGetSession } from "@/utils/hooks/query-hooks/sessions/use-get-sessions";
import { useGetUsers } from "@/utils/hooks/query-hooks/users/use-get-all-users";
import { useSessionStore } from "@/utils/store/use-session-store";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

function TestAdmin() {
  const [open, setOpen] = useState(false);
  const [addOption, setAddOption] = useState(false);

  const { data: allUsers, isLoading: usersLoading } = useGetUsers();
  const { mutate: create_test, isPending: creating_test } = useCreateTest();
  const { data: userData, isLoading: userLoading } = useGetSession();
  const { data: testResult, isLoading: testDataLoading } = useGetAllTestData();
  const { user } = useSessionStore();
  const students = useMemo(
    () => allUsers?.users?.filter((u: UserType) => u._id !== user?._id),
    [user, usersLoading, allUsers?.users]
  );


  return (
    <div className="h-[calc(100vh-70px)] lg:h-[calc(100vh-70px)] overflow-y-auto">
        <TestDataAdmin testDatas={testResult?.testData} />
    </div>
  );
}

export default TestAdmin;
