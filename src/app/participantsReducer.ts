export interface Participant {
  id: string;
  name: string;
}

type ObjectValues<T> = T[keyof T];
export const PARTICIPANTS_ACTIONS = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
} as const;
export type ActionTypes = ObjectValues<typeof PARTICIPANTS_ACTIONS>;

export const participantsReducer = (
  participants: Participant[],
  action: { type: ActionTypes; participant?: Participant },
): Participant[] => {
  switch (action.type) {
    case PARTICIPANTS_ACTIONS.CREATE: {
      return [
        ...participants,
        { id: `${participants[participants.length - 1]!.id + 1}`, name: "" },
      ];
    }
    case PARTICIPANTS_ACTIONS.UPDATE: {
      return participants.map((participant) => {
        if (participant.id === action.participant!.id) {
          return action.participant!;
        } else {
          return participant;
        }
      });
    }
    case PARTICIPANTS_ACTIONS.DELETE: {
      return participants.filter(
        (participant) => participant.id !== action.participant!.id,
      );
    }
  }
};
