"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getCurrentUser,
  updateProfile,
  uploadProfileImage,
  changePassword,
} from "@/api/user";
import type { ChangePasswordPayload } from "@/types/user";
import { getToken } from "@/helpers";
import { IUser, UpdateUserPayload } from "@/types/user";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfo from "@/components/profile/ProfileInfo";
import EditProfileForm from "@/components/profile/EditProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";
import LoadingSpinner from "@/components/profile/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfilePage = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [view, setView] = useState<"info" | "edit" | "password">("info");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }
      const response = await getCurrentUser(token);
      if (response.data != null) {
        setUser(response.data);
      } else {
        setError(
          response.error?.displayMessage || "Failed to fetch user profile."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleUpdateProfile = useCallback(
    async (formData: UpdateUserPayload) => {
      try {
        setIsUpdating(true);
        setError(null);
        const response = await updateProfile(formData);
        if (response.data != null) {
          await fetchUserProfile();
          setView("info");
        } else {
          setError(
            response.error?.displayMessage || "Failed to update profile."
          );
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred during the update."
        );
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchUserProfile]
  );

  const handleChangePassword = useCallback(
    async (payload: ChangePasswordPayload) => {
      try {
        setIsUpdating(true);
        setError(null);
        const response = await changePassword(payload);
        if (response.data?.acknowledged) {
          setView("info");
        } else {
          setError(
            response.error?.displayMessage || "Failed to change password."
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        const response = await uploadProfileImage(file);
        if (response.data != null && user) {
          setUser((prev) =>
            prev ? { ...prev, imageUrl: response.data?.imageUrl ?? "" } : null
          );
        } else {
          setError(response.error?.displayMessage || "Failed to upload image.");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to upload image."
        );
      }
    },
    [user]
  );

  const handleToggleEdit = () => {
    setView((prev) => (prev === "edit" ? "info" : "edit"));
    setError(null);
  };

  const handleShowChangePassword = () => {
    setView("password");
    setError(null);
  };

  const handleCancel = () => {
    setView("info");
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="text-center p-8 bg-white shadow-lg border border-gray-200 max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-red-600">
              An Error Occurred
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={fetchUserProfile}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <ProfileHeader
          user={user}
          isEditing={view === "edit"}
          onToggleEdit={handleToggleEdit}
          onImageUpload={handleImageUpload}
          onChangePassword={handleShowChangePassword}
          showImage={false}
        />

        {error && (
          <Card className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg shadow-sm">
            <p className="text-red-700 font-medium">{error}</p>
          </Card>
        )}

        <div>
          {view === "info" && <ProfileInfo user={user} />}
          {view === "edit" && (
            <EditProfileForm
              user={user}
              isUpdating={isUpdating}
              onSubmit={handleUpdateProfile}
              onCancel={handleCancel}
            />
          )}
          {view === "password" && (
            <ChangePasswordForm
              onSubmit={handleChangePassword}
              onCancel={handleCancel}
              isUpdating={isUpdating}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
