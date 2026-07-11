import type { AccessControlProvider } from "@refinedev/core";

type Role = "admin" | "teacher" | "student";

const rules: Record<string, Partial<Record<string, Role[]>>> = {
  subjects:    { create: ["admin", "teacher"], edit: ["admin", "teacher"], delete: ["admin", "teacher"] },
  classes:     { create: ["admin", "teacher"], edit: ["admin", "teacher"], delete: ["admin", "teacher"] },
  departments: { create: ["admin", "teacher"], edit: ["admin", "teacher"], delete: ["admin", "teacher"] },
  enrollments: { create: ["admin", "student"] },
};

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    const stored = localStorage.getItem("user");
    if (!stored) return { can: false, reason: "Not authenticated" };

    let role: Role | undefined;
    try {
      const parsed = JSON.parse(stored);
      role = parsed?.role;
    } catch {
      return { can: false, reason: "Invalid session data" };
    }
    if (!role) return { can: false, reason: "Not authenticated" };
    if (role === "admin") return { can: true };

    const allowed = resource ? rules[resource]?.[action] : undefined;
    if (!allowed) return { can: true }; // no rule = read-type action, allowed for any logged-in role

    return { can: allowed.includes(role), reason: `Requires role: ${allowed.join(", ")}` };
  },
};