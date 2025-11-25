// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator";
// import {
//   Search,
//   SortAsc,
//   SortDesc,
//   Filter,
//   X,
//   Calendar,
//   Building2,
//   Activity,
//   Settings2,
// } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
// import { SortOption, SortDirection } from "@/types/group";

// interface SearchAndFilterProps {
//   searchTerm: string;
//   onSearchChange: (value: string) => void;
//   sortBy: SortOption;
//   sortDirection: SortDirection;
//   onSortChange: (value: SortOption) => void;
//   onSortDirectionChange: (value: SortDirection) => void;
//   statusFilter: string;
//   onStatusFilterChange: (value: string) => void;
//   dateRange: { from: string; to: string };
//   onDateRangeChange: (range: { from: string; to: string }) => void;
// }

// export default function SearchAndFilter({
//   searchTerm,
//   onSearchChange,
//   sortBy,
//   sortDirection,
//   onSortChange,
//   onSortDirectionChange,
//   statusFilter,
//   onStatusFilterChange,
//   dateRange,
//   onDateRangeChange,
// }: SearchAndFilterProps) {
//   const [sortDialogOpen, setSortDialogOpen] = useState(false);
//   const [filterDialogOpen, setFilterDialogOpen] = useState(false);

//   // Local state for pending sort changes
//   const [pendingSortBy, setPendingSortBy] = useState<SortOption>(sortBy);
//   const [pendingSortDirection, setPendingSortDirection] =
//     useState<SortDirection>(sortDirection);

//   // Local state for pending filter changes
//   const [pendingStatusFilter, setPendingStatusFilter] = useState(statusFilter);

//   const [pendingDateRange, setPendingDateRange] = useState(dateRange);

//   // Update local state when props change (in case filters are cleared from parent)
//   useEffect(() => {
//     setPendingSortBy(sortBy);
//     setPendingSortDirection(sortDirection);
//   }, [sortBy, sortDirection]);

//   useEffect(() => {
//     setPendingStatusFilter(statusFilter);

//     setPendingDateRange(dateRange);
//   }, [statusFilter, dateRange]);

//   const activeFiltersCount = [
//     statusFilter !== "all",
//     dateRange.from,
//     dateRange.to,
//   ].filter(Boolean).length;

//   const clearAllFilters = () => {
//     onStatusFilterChange("all");
//     onDateRangeChange({ from: "", to: "" });
//     onSearchChange("");
//     onSortChange("name");
//     onSortDirectionChange("asc");
//   };

//   const handleSortDialogOpen = (open: boolean) => {
//     setSortDialogOpen(open);
//     if (open) {
//       // Reset pending values to current values when opening
//       setPendingSortBy(sortBy);
//       setPendingSortDirection(sortDirection);
//     }
//   };

//   const handleFilterDialogOpen = (open: boolean) => {
//     setFilterDialogOpen(open);
//     if (open) {
//       // Reset pending values to current values when opening
//       setPendingStatusFilter(statusFilter);
//       setPendingDateRange(dateRange);
//     }
//   };

//   const applySortAndClose = () => {
//     // Apply the pending sort changes
//     onSortChange(pendingSortBy);
//     onSortDirectionChange(pendingSortDirection);
//     setSortDialogOpen(false);
//   };

//   const applyFiltersAndClose = () => {
//     // Apply the pending filter changes
//     onStatusFilterChange(pendingStatusFilter);
//     onDateRangeChange(pendingDateRange);
//     setFilterDialogOpen(false);
//   };

//   const cancelSortAndClose = () => {
//     // Revert pending changes to current values
//     setPendingSortBy(sortBy);
//     setPendingSortDirection(sortDirection);
//     setSortDialogOpen(false);
//   };

//   const cancelFiltersAndClose = () => {
//     // Revert pending changes to current values
//     setPendingStatusFilter(statusFilter);
//     setPendingDateRange(dateRange);
//     setFilterDialogOpen(false);
//   };

//   const getSortDisplayText = () => {
//     const sortLabels = {
//       name: "Name",
//       date: "Date Created",
//       status: "Status",
//     };
//     const directionText = sortDirection === "asc" ? "↑" : "↓";
//     return `${sortLabels[sortBy]} ${directionText}`;
//   };

