"use client";

import React, { useState, useRef, useEffect } from "react";
import { type IUser, type UpdateUserPayload, USER_ROLE } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, User, Mail, Phone, Briefcase, Building, MapPin, Key } from "lucide-react";

interface EditProfileFormProps {
  user: IUser;
  isUpdating: boolean;
  onSubmit: (data: UpdateUserPayload) => void;
  onCancel: () => void;
}

interface EditableFields {
  name?: boolean;
  phoneNumber?: boolean;
  mail?: boolean;
  designation?: boolean;
  department?: boolean;
  workCity?: boolean;
  workCountry?: boolean;
  employeeNumber?: boolean;
  managerCode?: boolean;
}

interface FormData {
  [key: string]: string;
}

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  icon,
  required = false,
  disabled = false,
  value,
  onChange,
  error,
  editable,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  editable: boolean;
}) => {
  if (!editable) return null;

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
        <Input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={name === "mail" ? "email" : name === "phoneNumber" ? "tel" : name}
          className={`pl-10 truncate ${error ? "border-red-500" : ""}`}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

const getEditableFields = (role: USER_ROLE): EditableFields => {
  switch (role) {
    case USER_ROLE.ADMIN:
      return { name: true, phoneNumber: true, mail: true, designation: true, department: true, workCity: true, workCountry: true, employeeNumber: true, managerCode: true };
    case USER_ROLE.MANAGER:
      return { name: true, phoneNumber: true, mail: true, designation: true, department: true, workCity: true, workCountry: true, managerCode: true };
    case USER_ROLE.PARTNER:
      return { name: true, phoneNumber: true, mail: true, designation: true, workCity: true, workCountry: true };
    case USER_ROLE.EMPLOYEE:
    case USER_ROLE.USER:
    default:
      return { name: true, phoneNumber: true };
  }
};

const EditProfileForm = ({ user, isUpdating, onSubmit, onCancel }: EditProfileFormProps) => {
  const editableFields = getEditableFields(user.role);
  const lastUserIdRef = useRef<string>(user.id);

  const getInitialFormData = (): FormData => {
    const initialData: FormData = {};
    if (editableFields.name) initialData.name = user.name || "";
    if (editableFields.phoneNumber) initialData.phoneNumber = user.phoneNumber || "";
    if (editableFields.mail) initialData.mail = user.mail || "";
    if (editableFields.designation) initialData.designation = user.designation || "";
    if (editableFields.department) initialData.department = user.department || "";
    if (editableFields.workCity) initialData.workCity = user.workCity || "";
    if (editableFields.workCountry) initialData.workCountry = user.workCountry || "";
    if (editableFields.employeeNumber) initialData.employeeNumber = user.employeeNumber || "";
    if (editableFields.managerCode) initialData.managerCode = user.managerCode || "";
    return initialData;
  };

  const [formData, setFormData] = useState<FormData>(getInitialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user.id !== lastUserIdRef.current) {
      lastUserIdRef.current = user.id;
      setFormData(getInitialFormData());
      setErrors({});
    }
  }, [user.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (editableFields.name && !formData.name?.trim()) newErrors.name = "Name is required";
    else if (editableFields.name && formData.name?.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
    if (editableFields.phoneNumber && formData.phoneNumber?.trim() && !/^[+]?[\d\s-]+$/.test(formData.phoneNumber)) newErrors.phoneNumber = "Please enter a valid phone number";
    if (editableFields.mail && formData.mail?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.mail)) newErrors.mail = "Please enter a valid email address";
    if (editableFields.employeeNumber && formData.employeeNumber?.trim().length < 3) newErrors.employeeNumber = "Employee number must be at least 3 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData: UpdateUserPayload = {};
    const userRecord = user as unknown as Record<string, unknown>;
    const submitRecord = submitData as unknown as Record<string, unknown>;

    Object.keys(formData).forEach((key) => {
      if (editableFields[key as keyof EditableFields] && formData[key]?.toString().trim() !== userRecord[key]) {
        submitRecord[key] = formData[key]?.toString().trim();
      }
    });

    if (Object.keys(submitData).length > 0) {
      onSubmit(submitData);
    } else {
      onCancel();
    }
  };

  return (
    <Card className="w-full bg-white shadow-md border-l-4 border-teal-500">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Edit Profile</CardTitle>
        <p className="text-sm text-gray-500">Update your personal and work details below.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Full Name"
              name="name"
              placeholder="Your full name"
              required
              icon={<User className="w-5 h-5" />}
              value={formData.name || ""}
              onChange={handleInputChange}
              error={errors.name}
              editable={editableFields.name ?? false}
            />
            <InputField
              label="Email Address"
              name="mail"
              type="email"
              placeholder="your@email.com"
              icon={<Mail className="w-5 h-5" />}
              value={formData.mail || ""}
              onChange={handleInputChange}
              error={errors.mail}
              editable={editableFields.mail ?? false}
            />
            <InputField
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              placeholder="+1 (555) 123-4567"
              icon={<Phone className="w-5 h-5" />}
              value={formData.phoneNumber || ""}
              onChange={handleInputChange}
              error={errors.phoneNumber}
              editable={editableFields.phoneNumber ?? false}
            />
            <InputField
              label="Designation"
              name="designation"
              placeholder="e.g., Software Engineer"
              icon={<Briefcase className="w-5 h-5" />}
              value={formData.designation || ""}
              onChange={handleInputChange}
              error={errors.designation}
              editable={editableFields.designation ?? false}
            />
            <InputField
              label="Department"
              name="department"
              placeholder="e.g., Technology"
              icon={<Building className="w-5 h-5" />}
              value={formData.department || ""}
              onChange={handleInputChange}
              error={errors.department}
              editable={editableFields.department ?? false}
            />
            <InputField
              label="Work City"
              name="workCity"
              placeholder="e.g., New York"
              icon={<MapPin className="w-5 h-5" />}
              value={formData.workCity || ""}
              onChange={handleInputChange}
              error={errors.workCity}
              editable={editableFields.workCity ?? false}
            />
            <InputField
              label="Work Country"
              name="workCountry"
              placeholder="e.g., USA"
              icon={<MapPin className="w-5 h-5" />}
              value={formData.workCountry || ""}
              onChange={handleInputChange}
              error={errors.workCountry}
              editable={editableFields.workCountry ?? false}
            />
            <InputField
              label="Employee Number"
              name="employeeNumber"
              placeholder="e.g., EMP123"
              icon={<Key className="w-5 h-5" />}
              value={formData.employeeNumber || ""}
              onChange={handleInputChange}
              error={errors.employeeNumber}
              editable={editableFields.employeeNumber ?? false}
            />
            <InputField
              label="Manager Code"
              name="managerCode"
              placeholder="e.g., MGR456"
              icon={<Key className="w-5 h-5" />}
              value={formData.managerCode || ""}
              onChange={handleInputChange}
              error={errors.managerCode}
              editable={editableFields.managerCode ?? false}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button
              type="button"
              onClick={onCancel}
              disabled={isUpdating}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="w-full sm:w-auto flex-1 bg-teal-600 hover:bg-teal-700"
            >
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProfileForm;