"use client";

import { useEffect, useState } from "react";
import { notFound, useSearchParams } from "next/navigation";
import WeeklyEntryManager from "@/components/daily-entry/WeeklyEntryManager";
import { IKraProgress } from "@/types/assignment";
import { getOneProgress } from "@/api/kra";
import { Loader2 } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";
import { USER_ROLE } from "@/constants";

export default function DailyEntryPage() {
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<IKraProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const user = useAuthStore();
  const kra = searchParams.get("kra");
  const employee = searchParams.get("employee");
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));

  useEffect(() => {
    async function fetchAssignment() {
      // validate first
      if (!kra || !employee || !month || !year) {
        setError("Missing required params");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await getOneProgress({ kra, employee, month, year });
        if (res.data) {
          setAssignment(res.data);
        } else {
          setError("No assignment data found");
        }
      } catch (err) {
        console.error("Failed to fetch assignment:", err);
        setError("Failed to load assignment data");
      } finally {
        setLoading(false);
      }
    }
    fetchAssignment();
  }, [kra, employee, month, year]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!assignment || !assignment.id) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <WeeklyEntryManager
        initialAssignment={assignment}
        userRole={user.user?.role || USER_ROLE.USER}
        user={user.user!}
      />
    </div>
  );
}
