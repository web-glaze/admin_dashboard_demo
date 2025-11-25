import { Button } from "@/components/ui/button";
import { Loader2, Save, X, CheckCircle, AlertTriangle } from "lucide-react";
import { USER_ROLE } from "@/constants";

interface FormFooterProps {
  isSubmitting: boolean;
  currentRole: USER_ROLE; // ✅ Changed from string to USER_ROLE
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  isEditing: boolean; // ✅ Made required (removed optional)
  hasErrors: boolean; // ✅ Added missing prop
}

export function FormFooter({
  isSubmitting,
  currentRole,
  onCancel,
  onSubmit,
  isEditing,
  hasErrors // ✅ Added to destructuring
}: FormFooterProps) {
  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 px-8 py-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Form Status */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${hasErrors ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
            {hasErrors ? (
              <AlertTriangle className="size-4 text-red-600 dark:text-red-400" />
            ) : (
              <CheckCircle className="size-4 text-green-600 dark:text-green-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
              Form Status: {hasErrors ? 'Has Errors' : 'Ready to Submit'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Role: {currentRole}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-11 px-6"
          >
            <X className="size-4 mr-2" />
            Cancel
          </Button>
          
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={isSubmitting || hasErrors} // ✅ Using hasErrors prop
            className="h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="size-4 mr-2" />
                {isEditing ? 'Update User' : 'Create User'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
