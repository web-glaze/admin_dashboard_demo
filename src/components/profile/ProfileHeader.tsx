"use client";

import type React from "react";
import { useRef } from "react";
import Image from "next/image";
import type { IUser } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface ProfileHeaderProps {
  user: IUser;
  isEditing: boolean;
  onToggleEdit: () => void;
  onImageUpload: (file: File) => void;
  onChangePassword: () => void;
  showImage?: boolean; // Added this line
}

const ProfileHeader = ({ 
  user, 
  isEditing, 
  onToggleEdit, 
  onImageUpload, 
  onChangePassword,
  showImage = false // Added this line with default false
}: ProfileHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "UN";
    return name
      .split(" ")
      .map((part) => part[0] || "")
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="w-full bg-white shadow-md border-l-4 border-indigo-600 rounded-lg p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {showImage && ( // Added this condition
          <div className="relative group flex-shrink-0">
            <div
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 duration-300 shadow-lg"
              onClick={handleImageClick}
            >
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl ?? "/placeholder.png"}
                  alt={user.name ?? "User"}
                  className="w-full h-full object-cover"
                  fill
                  sizes="(max-width: 144px) 100vw, 144px"
                  style={{ objectFit: "cover" }}
                  priority
                />
              ) : (
                <span className="text-white text-3xl sm:text-4xl font-bold tracking-wider">{getInitials(user.name)}</span>
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        )} {/* Added closing condition */}

        <div className="flex-1 text-center sm:text-left w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.name ?? "Unnamed User"}</h1>
              <p className="text-lg text-indigo-600 font-semibold mb-1">{user.designation ?? "No Designation"}</p>
              <p className="text-gray-500">{user.department ?? "No Department"}</p>
              {user.mail && <p className="text-gray-500 mt-1 text-sm">{user.mail}</p>}
            </div>
            
            <div className="flex flex-col items-center sm:items-end gap-3 flex-shrink-0">
              {isEditing ? (
                <Button
                  onClick={onToggleEdit}
                  variant="outline"
                  className="w-full sm:w-auto px-6 py-2 rounded-lg transition-colors duration-200 text-gray-700 border-gray-300 hover:bg-gray-100"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </span>
                </Button>
              ) : (
                <div className="flex flex-col gap-3 w-full sm:w-auto">
                  <Button
                    onClick={onToggleEdit}
                    variant="default"
                    className="w-full sm:w-auto px-6 py-2 rounded-lg transition-colors duration-200 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </span>
                  </Button>
                  <Button
                    onClick={onChangePassword}
                    variant="outline"
                    className="w-full sm:w-auto px-6 py-2 rounded-lg transition-colors duration-200 text-gray-700 border-gray-300 hover:bg-gray-100"
                  >
                    Change Password
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6 justify-center sm:justify-start pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{user.employeeNumber ?? "N/A"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{user.workCity && user.workCountry ? `${user.workCity}, ${user.workCountry}` : "No Location"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1h-2v2a1 1 0 01-1 1H8a1 1 0 01-1-1v-2H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
              </svg>
              <span>{user.dateOfJoining ? `Joined ${new Date(user.dateOfJoining).toLocaleDateString()}` : "No Join Date"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
