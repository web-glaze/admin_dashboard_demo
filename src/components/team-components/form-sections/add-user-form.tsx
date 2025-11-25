"use client";

import { useState, useEffect } from "react";
import { CreateUserData, IUser } from "@/types/user";
import { USER_ROLE, USER_STATUS } from "@/constants";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Briefcase,
  Building,
  Users,
  User,
  TypeIcon as type,
  type LucideIcon,
} from "lucide-react";
import { FormHeader } from "./form-header";
import { PersonalInfoSection } from "./personal-info-section";
import { ContactInfoSection } from "./contact-info-section";
import { ProfessionalInfoSection } from "./professional-info-section";
import { AdditionalInfoSection } from "./additional-info-section";
import { FormFooter } from "./form-footer";

interface AddUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userData: CreateUserData) => void;
  defaultRole?: USER_ROLE;
  editingUser?: IUser | null;
  isEditing?: boolean;
  users: IUser[]; // <-- add this line!
}

interface RoleConfig {
  title: string;
  description: string;
  requiredFields: string[];
  optionalFields: string[];
  color: string;
  icon: LucideIcon;
}

const roleConfigs: Record<USER_ROLE, RoleConfig> = {
  [USER_ROLE.USER]: {
    title: "Add New Employee",
    description:
      "Create a new employee account with standard access permissions",
    requiredFields: [
      "name",
      "employeeNumber",
      "designation",
      "group",
      "dateOfJoining",
      "workCity",
      "workCountry",
      "department",
    ],
    optionalFields: [
      "mail",
      "phoneNumber",
      "entity",
      "imageUrl",
      "employeeManager",
      "managerCode",
      "status",
    ],
    color:
      "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-300",
    icon: Briefcase,
  },
  [USER_ROLE.MANAGER]: {
    title: "Add New Manager",
    description:
      "Create a manager account with team oversight and elevated permissions",
    requiredFields: [
      "name",
      "employeeNumber",
      "designation",
      "group",
      "mail",
      "dateOfJoining",
      "workCity",
      "workCountry",
      "department",
    ],
    optionalFields: [
      "phoneNumber",
      "entity",
      "imageUrl",
      "employeeManager",
      "managerCode",
      "status",
    ],
    color:
      "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/20 dark:border-purple-800 dark:text-purple-300",
    icon: Users,
  },
  [USER_ROLE.PARTNER]: {
    title: "Add New Partner",
    description:
      "Create a partner account for strategic business collaboration",
    requiredFields: [
      "name",
      "employeeNumber",
      "designation",
      "group",
      "mail",
      "entity",
      "dateOfJoining",
      "workCity",
      "workCountry",
      "department",
    ],
    optionalFields: [
      "phoneNumber",
      "imageUrl",
      "employeeManager",
      "managerCode",
      "status",
    ],
    color:
      "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-300",
    icon: Building,
  },
  [USER_ROLE.ADMIN]: {
    title: "Add New Admin",
    description:
      "Create an administrator account with comprehensive system access",
    requiredFields: [
      "name",
      "employeeNumber",
      "designation",
      "group",
      "mail",
      "dateOfJoining",
      "workCity",
      "workCountry",
      "department",
    ],
    optionalFields: [
      "phoneNumber",
      "entity",
      "imageUrl",
      "employeeManager",
      "managerCode",
      "status",
    ],
    color:
      "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-300",
    icon: User,
  },
};

