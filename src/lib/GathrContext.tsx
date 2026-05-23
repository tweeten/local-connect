import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import {
  CURRENT_USER,
  COMMUNITIES,
  EVENTS,
  type User,
  type Community,
  type GathrEvent,
} from "./gather-data";

// ─── State shape ─────────────────────────────────────────────────────────────

interface GathrState {
  currentUser: User;
  communities: Community[];
  events: GathrEvent[];
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type GathrAction =
  | { type: "JOIN_COMMUNITY"; communityId: string }
  | { type: "LEAVE_COMMUNITY"; communityId: string }
  | { type: "JOIN_EVENT"; eventId: string }
  | { type: "LEAVE_EVENT"; eventId: string }
  | { type: "TOGGLE_ATTENDANCE"; eventId: string }
  | { type: "UPDATE_USER"; payload: Partial<User> };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function gathrReducer(state: GathrState, action: GathrAction): GathrState {
  switch (action.type) {
    case "JOIN_COMMUNITY":
      return {
        ...state,
        communities: state.communities.map((c) =>
          c.id === action.communityId ? { ...c, isJoined: true } : c
        ),
        currentUser: {
          ...state.currentUser,
          communitiesCount: state.currentUser.communitiesCount + 1,
        },
      };

    case "LEAVE_COMMUNITY":
      return {
        ...state,
        communities: state.communities.map((c) =>
          c.id === action.communityId ? { ...c, isJoined: false } : c
        ),
        currentUser: {
          ...state.currentUser,
          communitiesCount: Math.max(0, state.currentUser.communitiesCount - 1),
        },
      };

    case "JOIN_EVENT":
    case "TOGGLE_ATTENDANCE": {
      const event = state.events.find((e) => e.id === action.eventId);
      if (!event) return state;
      const wasAttending = event.isAttending;
      return {
        ...state,
        events: state.events.map((e) => {
          if (e.id !== action.eventId) return e;
          return {
            ...e,
            isAttending: !wasAttending,
            totalAttendees: wasAttending
              ? e.totalAttendees - 1
              : e.totalAttendees + 1,
            attendees: wasAttending
              ? e.attendees.filter((u) => u.id !== state.currentUser.id)
              : [state.currentUser, ...e.attendees],
          };
        }),
        currentUser: wasAttending
          ? state.currentUser
          : {
              ...state.currentUser,
              eventsAttended: state.currentUser.eventsAttended + 1,
            },
      };
    }

    case "LEAVE_EVENT": {
      return {
        ...state,
        events: state.events.map((e) => {
          if (e.id !== action.eventId || !e.isAttending) return e;
          return {
            ...e,
            isAttending: false,
            totalAttendees: e.totalAttendees - 1,
            attendees: e.attendees.filter(
              (u) => u.id !== state.currentUser.id
            ),
          };
        }),
      };
    }

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
  communities: COMMUNITIES,
  events: EVENTS,
};

// ─── Context ─────────────────────────────────────────────────────────────────

interface GathrContextValue {
  state: GathrState;
  dispatch: React.Dispatch<GathrAction>;
  // Convenience helpers
  joinCommunity: (communityId: string) => void;
  leaveCommunity: (communityId: string) => void;
  toggleAttendance: (eventId: string) => void;
  updateUser: (payload: Partial<User>) => void;
  isJoined: (communityId: string) => boolean;
  isAttending: (eventId: string) => boolean;
  joinedCommunities: Community[];
  attendingEvents: GathrEvent[];
}

const GathrContext = createContext<GathrContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function GathrProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gathrReducer, initialState);

  const joinCommunity = (communityId: string) =>
    dispatch({ type: "JOIN_COMMUNITY", communityId });

  const leaveCommunity = (communityId: string) =>
    dispatch({ type: "LEAVE_COMMUNITY", communityId });

  const toggleAttendance = (eventId: string) =>
    dispatch({ type: "TOGGLE_ATTENDANCE", eventId });

  const updateUser = (payload: Partial<User>) =>
    dispatch({ type: "UPDATE_USER", payload });

  const isJoined = (communityId: string) =>
    state.communities.find((c) => c.id === communityId)?.isJoined ?? false;

  const isAttending = (eventId: string) =>
    state.events.find((e) => e.id === eventId)?.isAttending ?? false;

  const joinedCommunities = state.communities.filter((c) => c.isJoined);
  const attendingEvents = state.events.filter((e) => e.isAttending);

  return (
    <GathrContext.Provider
      value={{
        state,
        dispatch,
        joinCommunity,
        leaveCommunity,
        toggleAttendance,
        updateUser,
        isJoined,
        isAttending,
        joinedCommunities,
        attendingEvents,
      }}
    >
      {children}
    </GathrContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGathr(): GathrContextValue {
  const ctx = useContext(GathrContext);
  if (!ctx) {
    throw new Error("useGathr must be used within a GathrProvider");
  }
  return ctx;
}
