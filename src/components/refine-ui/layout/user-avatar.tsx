import { useGetIdentity } from "@refinedev/core";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type User = {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  role?: string;
};

export function UserAvatar() {
  const { data: user, isLoading: userIsLoading } = useGetIdentity<User>();

  if (userIsLoading || !user) {
    return <Skeleton className={cn("h-10", "w-10", "rounded-full")} />;
  }

  const displayName = user.name ?? user.email ?? "User";
  const avatarUrl = user.image;

  return (
    <Avatar className={cn("h-10", "w-10")}> 
      {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />} 
      <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
    </Avatar>
  );
}

const getInitials = (name = "") => {
  const names = name.trim().split(/\s+/).filter(Boolean);
  if (!names.length) return "U";
  if (names.length === 1) return names[0].slice(0, 1).toUpperCase();
  return `${names[0][0] ?? ""}${names[names.length - 1][0] ?? ""}`.toUpperCase();
};

UserAvatar.displayName = "UserAvatar";
