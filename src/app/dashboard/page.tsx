"use client";

import { dashboardData } from "@/api/dashboard";
import { IDashboardData } from "@/types/dashboard";
import React, { useEffect, useState } from "react";
import {
  Users,
  Shield,
  Briefcase,
  Settings,
  Building,
  UserCheck,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const Dashboard = () => {
  const [data, setData] = useState<IDashboardData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardData();
        if (response.data) {
          // console.log("Dashboard Data:", response.data);
          setData(response.data);
        } else {
          console.error("No data received");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const LoadingSkeletons = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-3" />
          <Skeleton className="h-5 w-96" />
        </div>

        {/* Main Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Roles Skeleton */}
        <Card className="p-6">
          <CardHeader className="p-0 mb-6">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="p-4">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-3">
                      <Skeleton className="h-5 w-5 rounded" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                    <Skeleton className="h-8 w-12 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSkeletons />;
  }

  const userRoleData = [
    {
      label: "Admins",
      value: data?.usersCount.admins || 0,
      icon: Shield,
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-50 to-pink-50",
      iconBg: "bg-gradient-to-br from-red-100 to-pink-100",
      textColor: "text-red-600",
      description: "System administrators",
    },

    {
      label: "Partners",
      value: data?.usersCount.partners || 0,
      icon: Briefcase,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-gradient-to-br from-emerald-100 to-teal-100",
      textColor: "text-emerald-600",
      description: "Business partners",
      link: "/dashboard/team/partner",
    },
    {
      label: "Managers",
      value: data?.usersCount.managers || 0,
      icon: Settings,
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50",
      iconBg: "bg-gradient-to-br from-purple-100 to-indigo-100",
      textColor: "text-purple-600",
      description: "Team managers",
      link: "/dashboard/team/manager",
    },
    {
      label: "Employees",
      value: data?.usersCount.users || 0,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-gradient-to-br from-blue-100 to-cyan-100",
      textColor: "text-blue-600",
      description: "Regular Employees",
      link: "/dashboard/team/employee",
    },
  ];

  const totalUsers = Object.values(data?.usersCount || {}).reduce(
    (sum, count) => sum + count,
    0
  );

  const mainStats = [
    {
      title: "Total Entities",
      value: data?.totalentities || 0,
      icon: Building,
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-50 to-indigo-50",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Total Users",
      value: totalUsers,
      icon: UserCheck,
      gradient: "from-emerald-600 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Total Groups",
      value: data?.totalGropus || 0,
      icon: Users,
      gradient: "from-purple-600 to-indigo-600",
      bgGradient: "from-purple-50 to-indigo-50",
      change: "+5%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
          </div>
          <p className="text-slate-600 text-lg">
            Welcome back! Here&#39;s what&#39;s happening with your
            organization.
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {mainStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`group transition-all duration-500 border-0 bg-gradient-to-br ${stat.bgGradient} 
  hover:scale-105 hover:shadow-[0_10px_35px_rgba(0,0,0,0.15)] rounded-2xl overflow-hidden relative mx-3 my-4`}
              >
                {/* Soft overlay & glow on hover */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-[1px]" />

                <CardContent className="p-8 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-3 tracking-wide">
                        {stat.title}
                      </p>
                      <p className="text-4xl font-extrabold text-slate-900 mb-1 tracking-tight drop-shadow-sm">
                        {stat.value.toLocaleString()}
                      </p>
                    </div>

                    <div
                      className={`p-4 bg-gradient-to-br ${stat.gradient} rounded-2xl shadow-md 
        group-hover:shadow-[0_6px_25px_rgba(0,0,0,0.25)] transition-all duration-500 border border-white/20 backdrop-blur-sm`}
                    >
                      <Icon className="h-8 w-8 text-white drop-shadow-md" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* User Roles Breakdown */}
        <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                User Roles Distribution
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userRoleData.map((role, index) => {
                const Icon = role.icon;
                const percentage =
                  totalUsers > 0
                    ? ((role.value / totalUsers) * 100).toFixed(1)
                    : "0";

                return (
                  <Link href={role?.link || ""} key={index}>
                    <Card
                      key={index}
                      className={`group transition-all duration-500 border-0 bg-gradient-to-br ${role.bgGradient} 
  relative overflow-hidden hover:scale-105 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] rounded-2xl mx-1 my-2`}
                    >
                      {/* Hover overlay effect */}
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-[1px]" />

                      <CardContent className="px-6 py-6 relative">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`p-4 rounded-b-md ${role.iconBg} shadow-md border border-white/20 backdrop-blur-sm`}
                          >
                            <Icon className={`h-6 w-6 ${role.textColor}`} />
                          </div>
                          {/* <Badge
        variant="outline"
        className={`${role.textColor} border-current`}
      >
        {percentage}%
      </Badge> */}
                        </div>

                        <div className="space-y-2">
                          <p className="text-4xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">
                            {role.value.toLocaleString()}
                          </p>
                          <p className="text-lg font-semibold text-slate-700 tracking-wide">
                            {role.label}
                          </p>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            {role.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