//   return (
//     <div className="space-y-4">
//       <div className="space-y-2">
//         <Label
//           htmlFor="search"
//           className="text-sm font-bold text-neutral-950 dark:text-neutral-200 "
//         >
//           Search Groups
//         </Label>
//       </div>

//       {/* Search Bar */}
//       <div className="relative">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//         <Input
//           placeholder="Search groups by name or description..."
//           value={searchTerm}
//           onChange={(e) => onSearchChange(e.target.value)}
//           className="pl-10 pr-10 h-12 text-base border-2 focus:border-primary transition-all duration-200"
//         />
//         <AnimatePresence>
//           {searchTerm && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               className="absolute right-3 top-1/2 transform -translate-y-1/2"
//             >
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-6 w-6 p-0 hover:bg-muted"
//                 onClick={() => onSearchChange("")}
//               >
//                 <X className="h-4 w-4" />
//               </Button>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>

//       {/* Controls Row */}
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div className="flex items-center gap-2 flex-wrap">
//           {/* Sort Dialog */}
//           <Dialog open={sortDialogOpen} onOpenChange={handleSortDialogOpen}>
//             <DialogTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="h-10 px-4 border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-md"
//               >
//                 {sortDirection === "asc" ? (
//                   <SortAsc className="h-4 w-4 mr-2" />
//                 ) : (
//                   <SortDesc className="h-4 w-4 mr-2" />
//                 )}
//                 Sort: {getSortDisplayText()}
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle className="flex items-center gap-2">
//                   <Settings2 className="h-5 w-5" />
//                   Sort Options
//                 </DialogTitle>
//                 <DialogDescription>
//                   Choose how you want to sort your groups
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="space-y-6 py-4">
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">Sort By</Label>
//                   <Select
//                     value={pendingSortBy}
//                     onValueChange={(value: SortOption) =>
//                       setPendingSortBy(value)
//                     }
//                   >
//                     <SelectTrigger className="h-11">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="name">
//                         <div className="flex items-center gap-2">
//                           <span>Name</span>
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="date">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="h-4 w-4" />
//                           <span>Date Created</span>
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="status">
//                         <div className="flex items-center gap-2">
//                           <Activity className="h-4 w-4" />
//                           <span>Status</span>
//                         </div>
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium">Sort Direction</Label>
//                   <Select
//                     value={pendingSortDirection}
//                     onValueChange={(value: SortDirection) =>
//                       setPendingSortDirection(value)
//                     }
//                   >
//                     <SelectTrigger className="h-11">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="asc">
//                         <div className="flex items-center gap-2">
//                           <SortAsc className="h-4 w-4" />
//                           <span>Ascending (A-Z, Oldest first)</span>
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="desc">
//                         <div className="flex items-center gap-2">
//                           <SortDesc className="h-4 w-4" />
//                           <span>Descending (Z-A, Newest first)</span>
//                         </div>
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <Separator />

//                 <div className="flex gap-2">
//                   <Button onClick={applySortAndClose} className="flex-1">
//                     Apply Sort
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={cancelSortAndClose}
//                     className="flex-1"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             </DialogContent>
//           </Dialog>

