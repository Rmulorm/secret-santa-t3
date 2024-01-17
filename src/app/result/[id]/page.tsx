import { Separator } from "~/components/ui/separator";
import { db } from "~/server/db";

export default async function GroupPage({
  params,
}: {
  params: { id: string };
}) {
  const participant = await db.query.participants.findFirst({
    where: (participant, { eq }) => eq(participant.id, params.id),
    with: { pick: true },
  });

  return (
    <div className="flex h-full w-full content-center items-center justify-center text-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">
          Olá {participant?.name}, o seu amigo secreto é:
        </h1>

        <Separator />

        <h2 className="text-xl">{participant?.pick?.name}</h2>
      </div>
    </div>
  );
}
