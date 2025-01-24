CREATE TYPE "public"."status" AS ENUM('pending', 'inProgress', 'delivered');--> statement-breakpoint
CREATE TABLE "deliveries" (
	"uuid2" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_name" varchar(255) NOT NULL,
	"comment" varchar(255),
	"status" "status" DEFAULT 'pending',
	"shop_location" "point" NOT NULL,
	"user_location" "point" NOT NULL,
	"deliverer_id" uuid,
	"user_id" uuid NOT NULL,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now()
);
