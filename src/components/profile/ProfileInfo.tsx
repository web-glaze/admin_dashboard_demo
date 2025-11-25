"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IUser } from "@/types/user";
import { USER_ROLE, USER_STATUS, USER_VERIFICATION_STATUS } from "@/constants";
import { User, Mail, Phone, Briefcase, Building, MapPin, Calendar, Key, Shield, Clock, Users } from "lucide-react";

interface ProfileInfoProps {
  user: IUser;
}

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Not provided";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const InfoItem = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: React.ReactNode;
    icon: React.ReactNode;
  }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
      <div className="text-gray-500 mt-1 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <dt className="text-sm font-medium text-gray-600 mb-1">{label}</dt>
        <dd className="text-base font-medium text-gray-900 truncate">{value || "Not provided"}</dd>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Card 1: Personal Information */}
      <Card className="w-full bg-white shadow-md border-l-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="Full Name"
              value={user.name ?? "Unnamed User"}
              icon={<User className="w-5 h-5" />}
            />
            <InfoItem
              label="Email Address"
              value={user.mail}
              icon={<Mail className="w-5 h-5" />}
            />
            <InfoItem
              label="Phone Number"
              value={user.phoneNumber}
              icon={<Phone className="w-5 h-5" />}
            />
            <InfoItem
              label="Employee Number"
              value={user.employeeNumber}
              icon={<Key className="w-5 h-5" />}
            />
          </dl>
        </CardContent>
      </Card>

      {/* Card 2: Work Information */}
      <Card className="w-full bg-white shadow-md border-l-4 border-green-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Work Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="Designation"
              value={user.designation}
              icon={<Briefcase className="w-5 h-5" />}
            />
            <InfoItem
              label="Department"
              value={user.department}
              icon={<Building className="w-5 h-5" />}
            />
            <InfoItem
              label="Work Location"
              value={user.workCity && user.workCountry ? `${user.workCity}, ${user.workCountry}` : "Not provided"}
              icon={<MapPin className="w-5 h-5" />}
            />
            <InfoItem
              label="Date of Joining"
              value={formatDate(user.dateOfJoining)}
              icon={<Calendar className="w-5 h-5" />}
            />
            <InfoItem
              label="Manager Code"
              value={user.managerCode}
              icon={<Key className="w-5 h-5" />}
            />
            <InfoItem
              label="Employee Manager"
              value={typeof user.employeeManager === "string" ? user.employeeManager : user.employeeManager?.name}
              icon={<Users className="w-5 h-5" />}
            />
            <InfoItem
              label="Entity"
              value={typeof user.entity === "string" ? user.entity : user.entity?.name || "Not assigned"}
              icon={<Building className="w-5 h-5" />}
            />
            <InfoItem
              label="Group"
              value={typeof user.group === "string" ? user.group : user.group?.name || "Not assigned"}
              icon={<Users className="w-5 h-5" />}
            />
          </dl>
        </CardContent>
      </Card>

      {/* Card 3: Account Information */}
      <Card className="w-full bg-white shadow-md border-l-4 border-indigo-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem
              label="Role"
              value={
                <Badge variant={user.role === USER_ROLE.ADMIN ? "default" : "secondary"}>
                  {user.role}
                </Badge>
              }
              icon={<Shield className="w-5 h-5" />}
            />
            <InfoItem
              label="Status"
              value={
                <Badge variant={user.status === USER_STATUS.ACTIVE ? "default" : "destructive"}>
                  {user.status}
                </Badge>
              }
              icon={<Shield className="w-5 h-5" />}
            />
            <InfoItem
              label="Verification Status"
              value={
                <Badge variant={user.verificationStatus === USER_VERIFICATION_STATUS.VERIFIED ? "default" : "secondary"}>
                  {user.verificationStatus}
                </Badge>
              }
              icon={<Shield className="w-5 h-5" />}
            />
            <InfoItem
              label="Last Login"
              value={formatDate(user.lastLoginAt)}
              icon={<Clock className="w-5 h-5" />}
            />
            {user.createdAt && (
              <InfoItem
                label="Account Created"
                value={formatDate(user.createdAt)}
                icon={<Calendar className="w-5 h-5" />}
              />
            )}
            {user.updatedAt && (
              <InfoItem
                label="Last Updated"
                value={formatDate(user.updatedAt)}
                icon={<Clock className="w-5 h-5" />}
              />
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileInfo;