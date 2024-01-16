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
    <div>
      <h1>O grupo {group?.name} ficou assim:</h1>
      {group?.participants.map((participant) => (
        <h2
          key={participant.id}
        >{`${participant.name} -> ${participant.pick?.name}`}</h2>
      ))}
    </div>
  );
}
