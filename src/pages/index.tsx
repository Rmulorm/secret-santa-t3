import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useReducer } from "react";
import { FaPlus, FaRandom, FaTrashAlt } from "react-icons/fa";

// import { api } from "~/utils/api";

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <>
      <Head>
        <title>Amigue Secrete</title>
        <meta name="description" content="Amigue Secrete" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex justify-end">
        <div className="flex w-full justify-between border-b-2 p-2 px-10">
          <div className="content-center items-center">
            <h1>Amigue Secrete</h1>
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
            <ParticipantsWizard />
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

const ParticipantsWizard = () => {
  const [participants, dispatch] = useReducer(participantsReducer, [
    { id: "0", name: "" } as Participant,
  ]);

  const onAddHandler = () => {
    dispatch({ type: ACTION_TYPES.CREATE });
  };

  const onUpdateHandler = (id: string, name: string) => {
    dispatch({ type: ACTION_TYPES.UPDATE, participant: { id, name } });
  };

  const onDeletionHandler = (participant: Participant): void => {
    dispatch({ type: ACTION_TYPES.DELETE, participant });
  };

  const isSortDisabled = () => {
    return participants.filter((participant) => participant.name).length < 2;
  };

  return (
    <div className="flex w-80 flex-col content-center gap-4 ">
      <ParticipantsList
        participants={participants}
        onUpdate={onUpdateHandler}
        onDelete={onDeletionHandler}
      />

      <div className="flex grow gap-4">
        <button
          className="flex grow justify-center rounded-full bg-red-500"
          onClick={onAddHandler}
        >
          <FaPlus className="fill-black" />
        </button>
        <button
          className="flex grow justify-center rounded-full bg-red-500 disabled:bg-slate-500"
          // onClick={onAddParticipantClick}
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
  onUpdate: (id: string, value: string) => void;
  onDelete: (participant: Participant) => void;
}) => {
  const { participants } = props;
  return (
    <div className="flex flex-col gap-4">
      {participants.map((participant) => (
        <div className="flex w-full gap-4" key={participant.id}>
          <input
            className="grow text-slate-700"
            type="text"
            value={participant.name}
            onChange={(event) => {
              props.onUpdate(participant.id, event.target.value);
            }}
          />
          {participants.length >= 2 && (
            <button onClick={() => props.onDelete(participant)}>
              <FaTrashAlt className="fill-red-100" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
