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
  create: publicProcedure
    .input(
      z.object({
        participants: z
          .array(z.string())
          .min(2, "Group can't be created with less than 2 participants"),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (tx) => {
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
        return new Map(
          participants.map((participant) => [
            participant.name,
            participant.pick?.name,
          ]),
        );
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