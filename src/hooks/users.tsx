// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { IUser, CreateUserData } from "@/types/user";
// import { USER_ROLE, USER_STATUS } from "@/constants";
// import { IResponse } from "@/types/responseError";
// import {
//   fetchUsers,
//   fetchAllUsers,
//   createUser,
//   updateUser,
//   deleteUser,
//   updateUserStatus,
//   fetchUserById,
// } from "@/api/users";
// import {
//   getErrorMessage,
//   hasValidationErrors,
//   getFieldErrors,
//   isSuccessResponse,
// } from "@/api/error";
// import { toast } from "./toast";

// export function useUsers(role?: USER_ROLE) {
//   const [users, setUsers] = useState<IUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const loadUsers = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response: IResponse<IUser[]> = role
//         ? await fetchUsers(role)
//         : await fetchAllUsers();

//       if (isSuccessResponse(response)) {
//         setUsers(response.data);
//       } else {
//         const errorMessage = getErrorMessage(response);
//         setError(errorMessage);
//         toast({
//           title: "Error Loading Users",
//           description: errorMessage,
//           variant: "destructive",
//         });
//       }
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "An unexpected error occurred";
//       setError(errorMessage);
//       toast({
//         title: "Network Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [role]);

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const handleCreateUser = async (
//     userData: CreateUserData
//   ): Promise<{ success: boolean; errors?: { [key: string]: string[] } }> => {
//     try {
//       const response: IResponse<IUser> = await createUser(userData);

//       if (isSuccessResponse(response)) {
//         setUsers((prev) => [...prev, response.data]);
//         toast({
//           title: "Success",
//           description: "User created successfully",
//           variant: "success",
//         });
//         return { success: true };
//       } else {
//         const errorMessage = getErrorMessage(response);

//         // Handle validation errors
//         if (hasValidationErrors(response)) {
//           const fieldErrors = getFieldErrors(response);
//           toast({
//             title: "Validation Error",
//             description: "Please check the form for errors",
//             variant: "destructive",
//           });
//           return { success: false, errors: fieldErrors };
//         }

//         toast({
//           title: "Error",
//           description: errorMessage,
//           variant: "destructive",
//         });
//         return { success: false };
//       }
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Failed to create user";
//       toast({
//         title: "Network Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//       return { success: false };
//     }
//   };

//   const handleUpdateUser = async (
//     userId: string,
//     userData: Partial<CreateUserData>
//   ): Promise<{ success: boolean; errors?: { [key: string]: string[] } }> => {
//     try {
//       const response: IResponse<IUser> = await updateUser(userId, userData);

//       if (isSuccessResponse(response)) {
//         setUsers((prev) =>
//           prev.map((user) => (user.id === userId ? response.data : user))
//         );
//         toast({
//           title: "Success",
//           description: "User updated successfully",
//           variant: "success",
//         });
//         return { success: true };
//       } else {
//         const errorMessage = getErrorMessage(response);

//         // Handle validation errors
//         if (hasValidationErrors(response)) {
//           const fieldErrors = getFieldErrors(response);
//           toast({
//             title: "Validation Error",
//             description: "Please check the form for errors",
//             variant: "destructive",
//           });
//           return { success: false, errors: fieldErrors };
//         }

//         toast({
//           title: "Error",
//           description: errorMessage,
//           variant: "destructive",
//         });
//         return { success: false };
//       }
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Failed to update user";
//       toast({
//         title: "Network Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//       return { success: false };
//     }
//   };

//   const handleDeleteUser = async (userId: string): Promise<boolean> => {
//     try {
//       const response: IResponse<{ message: string }> = await deleteUser(userId);

//       if (isSuccessResponse(response)) {
//         setUsers((prev) => prev.filter((user) => user.id !== userId));
//         toast({
//           title: "Success",
//           description: response.data.message || "User deleted successfully",
//           variant: "success",
//         });
//         return true;
//       } else {
//         const errorMessage = getErrorMessage(response);
//         toast({
//           title: "Error",
//           description: errorMessage,
//           variant: "destructive",
//         });
//         return false;
//       }
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Failed to delete user";
//       toast({
//         title: "Network Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//       return false;
//     }
//   };

//   const handleStatusChange = async (
//     userId: string,
//     status: USER_STATUS
//   ): Promise<boolean> => {
//     try {
//       const response: IResponse<IUser> = await updateUserStatus(userId, status);

//       if (isSuccessResponse(response)) {
//         setUsers((prev) =>
//           prev.map((user) => (user.id === userId ? { ...user, status } : user))
//         );
//         toast({
//           title: "Success",
//           description: `User status updated to ${status.toLowerCase()}`,
//           variant: "success",
//         });
//         return true;
//       } else {
//         const errorMessage = getErrorMessage(response);
//         toast({
//           title: "Error",
//           description: errorMessage,
//           variant: "destructive",
//         });
//         return false;
//       }
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Failed to update user status";
//       toast({
//         title: "Network Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//       return false;
//     }
//   };

//   const getUserById = async (userId: string): Promise<IUser | null> => {
//     try {
//       const response: IResponse<IUser> = await fetchUserById(userId);

//       if (isSuccessResponse(response)) {
//         return response.data;
//       } else {
//         const errorMessage = getErrorMessage(response);
//         toast({
//           title: "Error",
//           description: errorMessage,
//           variant: "destructive",
//         });
//         return null;
//       }
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error ? err.message : "Failed to fetch user";
//       toast({
//         title: "Network Error",
//         description: errorMessage,
//         variant: "destructive",
//       });
//       return null;
//     }
//   };

//   const refreshUsers = () => {
//     loadUsers();
//   };

//   return {
//     users,
//     loading,
//     error,
//     handleCreateUser,
//     handleUpdateUser,
//     handleDeleteUser,
//     handleStatusChange,
//     getUserById,
//     refreshUsers,
//   };
// }
