import { useGetIdentity } from "@refinedev/core";
import { Navigate } from "react-router";

const RoleRoute = ({ allow, children }: { allow: string[]; children: React.ReactNode }) => {
  const { data: identity, isLoading } = useGetIdentity<{ role: string }>();

  if (isLoading) return null;
  if (!identity || !allow.includes(identity.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
export default RoleRoute;