export function AddUserForm({
  open,
  onOpenChange,
  onSubmit,
  defaultRole = USER_ROLE.USER,
  editingUser,
  isEditing,
  users,
}: AddUserFormProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    mail: "",
    phoneNumber: "",
    password: "",
    employeeNumber: "",
    designation: "",
    entity: "",
    group: "",
    role: defaultRole,
    imageUrl: "",
    employeeManager: "",
    dateOfJoining: "",
    managerCode: "",
    workCity: "",
    workCountry: "",
    department: "",
    status: USER_STATUS.ACTIVE,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Update form data when editing user changes
  useEffect(() => {
    if (editingUser) {
      setFormData({
        name: editingUser.name || "",
        mail: editingUser.mail || "",
        phoneNumber: editingUser.phoneNumber || "",
        // password: editingUser.password || "",
        employeeNumber: editingUser.employeeNumber || "",
        designation: editingUser.designation || "",
        entity:
          typeof editingUser.entity === "string"
            ? editingUser.entity
            : editingUser.entity?.id || "",
        group:
          typeof editingUser.group === "string"
            ? editingUser.group
            : editingUser.group?.id || "",
        role: editingUser.role || defaultRole,
        imageUrl: editingUser.imageUrl || "",
        employeeManager:
          typeof editingUser.employeeManager === "string"
            ? editingUser.employeeManager
            : editingUser.employeeManager?.id || "",
        dateOfJoining: editingUser.dateOfJoining || "",
        managerCode: editingUser.managerCode || "",
        workCity: editingUser.workCity || "",
        workCountry: editingUser.workCountry || "",
        department: editingUser.department || "",
        status: editingUser.status || USER_STATUS.ACTIVE,
      });
      setTouched({});
      setErrors({});
      setServerErrors({});
    } else {
      resetForm();
    }
  }, [editingUser, defaultRole]);

  const getCurrentRoleConfig = (): RoleConfig => {
    return roleConfigs[formData.role] || roleConfigs[USER_ROLE.USER];
  };

  const currentRoleConfig = getCurrentRoleConfig();

  const validateField = (
    field: keyof CreateUserData,
    value: string
  ): string => {
    const { requiredFields } = currentRoleConfig;

    // Check if field is required and empty
    if (requiredFields.includes(field) && (!value || !value.trim())) {
      return `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } is required for ${formData.role.toLowerCase()}s`;
    }

    // Skip validation for empty optional fields
    if (!value && !requiredFields.includes(field)) {
      return "";
    }

    // Specific validations for filled fields
    switch (field) {
      case "mail":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Please enter a valid email address";
        }
        break;
      case "phoneNumber":
        if (
          value &&
          !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[-\s]/g, ""))
        ) {
          return "Please enter a valid phone number";
        }
        break;
      case "name":
        if (value && value.length < 2) {
          return "Name must be at least 2 characters long";
        }
        if (value && !/^[a-zA-Z\s.]+$/.test(value)) {
          return "Name should only contain letters, spaces, and periods";
        }
        break;
      case "employeeNumber":
        if (value && value.length < 3) {
          return "Employee number must be at least 3 characters long";
        }
        break;
      case "designation":
        if (value && value.length < 2) {
          return "Designation must be at least 2 characters long";
        }
        break;
      case "group":
        if (value && value.length < 2) {
          return "Group name must be at least 2 characters long";
        }
        break;
      case "department":
        if (value && value.length < 2) {
          return "Department name must be at least 2 characters long";
        }
        break;
      case "workCity":
        if (value && value.length < 2) {
          return "Work city must be at least 2 characters long";
        }
        break;
      case "workCountry":
        if (value && value.length < 2) {
          return "Work country must be at least 2 characters long";
        }
        break;
      case "managerCode":
        if (value && value.length < 3) {
          return "Manager code must be at least 3 characters long";
        }
        break;
      case "dateOfJoining":
        if (
          value &&
          !/^\d{4}-\d{2}-\d{2}$/.test(value) &&
          !/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(value)
        ) {
          return "Please enter a valid date (YYYY-MM-DD or DD-MMM-YYYY)";
        }
        break;
      case "entity":
        if (value && value.length < 2) {
          return "Entity name must be at least 2 characters long";
        }
        break;
    }

    return "";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const { requiredFields } = currentRoleConfig;

    // Only validate required fields for errors
    requiredFields.forEach((field) => {
      const fieldKey = field as keyof CreateUserData;
      const value = formData[fieldKey]?.toString() || "";
      const error = validateField(fieldKey, value);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Validate filled optional fields
    Object.keys(formData).forEach((field) => {
      const fieldKey = field as keyof CreateUserData;
      const value = formData[fieldKey]?.toString() || "";

      // Skip required fields (already validated above) and empty optional fields
      if (!requiredFields.includes(field) && value) {
        const error = validateField(fieldKey, value);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark required fields as touched
    const newTouched: Record<string, boolean> = { ...touched };
    currentRoleConfig.requiredFields.forEach((field) => {
      newTouched[field] = true;
    });
    setTouched(newTouched);

    if (!validateForm()) {
      const firstErrorField = document.querySelector('[data-error="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    setServerErrors({});

    try {
      // Clone form data
      let payload = { ...formData };

      // ✅ If role is PARTNER → add employeeManager
      if (formData.role === USER_ROLE.PARTNER) {
        payload = {
          ...payload,
          employeeManager:
            typeof formData.entity === "string"
              ? formData.entity
              : String(formData.entity?.id), // take id and convert to string
        };
      }

      // Submit with updated payload
      onSubmit(payload);

      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      mail: "",
      phoneNumber: "",
      employeeNumber: "",
      password: "",
      designation: "",
      entity: "",
      group: "",
      role: defaultRole,
      imageUrl: "",
      employeeManager: "",
      dateOfJoining: "",
      managerCode: "",
      workCity: "",
      workCountry: "",
      department: "",
      status: USER_STATUS.ACTIVE,
    });
    setErrors({});
    setServerErrors({});
    setTouched({});
  };

  const handleInputChange = (field: keyof CreateUserData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Clear existing errors immediately when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Clear server-side errors
    if (serverErrors[field]) {
      setServerErrors((prev) => ({ ...prev, [field]: [] }));
    }

    // Real-time validation for this field
    const error = validateField(field, value);
    if (error && touched[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const handleFieldBlur = (field: keyof CreateUserData) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    const value = formData[field]?.toString() || "";
    const error = validateField(field, value);

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      if (!editingUser) {
        setTimeout(() => resetForm(), 150);
      }
    }
  };

  const getFieldError = (field: string): string => {
    return (
      errors[field] || (serverErrors[field] && serverErrors[field][0]) || ""
    );
  };

  // Calculate if form has errors - only check validation errors, not empty optional fields
  const hasValidationErrors = Object.keys(errors).some(
    (field) => errors[field]
  );

  const isShowAddtionalInfoCard = false;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full min-w-[900px] max-w-[1200px] max-h-[95vh] p-0 gap-0 overflow-hidden bg-white dark:bg-slate-900 border-0 shadow-2xl">
        <div className="flex flex-col h-full max-h-[95vh]">
          <FormHeader
            roleConfig={{
              ...currentRoleConfig,
              title: editingUser
                ? `Edit ${formData.role}`
                : currentRoleConfig.title,
            }}
            currentRole={formData.role}
          />

          <div
            className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent"
            data-scroll-container="true"
            style={{ scrollBehavior: "smooth" }}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Server errors summary */}
              {Object.keys(serverErrors).length > 0 && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-red-800 dark:text-red-200 font-semibold mb-3">
                        Please fix the following errors:
                      </h4>
                      <ul className="text-red-700 dark:text-red-300 text-sm space-y-2">
                        {Object.entries(serverErrors).map(
                          ([field, messages]) => (
                            <li
                              key={field}
                              className="flex items-start space-x-2"
                            >
                              <span className="w-1 h-1 bg-red-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span>
                                <strong className="capitalize">{field}:</strong>{" "}
                                {messages.join(", ")}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-8">
                  <PersonalInfoSection
                    editingUser={isEditing ?? false}
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    requiredFields={currentRoleConfig.requiredFields}
                    onInputChange={handleInputChange}
                    onFieldBlur={handleFieldBlur}
                    getFieldError={getFieldError}
                  />

                  <ContactInfoSection
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    requiredFields={currentRoleConfig.requiredFields}
                    onInputChange={handleInputChange}
                    onFieldBlur={handleFieldBlur}
                    getFieldError={getFieldError}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {/* <ProfessionalInfoSection
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    requiredFields={currentRoleConfig.requiredFields}
                    onInputChange={handleInputChange}
                    onFieldBlur={handleFieldBlur}
                    getFieldError={getFieldError}
                    formType={defaultRole}
                  /> */}

                  <ProfessionalInfoSection
                    users={users}
                    formData={formData}
                    errors={errors}
                    touched={touched}
                    requiredFields={currentRoleConfig.requiredFields}
                    onInputChange={handleInputChange}
                    onFieldBlur={handleFieldBlur}
                    getFieldError={getFieldError}
                    formType={defaultRole}
                  />

                  {isShowAddtionalInfoCard && (
                    <AdditionalInfoSection
                      formData={formData}
                      onInputChange={handleInputChange}
                      onFieldBlur={handleFieldBlur}
                      getFieldError={getFieldError}
                    />
                  )}
                </div>
              </div>
            </form>
          </div>

          <FormFooter
            isSubmitting={isSubmitting}
            currentRole={formData.role}
            onCancel={handleClose}
            onSubmit={handleSubmit}
            isEditing={!!editingUser}
            hasErrors={hasValidationErrors}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
