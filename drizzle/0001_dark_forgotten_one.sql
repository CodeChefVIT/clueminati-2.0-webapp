ALTER TABLE "clueminati-2.0-web_sessions" DROP CONSTRAINT "clueminati-2.0-web_sessions_user_id_clueminati-2.0-web_users_email_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "clueminati-2.0-web_sessions" ADD CONSTRAINT "clueminati-2.0-web_sessions_user_id_clueminati-2.0-web_users_email_fk" FOREIGN KEY ("user_id") REFERENCES "public"."clueminati-2.0-web_users"("email") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
