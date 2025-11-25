"use client";
import React, { useEffect, useState } from "react";
import { getAllEntities } from "@/api/entity";
import { IEntity } from "@/types/entity";
import useAuthStore from "@/store/useAuthStore";
import { USER_ROLE } from "@/constants";
import { useEntityContext } from "./enittyContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getManagerEntities } from "@/api/users";

export default function EntitySelector() {
  const [entities, setEntities] = useState<IEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const { selectedEntityId, setSelectedEntityId } = useEntityContext();
  const { user } = useAuthStore();
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setLoading(true);

        if (
          user?.role === USER_ROLE.ADMIN ||
          user?.role === USER_ROLE.PARTNER
        ) {
          const response = await getAllEntities();
          if (response.data?.entites) {
            setEntities(response.data.entites);
            setTotalCount(response.data.totalCount);
          }
        } else if (user?.role === USER_ROLE.MANAGER) {
          const response = await getManagerEntities();
          if (response.data?.entities) {
            setEntities(response.data.entities);
            setTotalCount(
              response.data.totalCount || response.data.entities.length
            );
          } else {
            setEntities([]);
          }
        } else if (user?.entity) {
          setSelectedEntityId(user.entity.id.toString());
        }
      } catch (error) {
        console.error("Error fetching entities:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchEntities();
  }, [user]);

  const isAdminOrPartner =
    user?.role === USER_ROLE.ADMIN || user?.role === USER_ROLE.PARTNER;
  const isManager = user?.role === USER_ROLE.MANAGER;

  const handleEntityChange = (value: string) => {
    setSelectedEntityId(value === "all" ? null : value);
  };

  // ✅ If only one entity exists, auto-select it
  useEffect(() => {
    if (totalCount === 1 && entities.length === 1) {
      setSelectedEntityId(entities[0].id);
    }
  }, [totalCount, entities]);

  return (
    <div className="relative w-full px-2">
      {isAdminOrPartner || isManager ? (
        totalCount === 1 ? (
          // ✅ Show only single entity name
          <div className="text-lg font-semibold text-muted-foreground mt-2">
            {entities[0]?.name || "No Entity Found"}
          </div>
        ) : (
          // ✅ Show dropdown with "View All"
          <>
            <label className="text-sm font-medium text-muted-foreground">
              Select Entity
            </label>
            <Select
              value={selectedEntityId ?? "all"}
              onValueChange={handleEntityChange}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue
                  placeholder={loading ? "Loading..." : "Choose Entity"}
                />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">View All</SelectItem>
                {entities.map((entity) => (
                  <SelectItem key={entity.id} value={entity.id}>
                    {entity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )
      ) : (
        <div className="text-lg font-semibold text-muted-foreground mt-2">
          {user?.entity?.name || "No Entity Assigned"}
        </div>
      )}
    </div>
  );
}
