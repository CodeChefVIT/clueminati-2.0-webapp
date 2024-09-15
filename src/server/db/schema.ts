// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `clueminati-2.0-web_${name}`,
);

export const roleEnum = pgEnum("role", ["admin", "user"]);

export const users = createTable(
  "users",
  {
    name: varchar("name", { length: 256 }),
    email: varchar("email", { length: 256 }).primaryKey(),
    password: varchar("password", { length: 256 }).notNull(),
    role: roleEnum("role").notNull().default("user"),
    teamId: integer("team_id").references(() => teams.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    emailIdx: index("users_email_idx").on(example.email),
  }),
);

export const usersRelations = relations(users, ({ one }) => ({
  team: one(teams, {
    fields: [users.teamId],
    references: [teams.id],
  }),
}));

export const teams = createTable(
  "teams",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull().unique(),
    teamCode: varchar("team_code", { length: 6 }).notNull().unique(),
    userIds: text("user_ids")
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
    userCount: integer("user_count").default(0),
    score: integer("score").default(0),
    solved: text("solved")
      .array()
      .default(sql`'{}'::text[]`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    idIdx: index("teams_id_idx").on(example.id),
    codeIdx: index("teams_team_code_idx").on(example.teamCode),
    scoreIdx: index("teams_score_idx").on(example.score),
  }),
);

export const teamsRelations = relations(teams, ({ many }) => ({
  users: many(users),
}));

export const sessions = createTable(
  "sessions",
  {
    token: varchar("token", { length: 256 }),
    userId: varchar("user_id", { length: 256 })
      .notNull()
      .unique()
      .references(() => users.email, { onDelete: "cascade" }),
  },
  (example) => ({
    pk: primaryKey({ columns: [example.token, example.userId] }),
    tokenIdx: index("sessions_token_idx").on(example.token),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.email],
  }),
}));
