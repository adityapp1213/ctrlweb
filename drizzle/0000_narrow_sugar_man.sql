CREATE TABLE "users" (
	"clerk_id" text PRIMARY KEY NOT NULL,
	"email" text,
	"first_name" text,
	"last_name" text,
	"username" text,
	"image_url" text,
	"clerk_created_at" timestamp with time zone,
	"clerk_updated_at" bigint NOT NULL,
	"synced_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
