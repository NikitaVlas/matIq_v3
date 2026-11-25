CREATE TYPE "public"."category_kind" AS ENUM('position', 'technique_type', 'training');--> statement-breakpoint
CREATE TYPE "public"."category_link_kind" AS ENUM('learn_before', 'leads_to');--> statement-breakpoint
CREATE TYPE "public"."gi_mode" AS ENUM('gi', 'nogi', 'both');--> statement-breakpoint
CREATE TYPE "public"."skill_level" AS ENUM('beginner', 'intermediate', 'advanced');--> statement-breakpoint
CREATE TYPE "public"."technique_link_kind" AS ENUM('setup_for', 'chain', 'counter');--> statement-breakpoint
CREATE TYPE "public"."technique_perspective" AS ENUM('top', 'bottom', 'neutral');--> statement-breakpoint
CREATE TYPE "public"."technique_type" AS ENUM('submission', 'sweep', 'pass', 'escape', 'takedown', 'transition', 'retention', 'control', 'concept');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"slug" text NOT NULL,
	"name_de" text NOT NULL,
	"name_en" text NOT NULL,
	"description_de" text,
	"kind" "category_kind" NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_hidden" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "category_links" (
	"from_category_id" uuid NOT NULL,
	"to_category_id" uuid NOT NULL,
	"kind" "category_link_kind" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "category_links_from_category_id_to_category_id_kind_pk" PRIMARY KEY("from_category_id","to_category_id","kind"),
	CONSTRAINT "category_links_no_self_link" CHECK ("category_links"."from_category_id" <> "category_links"."to_category_id")
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"slug" text NOT NULL,
	"name_de" text NOT NULL,
	"name_en" text NOT NULL,
	"parent_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "positions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "technique_categories" (
	"technique_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "technique_categories_technique_id_category_id_pk" PRIMARY KEY("technique_id","category_id")
);
--> statement-breakpoint
CREATE TABLE "technique_links" (
	"from_technique_id" uuid NOT NULL,
	"to_technique_id" uuid NOT NULL,
	"kind" "technique_link_kind" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "technique_links_from_technique_id_to_technique_id_kind_pk" PRIMARY KEY("from_technique_id","to_technique_id","kind"),
	CONSTRAINT "technique_links_no_self" CHECK ("technique_links"."from_technique_id" <> "technique_links"."to_technique_id")
);
--> statement-breakpoint
CREATE TABLE "technique_prerequisites" (
	"technique_id" uuid NOT NULL,
	"requires_technique_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "technique_prerequisites_technique_id_requires_technique_id_pk" PRIMARY KEY("technique_id","requires_technique_id"),
	CONSTRAINT "technique_prerequisites_no_self" CHECK ("technique_prerequisites"."technique_id" <> "technique_prerequisites"."requires_technique_id")
);
--> statement-breakpoint
CREATE TABLE "techniques" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"slug" text NOT NULL,
	"name_de" text NOT NULL,
	"name_en" text NOT NULL,
	"position_id" uuid NOT NULL,
	"perspective" "technique_perspective" NOT NULL,
	"type" "technique_type" NOT NULL,
	"level" "skill_level" NOT NULL,
	"gi_mode" "gi_mode" DEFAULT 'both' NOT NULL,
	"is_scoring" boolean DEFAULT false NOT NULL,
	"description_de" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "techniques_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "category_links" ADD CONSTRAINT "category_links_from_category_id_categories_id_fk" FOREIGN KEY ("from_category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "category_links" ADD CONSTRAINT "category_links_to_category_id_categories_id_fk" FOREIGN KEY ("to_category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_parent_id_positions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."positions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technique_categories" ADD CONSTRAINT "technique_categories_technique_id_techniques_id_fk" FOREIGN KEY ("technique_id") REFERENCES "public"."techniques"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technique_categories" ADD CONSTRAINT "technique_categories_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technique_links" ADD CONSTRAINT "technique_links_from_technique_id_techniques_id_fk" FOREIGN KEY ("from_technique_id") REFERENCES "public"."techniques"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technique_links" ADD CONSTRAINT "technique_links_to_technique_id_techniques_id_fk" FOREIGN KEY ("to_technique_id") REFERENCES "public"."techniques"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technique_prerequisites" ADD CONSTRAINT "technique_prerequisites_technique_id_techniques_id_fk" FOREIGN KEY ("technique_id") REFERENCES "public"."techniques"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "technique_prerequisites" ADD CONSTRAINT "technique_prerequisites_requires_technique_id_techniques_id_fk" FOREIGN KEY ("requires_technique_id") REFERENCES "public"."techniques"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "techniques" ADD CONSTRAINT "techniques_position_id_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "category_links_to_idx" ON "category_links" USING btree ("to_category_id");--> statement-breakpoint
CREATE INDEX "positions_parent_idx" ON "positions" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "technique_categories_category_idx" ON "technique_categories" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "technique_links_to_idx" ON "technique_links" USING btree ("to_technique_id");--> statement-breakpoint
CREATE INDEX "technique_prerequisites_requires_idx" ON "technique_prerequisites" USING btree ("requires_technique_id");--> statement-breakpoint
CREATE INDEX "techniques_position_idx" ON "techniques" USING btree ("position_id");