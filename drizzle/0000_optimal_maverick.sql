DO $$ BEGIN
 CREATE TYPE "public"."role" AS ENUM('admin', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clueminati-2.0-web_sessions" (
	"token" varchar(256),
	"user_id" varchar(256) NOT NULL,
	CONSTRAINT "clueminati-2.0-web_sessions_token_user_id_pk" PRIMARY KEY("token","user_id"),
	CONSTRAINT "clueminati-2.0-web_sessions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clueminati-2.0-web_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(256) NOT NULL,
	"team_code" varchar(6) NOT NULL,
	"user_ids" text[] DEFAULT '{}'::text[] NOT NULL,
	"user_count" integer DEFAULT 0,
	"score" integer DEFAULT 0,
	"solved" text[] DEFAULT '{}'::text[],
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
	"team_id" uuid,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clueminati-2.0-web_sessions" ADD CONSTRAINT "clueminati-2.0-web_sessions_user_id_clueminati-2.0-web_users_email_fk" FOREIGN KEY ("user_id") REFERENCES "public"."clueminati-2.0-web_users"("email") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clueminati-2.0-web_users" ADD CONSTRAINT "clueminati-2.0-web_users_team_id_clueminati-2.0-web_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."clueminati-2.0-web_teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sessions_token_idx" ON "clueminati-2.0-web_sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teams_id_idx" ON "clueminati-2.0-web_teams" USING btree ("id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teams_team_code_idx" ON "clueminati-2.0-web_teams" USING btree ("team_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "teams_score_idx" ON "clueminati-2.0-web_teams" USING btree ("score");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "clueminati-2.0-web_users" USING btree ("email");