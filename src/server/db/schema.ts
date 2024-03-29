import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  timestamp,
  varchar,
  text,
} from "drizzle-orm/pg-core";

export const table = pgTableCreator((name) => `migui_${name}`);

export const groups = table(
  "group",
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),

    // Fields
    name: varchar("name", { length: 256 }),
  },
  (group) => ({
    nameIndex: index("name_idx").on(group.name),
  }),
);
export type InsertGroup = typeof groups.$inferInsert;

export const participants = table("participant", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  // Fields
  name: varchar("name", { length: 256 }).notNull(),
  password: varchar("password", { length: 256 }),
  pickId: text("pickId"),
  groupId: text("groupId"),
});
export type InsertParticipant = typeof participants.$inferInsert;

export const groupToParticipantsRelation = relations(groups, ({ many }) => ({
  participants: many(participants),
}));

export const participantPickRelation = relations(participants, ({ one }) => ({
  pick: one(participants, {
    fields: [participants.pickId],
    references: [participants.id],
  }),
  group: one(groups, {
    fields: [participants.groupId],
    references: [groups.id],
  }),
}));
