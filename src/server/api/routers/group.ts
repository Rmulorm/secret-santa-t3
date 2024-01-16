import { createId } from "@paralleldrive/cuid2";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type InsertParticipant,
  groups,
  participants,
} from "~/server/db/schema";

export const groupRouter = createTRPCRouter({
  getResult: publicProcedure
    .input(z.string())
    .output(z.object({ name: z.string(), pick: z.string() }))
    .query(async ({ ctx, input }) => {
      const participant = await ctx.db.query.participants.findFirst({
        where: (participant, { eq }) => eq(participant.id, input),
        with: { pick: true },
      });
      if (!participant) {
        throw new TRPCClientError(`No result for id "${input}"`);
      }
      return { name: participant.name, pick: participant.pick!.name };
    }),

  create: publicProcedure
    .input(
      z.object({
        participants: z
          .array(z.string())
          .min(2, "Group can't be created with less than 2 participants"),
        name: z.string(),
      }),
    )
    .output(z.string())
    .mutation(async ({ ctx, input }) => {
      const groupId = createId();

      const newParticipants = input.participants.map(
        (participant) =>
          ({
            id: createId(),
            name: participant,
            groupId: groupId,
          }) as InsertParticipant,
      );
      drawSecretSanta(newParticipants);

      try {
        await ctx.db.transaction(async (tx) => {
          await tx.insert(groups).values({ id: groupId, name: input.name });
          await tx.insert(participants).values(newParticipants);
        });
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong 🙁",
        });
      }

      return groupId;
    }),
});

const drawSecretSanta = (participants: InsertParticipant[]) => {
  const unselected = [...participants];
  const firstPicker = unselected.splice(
    Math.floor(Math.random() * participants.length),
    1,
  )[0]!;
  let currentPicker = firstPicker;
  do {
    const pick = unselected.length
      ? unselected.splice(Math.floor(Math.random() * unselected.length), 1)[0]!
      : firstPicker;
    currentPicker.pickId = pick.id;
    currentPicker = pick;
  } while (currentPicker !== firstPicker);
};
