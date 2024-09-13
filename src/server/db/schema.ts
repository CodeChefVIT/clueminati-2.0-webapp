// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
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
    token: varchar("token", { length: 256 }),
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
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    idIdx: index("teams_id_idx").on(example.id),
    nameIdx: index("teams_name_idx").on(example.name),
  }),
);

export const teamsRelations = relations(teams, ({ many }) => ({
  users: many(users),
}));
