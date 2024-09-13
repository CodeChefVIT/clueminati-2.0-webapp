DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clueminati-2.0-web_teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"team_code" varchar(6) NOT NULL,
	"user_ids" text[] DEFAULT '{}'::text[] NOT NULL,
	"user_count" integer DEFAULT 0,
	"score" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "clueminati-2.0-web_teams_name_unique" UNIQUE("name"),
	CONSTRAINT "clueminati-2.0-web_teams_team_code_unique" UNIQUE("team_code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clueminati-2.0-web_users" (
	"name" varchar(256),
	"email" varchar(256) PRIMARY KEY NOT NULL,
	"password" varchar(256) NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"team_id" integer,
	"token" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clueminati-2.0-web_users" ADD CONSTRAINT "clueminati-2.0-web_users_team_id_clueminati-2.0-web_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."clueminati-2.0-web_teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teams_id_idx" ON "clueminati-2.0-web_teams" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teams_name_idx" ON "clueminati-2.0-web_teams" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "clueminati-2.0-web_users" USING btree ("email");