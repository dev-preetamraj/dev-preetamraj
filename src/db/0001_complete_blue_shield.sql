CREATE TABLE IF NOT EXISTS "portfolios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" varchar(500) NOT NULL,
	"content" text NOT NULL,
	"category_id" uuid NOT NULL,
	"featured_image" text NOT NULL,
	"github_url" text,
	"frontend_github_url" text,
	"live_url" text,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "portfolios_title_unique" UNIQUE("title"),
	CONSTRAINT "portfolios_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "portfolio_comments" DROP CONSTRAINT "portfolio_comments_portfolio_id_blogs_id_fk";
--> statement-breakpoint
ALTER TABLE "portfolio_tags" DROP CONSTRAINT "portfolio_tags_portfolio_id_blogs_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "portfolio_comments" ADD CONSTRAINT "portfolio_comments_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "portfolio_tags" ADD CONSTRAINT "portfolio_tags_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN IF EXISTS "github_url";--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN IF EXISTS "frontend_github_url";--> statement-breakpoint
ALTER TABLE "blogs" DROP COLUMN IF EXISTS "live_url";