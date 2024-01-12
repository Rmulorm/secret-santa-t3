import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const participantWithPick = Prisma.validator<Prisma.ParticipantDefaultArgs>()({
  include: { pick: true },
});

type GroupParticipant = Prisma.ParticipantGetPayload<
  typeof participantWithPick
>;

export const groupRouter = createTRPCRouter({
  getResult: publicProcedure
    .input(z.string())
    .output(z.object({ name: z.string(), pick: z.string() }))
    .query(async ({ ctx, input }) => {
      const participant = await ctx.db.participant.findUniqueOrThrow({
        where: { id: input },
        include: { pick: true },
      });
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
    .output(
      z.array(z.object({ name: z.string(), pickName: z.optional(z.string()) })),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const { id: groupId } = await tx.group.create({
          data: {
            name: input.name,
            participants: {
              createMany: {
                data: input.participants.map((name) => ({
                  name,
                })),
              },
            },
          },
        });

        const participants = await tx.group
          .findUnique({ where: { id: groupId } })
          .participants({ include: { pick: true } });

        if (!participants) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Group with no participants created",
          });
        }
        drawSecretSanta(participants);
        for (const participant of participants) {
          await tx.participant.update({
            where: { id: participant.id },
            data: { pickId: participant.pickId },
          });
        }
        return participants.map((participant) => {
          return {
            name: participant.name,
            pickName: participant.pick?.name,
          };
        });
      });
    }),
});

const drawSecretSanta = (participants: GroupParticipant[]) => {
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
    currentPicker.pick = pick;
    currentPicker.pickId = pick.id;
    currentPicker = pick;
  } while (currentPicker !== firstPicker);
};
