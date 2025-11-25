import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Users,
  Building,
  Target,
  AlertCircle,
  Loader2,
  MapPin,
  Hash,
  Activity,
  Info,
} from "lucide-react";
import { CreateUserData, IUser } from "@/types/user";
import { USER_ROLE, USER_STATUS } from "@/constants";
import { IEntity } from "@/types/entity";
import { IGroup } from "@/types/group";
import { getAllEntities } from "@/api/entity";
import { getAllGropus } from "@/api/group";
import { IResponse } from "@/types/responseError";
import { isSuccessResponse, getErrorMessage } from "@/api/error";
import { toast } from "@/hooks/toast";
import { useUsersByRole } from "@/hooks/userByRole";

interface ProfessionalInfoSectionProps {
  users: IUser[];
  formData: CreateUserData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  requiredFields: string[];
  onInputChange: (field: keyof CreateUserData, value: string) => void;
  onFieldBlur: (field: keyof CreateUserData) => void;
  getFieldError: (field: string) => string;
  isEditing?: boolean;
  formType?: USER_ROLE;
}





export function ProfessionalInfoSection({
  users,
  formData,
  requiredFields,
  onInputChange,
  onFieldBlur,
  getFieldError,
  formType,
}: ProfessionalInfoSectionProps) {
  const isRequired = (field: string) => requiredFields.includes(field);

  // Get available partners and managers for hierarchy assignment
  const { users: allUsers } = useUsersByRole();

  const partners = allUsers.filter((user) => user.role === USER_ROLE.PARTNER);
  const managers = allUsers.filter((user) => user.role === USER_ROLE.MANAGER);

  // const partners = users.filter((user) => user.role === USER_ROLE.PARTNER);
  // const managers = users.filter((user) => user.role === USER_ROLE.MANAGER);

  // Entity state
  const [entities, setEntities] = useState<IEntity[]>([]);
  const [loadingEntities, setLoadingEntities] = useState(false);

  // Group state
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);



  // Static Partner ID for when role is Partner
  const STATIC_PARTNER_ID = "PARTNER_001";

  // Auto-set role based on formType and employeeManager for Partners
  useEffect(() => {
    if (formType) {
      // Set role to match the form type
      onInputChange("role", formType);

      // If it's a Partner form, set static employeeManager
      if (formType === USER_ROLE.PARTNER) {
        onInputChange("employeeManager", STATIC_PARTNER_ID);
      }
    }
  }, [formType]);


 

  // Fetch entities on mount
  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setLoadingEntities(true);
        const response: IResponse<{ entites: IEntity[]; totalCount: number }> =
          await getAllEntities();

        if (isSuccessResponse(response)) {
          setEntities(response.data.entites);
        } else {
          toast({
            title: "Error Loading Entities",
            description: getErrorMessage(response),
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Network Error",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoadingEntities(false);
      }
    };

    fetchEntities();
  }, []);

  // Fetch groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoadingGroups(true);
        const response: IResponse<{ groups: IGroup[]; totalCount: number }> =
          await getAllGropus();

        if (isSuccessResponse(response)) {
          setGroups(response.data.groups);
        } else {
          toast({
            title: "Error Loading Groups",
            description: getErrorMessage(response),
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Network Error",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoadingGroups(false);
      }
    };

    fetchGroups();
  }, []);

  const getRoleColor = (role: USER_ROLE) => {
    switch (role) {
      case USER_ROLE.PARTNER:
        return "bg-emerald-100 text-emerald-700 border-emerald-300";
      case USER_ROLE.MANAGER:
        return "bg-purple-100 text-purple-700 border-purple-300";
      case USER_ROLE.USER:
        return "bg-blue-100 text-blue-700 border-blue-300";
      case USER_ROLE.ADMIN:
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getStatusColor = (status: USER_STATUS) => {
    switch (status) {
      case USER_STATUS.ACTIVE:
        return "bg-green-100 text-green-700 border-green-300";
      case USER_STATUS.INACTIVE:
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  // Helper function to get the right managers/partners for dropdown based on role
  const getManagerOptions = () => {
    switch (formData.role) {
      case USER_ROLE.MANAGER:
        return partners; // Managers report to Partners
      case USER_ROLE.USER:
        return managers; // Employees report to Managers
      default:
        return []; // Partners don't report to anyone
    }
  };

  const getRoleIcon = (role: USER_ROLE) => {
    switch (role) {
      case USER_ROLE.PARTNER:
        return Building;
      case USER_ROLE.MANAGER:
        return Users;
      case USER_ROLE.USER:
        return Briefcase;
      case USER_ROLE.ADMIN:
        return Target;
      default:
        return Briefcase;
    }
  };

  const getRoleName = (role: USER_ROLE) => {
    switch (role) {
      case USER_ROLE.PARTNER:
        return "Partner";
      case USER_ROLE.MANAGER:
        return "Manager";
      case USER_ROLE.USER:
        return "Employee";
      case USER_ROLE.ADMIN:
        return "Admin";
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-purple-50/50 to-purple-100/20 dark:from-purple-950/10 dark:to-purple-900/5 p-6 rounded-xl border border-purple-200/30 dark:border-purple-800/20 shadow-sm">
      <div className="flex items-center gap-3 pb-3">
        <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <Briefcase className="size-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Professional Information
        </h3>
      </div>
      <Separator className="bg-purple-200/40 dark:bg-purple-800/30" />

      <div className="space-y-5">
        {/* Job Title */}
        <div className="space-y-2">
          <Label
            htmlFor="designation"
            className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <Briefcase className="size-4" />
            Designation
            {isRequired("designation") && (
              <span className="text-red-500 font-bold">*</span>
            )}
          </Label>
          <Input
            id="designation"
            value={formData.designation}
            onChange={(e) => onInputChange("designation", e.target.value)}
            onBlur={() => onFieldBlur("designation")}
            placeholder="e.g., Partner, Software Engineer, Manager"
            data-error={!!getFieldError("designation")}
            className={`h-11 transition-all duration-200 ${
              getFieldError("designation")
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                : "border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-slate-800"
            }`}
          />
          {getFieldError("designation") && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError("designation")}
              </p>
            </div>
          )}
        </div>

        {/* Entity Dropdown */}
        <div className="space-y-2">
          <Label
            htmlFor="entity"
            className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <Building className="size-4" />
            Entity Name
            {isRequired("entity") && (
              <span className="text-red-500 font-bold">*</span>
            )}
            {loadingEntities && <Loader2 className="size-3 animate-spin" />}
          </Label>
          <Select
            value={(formData.entity as string) || "none"}
            onValueChange={(value) =>
              onInputChange("entity", value === "none" ? "" : value)
            }
            disabled={loadingEntities}
          >
            <SelectTrigger className="h-11 bg-white dark:bg-slate-800">
              <SelectValue
                placeholder={
                  loadingEntities ? "Loading entities..." : "Select an entity"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <span className="text-slate-500">No entity selected</span>
              </SelectItem>
              {entities.map((entity) => (
                <SelectItem key={entity.id} value={entity.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    {entity.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError("entity") && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError("entity")}
              </p>
            </div>
          )}
        </div>

        {/* Group Dropdown */}
        <div className="space-y-2">
          <Label
            htmlFor="group"
            className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <Users className="size-4" />
            Group
            {isRequired("group") && (
              <span className="text-red-500 font-bold">*</span>
            )}
            {loadingGroups && <Loader2 className="size-3 animate-spin" />}
          </Label>
          <Select
            value={(formData.group as string) || "none"}
            onValueChange={(value) =>
              onInputChange("group", value === "none" ? "" : value)
            }
            disabled={loadingGroups}
          >
            <SelectTrigger
              className={`h-11 transition-all duration-200 ${
                getFieldError("group")
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                  : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20"
              }`}
            >
              <SelectValue
                placeholder={
                  loadingGroups ? "Loading groups..." : "Select a group"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <span className="text-slate-500">No group selected</span>
              </SelectItem>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {group.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError("group") && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError("group")}
              </p>
            </div>
          )}
          {groups.length === 0 && !loadingGroups && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
              No groups available. Please create a group first.
            </p>
          )}
        </div>

        {/* Employee Status - Only Active and Inactive */}
        <div className="space-y-2">
          <Label
            htmlFor="status"
            className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <Activity className="size-4" />
            Employee Status
            {isRequired("status") && (
              <span className="text-red-500 font-bold">*</span>
            )}
          </Label>
          <div className="space-y-3">
            <Select
              value={formData.status || USER_STATUS.ACTIVE}
              onValueChange={(value: USER_STATUS) =>
                onInputChange("status", value)
              }
            >
              <SelectTrigger className="h-11 bg-white dark:bg-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={USER_STATUS.ACTIVE}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Active
                  </div>
                </SelectItem>
                <SelectItem value={USER_STATUS.INACTIVE}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    Inactive
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {formData.status && (
              <Badge
                variant="outline"
                className={getStatusColor(formData.status)}
              >
                Status: {formData.status}
              </Badge>
            )}
          </div>
        </div>

        {/* Role - Only show the specific role for this form */}
        <div className="space-y-2">
          <Label
            htmlFor="role"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Type/Role
          </Label>
          <div className="space-y-3">
            {formType ? (
              // If formType is specified, show as disabled field with only that role
              <div>
                <Select
                  value={formData.role || formType}
                  onValueChange={(value: USER_ROLE) =>
                    onInputChange("role", value)
                  }
                  disabled // Disable to prevent changing roles
                >
                  <SelectTrigger className="h-11 bg-slate-50 dark:bg-slate-800 opacity-60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={formType}>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(formType) &&
                          (() => {
                            const RoleIcon = getRoleIcon(formType);
                            return <RoleIcon className="size-4" />;
                          })()}
                        {getRoleName(formType)}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              // Fallback: show all roles if no formType specified
              <Select
                value={formData.role}
                onValueChange={(value: USER_ROLE) =>
                  onInputChange("role", value)
                }
              >
                <SelectTrigger className="h-11 bg-white dark:bg-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    USER_ROLE.PARTNER,
                    USER_ROLE.MANAGER,
                    USER_ROLE.USER,
                    USER_ROLE.ADMIN,
                  ].map((role) => {
                    const RoleIcon = getRoleIcon(role);
                    return (
                      <SelectItem key={role} value={role}>
                        <div className="flex items-center gap-2">
                          <RoleIcon className="size-4" />
                          {getRoleName(role)}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
            {formData.role && (
              <Badge variant="outline" className={getRoleColor(formData.role)}>
                Selected: {getRoleName(formData.role)}
              </Badge>
            )}
          </div>
        </div>

        {/* Employee Manager Selection */}
        {formData.role !== USER_ROLE.PARTNER &&
          formData.role !== USER_ROLE.ADMIN && (
            <div className="space-y-2">
              <Label
                htmlFor="employeeManager"
                className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
              >
                <Target className="size-4" />
                {formData.role === USER_ROLE.MANAGER
                  ? "Reports to Partner"
                  : "Employee Manager"}
                {isRequired("employeeManager") && (
                  <span className="text-red-500 font-bold">*</span>
                )}
              </Label>

              <Select
                value={formData.employeeManager || "none"}
                onValueChange={(value) => {
                  const selected =
                    getManagerOptions().find(
                      (person) => person.id.toString() === value
                    ) || null;

                  onInputChange(
                    "employeeManager",
                    value === "none" ? "" : value
                  );

                  // Auto-set managerCode (non-editable)
                  if (selected) {
                    onInputChange("managerCode", selected.employeeNumber || "");
                  } else {
                    onInputChange("managerCode", "");
                  }
                }}
              >
                <SelectTrigger className="h-11 bg-white dark:bg-slate-800">
                  <SelectValue
                    placeholder={
                      formData.role === USER_ROLE.MANAGER
                        ? "Select a partner"
                        : "Select a manager or 'No Manager'"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <span className="text-slate-500">
                      {formData.role === USER_ROLE.MANAGER
                        ? "No Partner"
                        : "No Manager"}
                    </span>
                  </SelectItem>

                  {getManagerOptions().map((person) => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            formData.role === USER_ROLE.MANAGER
                              ? "bg-emerald-500"
                              : "bg-purple-500"
                          }`}
                        ></div>
                        {person.name} - {person.designation}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {getManagerOptions().length === 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  {formData.role === USER_ROLE.MANAGER
                    ? "No partners available. Please create a partner first."
                    : "No managers available. Please create a manager first."}
                </p>
              )}
            </div>
          )}

        {/* Manager Code - Show for all roles except Partner */}
        {formData.role !== USER_ROLE.PARTNER && (
          <div className="space-y-2">
            <Label
              htmlFor="managerCode"
              className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
            >
              <Hash className="size-4" />
              Manager Code
              {isRequired("managerCode") && (
                <span className="text-red-500 font-bold">*</span>
              )}
            </Label>

            <Input
              id="managerCode"
              value={formData.managerCode}
              readOnly // 🔒 non-editable for all roles
              placeholder="Auto-filled when you select Partner/Manager"
              className={`h-11 transition-all duration-200 ${
                getFieldError("managerCode")
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                  : "border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-slate-800"
              }`}
            />

            {getFieldError("managerCode") && (
              <div className="flex items-center gap-2 mt-2">
                <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {getFieldError("managerCode")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Work Location City */}
        <div className="space-y-2">
          <Label
            htmlFor="workCity"
            className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <MapPin className="size-4" />
            Work Location City
            {isRequired("workCity") && (
              <span className="text-red-500 font-bold">*</span>
            )}
          </Label>
          <Input
            id="workCity"
            value={formData.workCity || "Philippines"}
            onChange={(e) => onInputChange("workCity", e.target.value)}
            onBlur={() => onFieldBlur("workCity")}
            placeholder="e.g., Dubai, New York, London"
            data-error={!!getFieldError("workCity")}
            className={`h-11 transition-all duration-200 ${
              getFieldError("workCity")
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                : "border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-slate-800"
            }`}
          />
          {getFieldError("workCity") && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError("workCity")}
              </p>
            </div>
          )}
        </div>

        {/* Work Location Country */}
        <div className="space-y-2">
          <Label
            htmlFor="workCountry"
            className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <MapPin className="size-4" />
            Work Location Country
            {isRequired("workCountry") && (
              <span className="text-red-500 font-bold">*</span>
            )}
          </Label>
          <Input
            id="workCountry"
            value={formData.workCountry || "Philippines"}
            onChange={(e) => onInputChange("workCountry", e.target.value)}
            onBlur={() => onFieldBlur("workCountry")}
            placeholder="e.g., UAE, USA, UK"
            data-error={!!getFieldError("workCountry")}
            className={`h-11 transition-all duration-200 ${
              getFieldError("workCountry")
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                : "border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-slate-800"
            }`}
          />
          {getFieldError("workCountry") && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError("workCountry")}
              </p>
            </div>
          )}
        </div>

        {/* Employee Department */}
        <div className="space-y-2">
          <Label
            htmlFor="department"
            className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300"
          >
            <Building className="size-4" />
            Department
            {isRequired("department") && (
              <span className="text-red-500 font-bold">*</span>
            )}
          </Label>
          <Input
            id="department"
            value={formData.department || "SALES"}
            onChange={(e) => onInputChange("department", e.target.value)}
            onBlur={() => onFieldBlur("department")}
            placeholder="e.g., Management, IT, Sales, HR"
            data-error={!!getFieldError("department")}
            className={`h-11 transition-all duration-200 ${
              getFieldError("department")
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20 bg-red-50/50 dark:bg-red-950/20"
                : "border-slate-300 dark:border-slate-600 focus:border-purple-500 focus:ring-purple-500/20 bg-white dark:bg-slate-800"
            }`}
          />
          {getFieldError("department") && (
            <div className="flex items-center gap-2 mt-2">
              <AlertCircle className="size-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {getFieldError("department")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
