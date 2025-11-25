import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TypeIcon as type, type LucideIcon } from 'lucide-react';
import { USER_ROLE } from "@/constants";

interface RoleConfig {
  title: string;
  description: string;
  requiredFields: string[];
  optionalFields: string[];
  color: string;
  icon: LucideIcon;
}

interface FormHeaderProps {
  roleConfig: RoleConfig;
  currentRole: USER_ROLE;
}

export function FormHeader({ roleConfig, currentRole }: FormHeaderProps) {
  const RoleIcon = roleConfig.icon;

  return (
    <div className="flex-shrink-0 p-8 pb-6 border-b bg-gradient-to-r from-background via-muted/20 to-background">
      <DialogHeader className="space-y-4">
        <div className="flex items-start gap-6">
          <div className={`p-4 rounded-xl ${roleConfig.color} shadow-sm flex-shrink-0`}>
            <RoleIcon className="size-7" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-3xl font-bold mb-2">{roleConfig.title}</DialogTitle>
            <DialogDescription className="text-lg text-muted-foreground leading-relaxed">
              {roleConfig.description}
            </DialogDescription>
          </div>
          <div className="flex-shrink-0">
            <Badge variant="outline" className={`${roleConfig.color} font-medium text-sm px-3 py-1`}>
              {currentRole}
            </Badge>
          </div>
        </div>
      </DialogHeader>
    </div>
  );
}
