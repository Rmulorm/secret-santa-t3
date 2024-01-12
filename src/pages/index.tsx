import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useReducer, useState } from "react";
import { FaPlus, FaRandom, FaTrashAlt } from "react-icons/fa";
import { LoadingSpinner } from "~/components/loading";

import { api } from "~/utils/api";

export default function Home() {
  const { isSignedIn } = useUser();
  const createGroupMutation = api.group.create.useMutation();

  return (
    <>
      <Head>
        <title>Miguis</title>
        <meta name="description" content="Amigue Secrete" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex justify-end">
        <div className="flex w-full justify-between border-b-2 p-2 px-10">
          <div className="content-center items-center">
            <h1>Migis</h1>
          </div>
          <div>
            {!isSignedIn && <SignInButton />}
            {isSignedIn && <UserButton />}
          </div>
        </div>
      </header>
      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-4xl">
          <div className="flex h-full w-full content-center items-center justify-center ">
            {createGroupMutation.isIdle && (
              <GroupWizard createGroupMutation={createGroupMutation} />
            )}

            {createGroupMutation.isLoading && <LoadingSpinner />}

            {createGroupMutation.isSuccess && (
              <RaffleOutcome createGroupMutation={createGroupMutation} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}

interface Participant {
  id: string;
  name: string;
}

type ObjectValues<T> = T[keyof T];
const ACTION_TYPES = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
} as const;
type ActionTypes = ObjectValues<typeof ACTION_TYPES>;

const GroupWizard = (props: {
  createGroupMutation: ReturnType<typeof api.group.create.useMutation>;
}) => {
  const [participants, dispatch] = useReducer(participantsReducer, [
    { id: "0", name: "" } as Participant,
  ]);
  const [groupName, setGroupName] = useState("");

  const createParticipant = () => {
    dispatch({ type: ACTION_TYPES.CREATE });
  };

  const updateParticipant = (id: string, name: string) => {
    dispatch({ type: ACTION_TYPES.UPDATE, participant: { id, name } });
  };

  const deleteParticipant = (participant: Participant): void => {
    dispatch({ type: ACTION_TYPES.DELETE, participant });
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
      <input
        className="grow text-slate-700"
        type="text"
        placeholder="Digite o nome do grupo"
        value={groupName}
        onChange={(event) => {
          setGroupName(event.target.value);
        }}
      />

      <ParticipantsList
        participants={participants}
        createParticipant={createParticipant}
        updateParticipant={updateParticipant}
        deleteParticipant={deleteParticipant}
      />

      <div className="flex grow gap-4">
        <button
          className="flex grow justify-center rounded-full bg-red-500"
          onClick={createParticipant}
        >
          <FaPlus className="fill-black" />
        </button>
        <button
          className="flex grow justify-center rounded-full bg-red-500 disabled:bg-slate-500"
          onClick={onSortClick}
          disabled={isSortDisabled()}
        >
          <FaRandom className="fill-black" />
        </button>
      </div>
    </div>
  );
};

const participantsReducer = (
  participants: Participant[],
  action: { type: ActionTypes; participant?: Participant },
): Participant[] => {
  switch (action.type) {
    case ACTION_TYPES.CREATE: {
      return [
        ...participants,
        { id: `${participants[participants.length - 1]!.id + 1}`, name: "" },
      ];
    }
    case ACTION_TYPES.UPDATE: {
      return participants.map((participant) => {
        if (participant.id === action.participant!.id) {
          return action.participant!;
        } else {
          return participant;
        }
      });
    }
    case ACTION_TYPES.DELETE: {
      return participants.filter(
        (participant) => participant.id !== action.participant!.id,
      );
    }
  }
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
          <input
            className="grow text-slate-700"
            type="text"
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
            <button onClick={() => props.deleteParticipant(participant)}>
              <FaTrashAlt className="fill-red-100" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const RaffleOutcome = (props: {
  createGroupMutation: ReturnType<typeof api.group.create.useMutation>;
}) => {
  return (
    <div>
      {props.createGroupMutation.data!.map((participant, index) => (
        <h1 key={index}>{`${participant.name} -> ${participant.pickName}`}</h1>
      ))}
      <button
        type="button"
        className="rounded-full bg-red-700 px-5 py-2.5 text-center font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
        onClick={() => props.createGroupMutation.reset()}
      >
        Novo Sorteio
      </button>
    </div>
  );
};