//           {/* Filter Dialog */}
//           <Dialog open={filterDialogOpen} onOpenChange={handleFilterDialogOpen}>
//             <DialogTrigger asChild>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="h-10 px-4 border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-md relative"
//               >
//                 <Filter className="h-4 w-4 mr-2" />
//                 Filter
//                 {activeFiltersCount > 0 && (
//                   <Badge
//                     variant="destructive"
//                     className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
//                   >
//                     {activeFiltersCount}
//                   </Badge>
//                 )}
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="sm:max-w-lg">
//               <DialogHeader>
//                 <DialogTitle className="flex items-center gap-2">
//                   <Filter className="h-5 w-5" />
//                   Filter Groups
//                 </DialogTitle>
//                 <DialogDescription>
//                   Apply filters to find specific groups
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="space-y-6 py-4">
//                 {/* Status Filter */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium flex items-center gap-2">
//                     <Activity className="h-4 w-4" />
//                     Status
//                   </Label>
//                   <Select
//                     value={pendingStatusFilter}
//                     onValueChange={setPendingStatusFilter}
//                   >
//                     <SelectTrigger className="h-11">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Statuses</SelectItem>
//                       <SelectItem value="Active">
//                         <div className="flex items-center gap-2">
//                           <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                           <span>Active</span>
//                         </div>
//                       </SelectItem>
//                       <SelectItem value="Inactive">
//                         <div className="flex items-center gap-2">
//                           <div className="w-2 h-2 bg-red-500 rounded-full"></div>
//                           <span>Inactive</span>
//                         </div>
//                       </SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Date Range */}
//                 <div className="space-y-3">
//                   <Label className="text-sm font-medium flex items-center gap-2">
//                     <Calendar className="h-4 w-4" />
//                     Date Range
//                   </Label>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="dateFrom"
//                         className="text-xs text-muted-foreground"
//                       >
//                         From Date
//                       </Label>
//                       <Input
//                         id="dateFrom"
//                         type="date"
//                         value={pendingDateRange.from}
//                         onChange={(e) =>
//                           setPendingDateRange({
//                             ...pendingDateRange,
//                             from: e.target.value,
//                           })
//                         }
//                         className="h-10"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="dateTo"
//                         className="text-xs text-muted-foreground"
//                       >
//                         To Date
//                       </Label>
//                       <Input
//                         id="dateTo"
//                         type="date"
//                         value={pendingDateRange.to}
//                         onChange={(e) =>
//                           setPendingDateRange({
//                             ...pendingDateRange,
//                             to: e.target.value,
//                           })
//                         }
//                         className="h-10"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <Separator />

//                 <div className="flex gap-2">
//                   <Button onClick={applyFiltersAndClose} className="flex-1">
//                     Apply Filters
//                   </Button>
//                   <Button
//                     variant="outline"
//                     onClick={cancelFiltersAndClose}
//                     className="flex-1"
//                   >
//                     Cancel
//                   </Button>
//                 </div>

//                 {activeFiltersCount > 0 && (
//                   <>
//                     <Separator />
//                     <Button
//                       variant="ghost"
//                       onClick={clearAllFilters}
//                       className="w-full text-muted-foreground hover:text-foreground"
//                     >
//                       <X className="h-4 w-4 mr-2" />
//                       Clear All Filters
//                     </Button>
//                   </>
//                 )}
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Clear All Button */}
//         {(searchTerm || activeFiltersCount > 0) && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={clearAllFilters}
//             className="h-10 text-muted-foreground hover:text-foreground"
//           >
//             <X className="h-4 w-4 mr-2" />
//             Clear All
//           </Button>
//         )}
//       </div>

//       {/* Active Filters Display */}
//       <AnimatePresence>
//         {(searchTerm || activeFiltersCount > 0) && (
//           <motion.div
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -10 }}
//             className="flex items-center gap-2 flex-wrap p-4 bg-muted/30 rounded-lg border border-dashed"
//           >
//             <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
//               <Filter className="h-4 w-4" />
//               Active filters:
//             </span>
//             {searchTerm && (
//               <Badge variant="secondary" className="gap-1 px-3 py-1">
//                 Search: &quot;{searchTerm}&quot;
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-4 w-4 p-0 hover:bg-transparent"
//                   onClick={() => onSearchChange("")}
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               </Badge>
//             )}
//             {statusFilter !== "all" && (
//               <Badge variant="secondary" className="gap-1 px-3 py-1">
//                 Status: {statusFilter}
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-4 w-4 p-0 hover:bg-transparent"
//                   onClick={() => onStatusFilterChange("all")}
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               </Badge>
//             )}

//             {(dateRange.from || dateRange.to) && (
//               <Badge variant="secondary" className="gap-1 px-3 py-1">
//                 Date: {dateRange.from || "Start"} - {dateRange.to || "End"}
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="h-4 w-4 p-0 hover:bg-transparent"
//                   onClick={() => onDateRangeChange({ from: "", to: "" })}
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               </Badge>
//             )}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

import React from "react";

const search_and_filter_groups = () => {
  return <div>search_and_filter_groups</div>;
};

export default search_and_filter_groups;
