import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import type {
  Activity,
  CoordinationSpace,
  MatchGroup,
  User,
  UserActivityProfile,
} from "./activity-framework";
import {
  CURRENT_USER,
  GOLF_ACTIVITY,
  MATCH_GROUPS,
} from "./mock-data";

// ─── State shape ─────────────────────────────────────────────────────────────

interface GathrState {
  currentUser: User;
  activities: Activity[];
  matchGroups: MatchGroup[];
  activeMatchGroupId: string | null;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type GathrAction =
  | { type: "SET_ACTIVE_GROUP"; groupId: string }
  | { type: "JOIN_GROUP"; groupId: string }
  | { type: "LEAVE_GROUP"; groupId: string }
  | { type: "UPDATE_PROFILE"; activityId: string; profile: Partial<UserActivityProfile> }
  | { type: "CREATE_EVENT"; groupId: string; eventId: string }
  | { type: "UPDATE_USER"; payload: Partial<User> };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function gathrReducer(state: GathrState, action: GathrAction): GathrState {
  switch (action.type) {
    case "SET_ACTIVE_GROUP":
      return { ...state, activeMatchGroupId: action.groupId };

    case "JOIN_GROUP":
      return {
        ...state,
        matchGroups: state.matchGroups.map((g) =>
          g.id === action.groupId && !g.memberIds.includes(state.currentUser.id)
            ? { ...g, memberIds: [...g.memberIds, state.currentUser.id] }
            : g
        ),
        currentUser: {
          ...state.currentUser,
          matchGroups: state.currentUser.matchGroups.includes(action.groupId)
            ? state.currentUser.matchGroups
            : [...state.currentUser.matchGroups, action.groupId],
        },
      };

    case "LEAVE_GROUP":
      return {
        ...state,
        matchGroups: state.matchGroups.map((g) =>
          g.id === action.groupId
            ? { ...g, memberIds: g.memberIds.filter((id) => id !== state.currentUser.id) }
            : g
        ),
        currentUser: {
          ...state.currentUser,
          matchGroups: state.currentUser.matchGroups.filter((id) => id !== action.groupId),
        },
      };

    case "UPDATE_PROFILE": {
      const existingIdx = state.currentUser.activityProfiles.findIndex(
        (p) => p.activityId === action.activityId
      );
      const updatedProfiles =
        existingIdx >= 0
          ? state.currentUser.activityProfiles.map((p, i) =>
              i === existingIdx ? { ...p, ...action.profile } : p
            )
          : [
              ...state.currentUser.activityProfiles,
              {
                userId: state.currentUser.id,
                activityId: action.activityId,
                intensityLevel: "",
                thirdObject: "",
                frequencyGoal: "",
                fieldValues: {},
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                ...action.profile,
              } as UserActivityProfile,
            ];
      return {
        ...state,
        currentUser: { ...state.currentUser, activityProfiles: updatedProfiles },
      };
    }

    case "CREATE_EVENT":
      return {
        ...state,
        matchGroups: state.matchGroups.map((g) =>
          g.id === action.groupId
            ? {
                ...g,
                coordinationSpace: {
                  ...g.coordinationSpace,
                  upcomingEvents: [
                    ...g.coordinationSpace.upcomingEvents,
                    action.eventId,
                  ],
                },
              }
            : g
        ),
      };

    case "UPDATE_USER":
      return {
        ...state,
        currentUser: { ...state.currentUser, ...action.payload },
      };

    default:
      return state;
  }
}

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState: GathrState = {
  currentUser: CURRENT_USER,
  activities: [GOLF_ACTIVITY],
  matchGroups: MATCH_GROUPS,
  activeMatchGroupId: null,
};

// ─── Context ─────────────────────────────────────────────────────────────────

interface GathrContextValue {
  state: GathrState;
  dispatch: React.Dispatch<GathrAction>;
  setActiveGroup: (groupId: string) => void;
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  updateProfile: (activityId: string, profile: Partial<UserActivityProfile>) => void;
  createEvent: (groupId: string, eventId: string) => void;
  updateUser: (payload: Partial<User>) => void;
}

const GathrContext = createContext<GathrContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GathrProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gathrReducer, initialState);

  const setActiveGroup = (groupId: string) =>
    dispatch({ type: "SET_ACTIVE_GROUP", groupId });

  const joinGroup = (groupId: string) =>
    dispatch({ type: "JOIN_GROUP", groupId });

  const leaveGroup = (groupId: string) =>
    dispatch({ type: "LEAVE_GROUP", groupId });

  const updateProfile = (activityId: string, profile: Partial<UserActivityProfile>) =>
    dispatch({ type: "UPDATE_PROFILE", activityId, profile });

  const createEvent = (groupId: string, eventId: string) =>
    dispatch({ type: "CREATE_EVENT", groupId, eventId });

  const updateUser = (payload: Partial<User>) =>
    dispatch({ type: "UPDATE_USER", payload });

  return (
    <GathrContext.Provider
      value={{
        state,
        dispatch,
        setActiveGroup,
        joinGroup,
        leaveGroup,
        updateProfile,
        createEvent,
        updateUser,
      }}
    >
      {children}
    </GathrContext.Provider>
  );
}

// ─── useGathr ─────────────────────────────────────────────────────────────────

export function useGathr(): GathrContextValue {
  const ctx = useContext(GathrContext);
  if (!ctx) {
    throw new Error("useGathr must be used within a GathrProvider");
  }
  return ctx;
}

// ─── useActiveGroup ───────────────────────────────────────────────────────────

export function useActiveGroup(): { group: MatchGroup; coordinationSpace: CoordinationSpace } | null {
  const { state } = useGathr();
  if (!state.activeMatchGroupId) return null;
  const group = state.matchGroups.find((g) => g.id === state.activeMatchGroupId);
  if (!group) return null;
  return { group, coordinationSpace: group.coordinationSpace };
}

// ─── useUserProfile ───────────────────────────────────────────────────────────

export function useUserProfile(activityId: string): UserActivityProfile | undefined {
  const { state } = useGathr();
  return state.currentUser.activityProfiles.find((p) => p.activityId === activityId);
}
