import { Role } from "@/types/idea";

export function getRoleStats(roles: Role[]) {
  const total = roles.length;
  const filled = roles.filter((role) => role.isFilled).length;
  const open = total - filled;
  const progress = total > 0 ? filled / total : 0;

  return { total, filled, open, progress };
}

export function getOpenRoles(roles: Role[]) {
  return roles.filter((role) => !role.isFilled);
}
