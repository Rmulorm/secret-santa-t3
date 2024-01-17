import Link from "next/link";
import { Separator } from "~/components/ui/separator";
import { db } from "~/server/db";

export default async function GroupPage({
  params,
}: {
  params: { id: string };
}) {
  const group = await db.query.groups.findFirst({
    where: (group, { eq }) => eq(group.id, params.id),
    with: { participants: { with: { pick: true } } },
  });

  return (
    <div className="flex h-full w-full content-center items-center justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl">O grupo {group?.name} ficou assim:</h1>

        <Separator />

        <div>
          {group?.participants.map((participant) => (
            <h2 className="text-xl" key={participant.id}>
              {`${participant.name} -> `}{" "}
              <Link href={`/result/${participant.id}`}>Link</Link>
            </h2>
          ))}
        </div>
      </div>
    </div>
  );
}
