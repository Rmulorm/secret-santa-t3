"use client";

import { useRouter } from "next/navigation";
import { useReducer, useState } from "react";
import { PlusIcon, ShuffleIcon, TrashIcon } from "@radix-ui/react-icons";
import { LoadingSpinner } from "~/components/loading";
import { Button } from "~/components/ui/button";

import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import {
  PARTICIPANTS_ACTIONS,
  type Participant,
  participantsReducer,
} from "./participantsReducer";

export default function GroupWizard() {
  const router = useRouter();

  const createGroupMutation = api.group.create.useMutation({
    onSuccess: (data) => {
      router.push(`/group/${data}`);
    },
  });

  return (
    <div className="flex w-full grow content-center items-center justify-center py-32 ">
      {createGroupMutation.isIdle && (
        <Editor createGroupMutation={createGroupMutation} />
      )}

      {createGroupMutation.isLoading && <LoadingSpinner />}
    </div>
  );
}

const Editor = (props: {
  createGroupMutation: ReturnType<typeof api.group.create.useMutation>;
}) => {
  const [participants, dispatch] = useReducer(participantsReducer, [
    { id: "0", name: "" } as Participant,
  ]);
  const [groupName, setGroupName] = useState("");

  const createParticipant = () => {
    dispatch({ type: PARTICIPANTS_ACTIONS.CREATE });
  };

  const updateParticipant = (id: string, name: string) => {
    dispatch({ type: PARTICIPANTS_ACTIONS.UPDATE, participant: { id, name } });
  };

  const deleteParticipant = (participant: Participant): void => {
    dispatch({ type: PARTICIPANTS_ACTIONS.DELETE, participant });
  };

  const isSortDisabled = () => {
    return participants.filter((participant) => participant.name).length < 2;
  };

  const onSortClick = () => {
    props.createGroupMutation.mutate({
      name: groupName,
      participants: participants.map((participant) => participant.name),
    });
  };

  return (
    <div className="flex w-80 flex-col content-center gap-4 ">
      <Input
        className="grow"
        type="text"
        placeholder="Nome do grupo..."
        value={groupName}
        onChange={(event) => {
          setGroupName(event.target.value);
        }}
      />

      <Separator />

      <ParticipantsList
        participants={participants}
        createParticipant={createParticipant}
        updateParticipant={updateParticipant}
        deleteParticipant={deleteParticipant}
      />

      <div className="flex grow gap-4">
        <Button
          className="flex grow justify-center rounded-full"
          onClick={createParticipant}
        >
          <PlusIcon className="size-8" />
        </Button>
        <Button
          className="flex grow justify-center rounded-full"
          onClick={(e) => {
            e.preventDefault();
            onSortClick();
          }}
          disabled={isSortDisabled()}
        >
          <ShuffleIcon className="size-8" />
        </Button>
      </div>
    </div>
  );
};

const ParticipantsList = (props: {
  participants: Participant[];
  createParticipant: () => void;
  updateParticipant: (id: string, value: string) => void;
  deleteParticipant: (participant: Participant) => void;
}) => {
  const { participants } = props;
  return (
    <div className="flex flex-col gap-4">
      {participants.map((participant, index) => (
        <div className="flex w-full gap-4" key={participant.id}>
          <Input
            className="grow"
            type="text"
            placeholder="Nome do participante..."
            value={participant.name}
            onKeyDown={(event) => {
              console.log(event.key);
              if (event.key === "Enter") props.createParticipant();
            }}
            onChange={(event) =>
              props.updateParticipant(participant.id, event.target.value)
            }
            autoFocus={index === participants.length - 1}
          />
          {participants.length >= 2 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => props.deleteParticipant(participant)}
            >
              <TrashIcon className="size-6 " />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};
