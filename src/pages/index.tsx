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

const ParticipantsWizard = () => {
  const [participants, dispatch] = useReducer(participantsReducer, [
    { id: "0", name: "" } as Participant,
  ]);

  const onAddParticipantClick = () => {
    dispatch({ type: "add" });
  };

  const onParticipantNameChange = (id: string, name: string) => {
    dispatch({ type: "update", participant: { id, name } });
  };

  const onParticipantDeletion = (participant: Participant): void => {
    dispatch({ type: "remove", participant });
  };

  const isSortDisabled = () => {
    return (
      participants.filter((participant) => participant.name.length > 0).length <
      2
    );
  };

  return (
    <div className="flex w-80 flex-col content-center gap-4 ">
      <ParticipantsList
        participants={participants}
        onUpdate={onParticipantNameChange}
        onDelete={onParticipantDeletion}
      />

      <div className="flex grow gap-4">
        <button
          className="flex grow justify-center rounded-full bg-red-500"
          onClick={onAddParticipantClick}
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
  action: { type: string; participant?: Participant },
): Participant[] => {
  switch (action.type) {
    case "add": {
      return [
        ...participants,
        { id: `${participants[participants.length - 1]!.id + 1}`, name: "" },
      ];
    }
    case "update": {
      return participants.map((participant) => {
        if (participant.id === action.participant!.id) {
          return action.participant!;
        } else {
          return participant;
        }
      });
    }
    case "remove": {
      return participants.filter(
        (participant) => participant.id !== action.participant!.id,
      );
    }
    default:
      throw Error("Unknown action: " + action.type);
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
