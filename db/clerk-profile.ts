import type { User, UserJSON } from "@clerk/nextjs/server";

export type ClerkProfile = {
  clerkId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  imageUrl: string | null;
  clerkCreatedAt: Date;
  clerkUpdatedAt: number;
};

export function profileFromUser(user: User): ClerkProfile {
  return {
    clerkId: user.id,
    email: user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress ?? null,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    imageUrl: user.imageUrl,
    clerkCreatedAt: new Date(user.createdAt),
    clerkUpdatedAt: user.updatedAt,
  };
}

export function profileFromEvent(user: UserJSON): ClerkProfile {
  return {
    clerkId: user.id,
    email: user.email_addresses.find((email) => email.id === user.primary_email_address_id)?.email_address ?? null,
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    imageUrl: user.image_url,
    clerkCreatedAt: new Date(user.created_at),
    clerkUpdatedAt: user.updated_at,
  };
}
