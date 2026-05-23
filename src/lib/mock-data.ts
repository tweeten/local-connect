/**
 * mock-data.ts
 *
 * Golf activity mock data for the Gathr coordination platform.
 * All types imported from activity-framework.ts — single source of truth for mock data.
 */

import type {
  Activity,
  CoordinationSpace,
  MatchGroup,
  User,
  UserActivityProfile,
} from "./activity-framework";

// ─── Legacy Types ─────────────────────────────────────────────────────────────

export interface LegacyUser {
  id: string;
  firstName: string;
  avatarUrl?: string;
  neighborhood: string;
  memberSince: string;
  eventsAttended: number;
  communitiesCount: number;
  connectionsCount: number;
  streakWeeks: number;
}

export interface GathrEvent {
  id: string;
  name: string;
  location: string;
  address: string;
  lat: number;
  lng: number;
  dateTime: string;
  communityId: string;
  communityName: string;
  attendees: LegacyUser[];
  totalAttendees: number;
  isSoon: boolean;
  isAttending: boolean;
  description: string;
  host: LegacyUser;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  accentColor: "amber" | "sage" | "coral" | "terracotta" | "dusty-blue";
  activityPulse: string;
  isJoined: boolean;
  suggestionLine?: string;
  category: "Sports" | "Family" | "Outdoors" | "Food & drink" | "Fitness" | "Arts & culture";
  weeklyGrowth?: number;
}

// ─── Helper: accent color → Tailwind bg class ─────────────────────────────────

export const ACCENT_COLOR_CLASS: Record<Community["accentColor"], string> = {
  amber: "bg-gathr-amber",
  sage: "bg-gathr-sage",
  coral: "bg-gathr-coral",
  terracotta: "bg-gathr-terracotta",
  "dusty-blue": "bg-gathr-dusty-blue",
};

// ─── Helper: get two-letter initials from a user ─────────────────────────────

export function getUserInitials(user: { firstName: string }): string {
  return user.firstName.slice(0, 2).toUpperCase();
}

// ─── Helper: format a dateTime string for display ────────────────────────────

export function formatEventDate(dateTime: string): string {
  const d = new Date(dateTime);
  const day = d.toLocaleDateString("en-US", { weekday: "short" });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${day} · ${time}`;
}

// ─── Legacy Users ────────────────────────────────────────────────────────────

const LEGACY_CURRENT_USER: LegacyUser = {
  id: "u-alex",
  firstName: "Alex",
  neighborhood: "Eagan",
  memberSince: "Aug 2024",
  eventsAttended: 12,
  communitiesCount: 5,
  connectionsCount: 8,
  streakWeeks: 4,
};

const LEGACY_USERS: LegacyUser[] = [
  LEGACY_CURRENT_USER,
  { id: "u-sam", firstName: "Sam", neighborhood: "Minneapolis", memberSince: "Jan 2024", eventsAttended: 23, communitiesCount: 4, connectionsCount: 17, streakWeeks: 8 },
  { id: "u-jordan", firstName: "Jordan", neighborhood: "St. Paul", memberSince: "Mar 2024", eventsAttended: 18, communitiesCount: 3, connectionsCount: 11, streakWeeks: 6 },
  { id: "u-ryan", firstName: "Ryan", neighborhood: "Eagan", memberSince: "Sep 2023", eventsAttended: 31, communitiesCount: 6, connectionsCount: 24, streakWeeks: 12 },
  { id: "u-kelly", firstName: "Kelly", neighborhood: "Bloomington", memberSince: "Feb 2024", eventsAttended: 9, communitiesCount: 2, connectionsCount: 6, streakWeeks: 3 },
  { id: "u-ben-n", firstName: "Ben", neighborhood: "Edina", memberSince: "Nov 2023", eventsAttended: 15, communitiesCount: 4, connectionsCount: 13, streakWeeks: 5 },
  { id: "u-emily", firstName: "Emily", neighborhood: "Minneapolis", memberSince: "Apr 2024", eventsAttended: 7, communitiesCount: 3, connectionsCount: 5, streakWeeks: 2 },
  { id: "u-eric", firstName: "Eric", neighborhood: "Lakeville", memberSince: "Jun 2023", eventsAttended: 41, communitiesCount: 5, connectionsCount: 29, streakWeeks: 16 },
  { id: "u-nora", firstName: "Nora", neighborhood: "St. Paul", memberSince: "Jan 2025", eventsAttended: 4, communitiesCount: 2, connectionsCount: 3, streakWeeks: 1 },
  { id: "u-tyler", firstName: "Tyler", neighborhood: "Maple Grove", memberSince: "Oct 2023", eventsAttended: 22, communitiesCount: 4, connectionsCount: 18, streakWeeks: 9 },
  { id: "u-maya", firstName: "Maya", neighborhood: "St. Paul", memberSince: "Mar 2024", eventsAttended: 11, communitiesCount: 3, connectionsCount: 8, streakWeeks: 4 },
  { id: "u-derek", firstName: "Derek", neighborhood: "Minneapolis", memberSince: "Jul 2023", eventsAttended: 35, communitiesCount: 7, connectionsCount: 31, streakWeeks: 14 },
  { id: "u-anna", firstName: "Anna", neighborhood: "Plymouth", memberSince: "Dec 2023", eventsAttended: 16, communitiesCount: 3, connectionsCount: 12, streakWeeks: 6 },
  { id: "u-ben-l", firstName: "Ben", neighborhood: "Minneapolis", memberSince: "May 2023", eventsAttended: 44, communitiesCount: 5, connectionsCount: 38, streakWeeks: 18 },
  { id: "u-grace", firstName: "Grace", neighborhood: "Minneapolis", memberSince: "Aug 2023", eventsAttended: 28, communitiesCount: 4, connectionsCount: 21, streakWeeks: 11 },
  { id: "u-vic", firstName: "Vic", neighborhood: "St. Paul", memberSince: "Feb 2024", eventsAttended: 13, communitiesCount: 3, connectionsCount: 9, streakWeeks: 5 },
  { id: "u-james", firstName: "James", neighborhood: "Burnsville", memberSince: "Sep 2024", eventsAttended: 6, communitiesCount: 2, connectionsCount: 4, streakWeeks: 2 },
];

export const USER_BY_ID = Object.fromEntries(LEGACY_USERS.map((u) => [u.id, u]));

// ─── Communities ─────────────────────────────────────────────────────────────

export const COMMUNITIES: Community[] = [
  { id: "vikings", name: "Vikings Fans — Twin Cities", description: "Sundays, Skol chants, and stadium energy.", memberCount: 1284, accentColor: "coral", activityPulse: "Game day tailgate this Sunday", isJoined: true, category: "Sports", weeklyGrowth: 31 },
  { id: "family", name: "Family Adventures — Eagan", description: "Parents who'd rather not spend Saturday at home.", memberCount: 388, accentColor: "sage", activityPulse: "12 people heading to Como Zoo Saturday", isJoined: true, category: "Family", weeklyGrowth: 14 },
  { id: "outdoor", name: "Outdoor & Trails — Twin Cities", description: "Trails, climbs, lakes, and long Saturday mornings.", memberCount: 521, accentColor: "dusty-blue", activityPulse: "New conversation: Best fall hikes?", isJoined: true, category: "Outdoors", weeklyGrowth: 24 },
  { id: "food", name: "Food & Drink — Twin Cities", description: "New spots, neighborhood gems, and patio season.", memberCount: 734, accentColor: "terracotta", activityPulse: "3 events this weekend", isJoined: true, category: "Food & drink", weeklyGrowth: 19 },
  { id: "twins", name: "Twins Fans — Twin Cities", description: "Target Field regulars and dollar dog die-hards.", memberCount: 942, accentColor: "coral", activityPulse: "New conversation: Best seats for dollar dog night", isJoined: false, suggestionLine: "Popular with Vikings Fans members", category: "Sports", weeklyGrowth: 18 },
  { id: "wild", name: "Wild Hockey — Twin Cities", description: "Puck drops, watch parties, and rec league chat.", memberCount: 612, accentColor: "sage", activityPulse: "Watch party tonight — 34 going", isJoined: false, suggestionLine: "8 people in Eagan just joined", category: "Sports", weeklyGrowth: 22 },
  { id: "pickup", name: "Weekend Pickup Sports — Twin Cities", description: "Soccer, basketball, frisbee — whoever shows up.", memberCount: 264, accentColor: "amber", activityPulse: "Soccer pickup Saturday at 6pm", isJoined: false, suggestionLine: "Popular with Outdoor & Trails members", category: "Sports", weeklyGrowth: 9 },
  { id: "breweries", name: "Breweries & Taprooms — Twin Cities", description: "Local craft, rotating taps, and good people.", memberCount: 441, accentColor: "terracotta", activityPulse: "New: Surly patio season is here", isJoined: false, suggestionLine: "Popular with Food & Drink members", category: "Food & drink", weeklyGrowth: 11 },
  { id: "run-club", name: "Twin Cities Run Club", description: "Morning miles, post-run coffee, and race day crew.", memberCount: 318, accentColor: "sage", activityPulse: "Sunday long run — 6am Minnehaha", isJoined: false, suggestionLine: "Popular with Outdoor & Trails members", category: "Fitness", weeklyGrowth: 16 },
  { id: "yoga-parks", name: "Yoga in the Parks — Twin Cities", description: "Free outdoor classes all summer long.", memberCount: 197, accentColor: "dusty-blue", activityPulse: "Saturday Loring Park class — 27 going", isJoined: false, suggestionLine: "Growing fast in Eagan", category: "Fitness", weeklyGrowth: 21 },
  { id: "arts-music", name: "Arts & Music — Twin Cities", description: "Gallery openings, live music, and creative meetups.", memberCount: 276, accentColor: "amber", activityPulse: "Open mic at Amsterdam tonight", isJoined: false, suggestionLine: "New community — 40 joined this week", category: "Arts & culture", weeklyGrowth: 40 },
  { id: "theater", name: "Twin Cities Theater Lovers", description: "Guthrie regulars, Fringe devotees, and improv fans.", memberCount: 154, accentColor: "terracotta", activityPulse: "Fringe Festival tickets — group discount", isJoined: false, suggestionLine: "Popular with Arts & Music members", category: "Arts & culture", weeklyGrowth: 8 },
];

// ─── Events ──────────────────────────────────────────────────────────────────

function u(...ids: string[]): LegacyUser[] {
  return ids.map((id) => USER_BY_ID[id]).filter(Boolean);
}

export const EVENTS: GathrEvent[] = [
  { id: "vikes", name: "Vikings vs Packers tailgate", communityId: "vikings", communityName: "Vikings Fans", location: "US Bank Stadium · Lot C", address: "401 Chicago Ave, Minneapolis, MN 55415", lat: 44.9735, lng: -93.2575, dateTime: "2026-05-24T13:00:00", attendees: u("u-sam", "u-anna", "u-ryan", "u-kelly", "u-ben-n", "u-emily"), totalAttendees: 47, isSoon: true, isAttending: false, description: "Pulling up early to Lot C around 10. Blue tent, brats on the grill, bring a chair. Heading in together around 12:30.", host: USER_BY_ID["u-sam"] },
  { id: "trail", name: "Saturday trail run", communityId: "outdoor", communityName: "Outdoor & Trails", location: "Lebanon Hills · Eagan", address: "860 Cliff Rd, Eagan, MN 55123", lat: 44.8062, lng: -93.2084, dateTime: "2026-05-23T08:00:00", attendees: u("u-eric", "u-nora", "u-tyler", "u-maya"), totalAttendees: 12, isSoon: true, isAttending: false, description: "Easy 6 miles, coffee after at the trailhead. All paces welcome.", host: USER_BY_ID["u-eric"] },
  { id: "park", name: "Kids + coffee at the park", communityId: "family", communityName: "Family Adventures", location: "Como Regional Park", address: "1199 Midway Pkwy, St Paul, MN 55103", lat: 44.9813, lng: -93.1517, dateTime: "2026-05-23T10:00:00", attendees: u("u-maya", "u-derek", "u-anna"), totalAttendees: 8, isSoon: true, isAttending: false, description: "Meet at the big playground. Bringing donuts and a thermos.", host: USER_BY_ID["u-maya"] },
  { id: "trivia", name: "Trivia night @ Surly", communityId: "food", communityName: "Food & Drink", location: "Surly Brewing · Mpls", address: "520 Malcolm Ave SE, Minneapolis, MN 55414", lat: 44.9732, lng: -93.2212, dateTime: "2026-05-28T19:00:00", attendees: u("u-ben-l", "u-vic", "u-james", "u-grace"), totalAttendees: 19, isSoon: false, isAttending: false, description: "Teams of 4–6. Grabbing the big booth in back. We're 'The Hot Dish'.", host: USER_BY_ID["u-ben-l"] },
  { id: "bbq", name: "Backyard BBQ in Eagan", communityId: "family", communityName: "Family Adventures", location: "Private backyard · Eagan", address: "Eagan, MN 55122", lat: 44.804, lng: -93.167, dateTime: "2026-05-24T16:00:00", attendees: u("u-alex", "u-sam", "u-ryan", "u-kelly", "u-james", "u-emily"), totalAttendees: 18, isSoon: false, isAttending: true, description: "Kids welcome. Bring a dish to share. Pool will be open. Dogs too.", host: USER_BY_ID["u-alex"] },
];

// ─── Connections map ─────────────────────────────────────────────────────────

export const CONNECTIONS: Record<string, string[]> = {
  "u-alex":   ["u-sam", "u-ryan", "u-kelly", "u-james", "u-emily", "u-jordan", "u-ben-n", "u-tyler"],
  "u-sam":    ["u-alex", "u-ryan", "u-jordan", "u-ben-l", "u-derek", "u-anna", "u-kelly", "u-ben-n"],
  "u-jordan": ["u-sam", "u-ryan", "u-emily", "u-anna", "u-grace", "u-alex"],
  "u-ryan":   ["u-alex", "u-sam", "u-jordan", "u-kelly", "u-ben-n", "u-emily", "u-derek", "u-tyler"],
  "u-kelly":  ["u-alex", "u-ryan", "u-emily", "u-anna", "u-james", "u-derek", "u-ben-n", "u-vic"],
  "u-ben-n":  ["u-sam", "u-ryan", "u-kelly", "u-derek", "u-james", "u-vic", "u-alex"],
  "u-emily":  ["u-ryan", "u-jordan", "u-kelly", "u-anna", "u-james", "u-maya", "u-alex"],
  "u-eric":   ["u-nora", "u-tyler", "u-maya", "u-anna", "u-derek"],
  "u-nora":   ["u-eric", "u-maya", "u-vic", "u-anna"],
  "u-tyler":  ["u-eric", "u-ryan", "u-james", "u-derek", "u-anna", "u-alex"],
  "u-maya":   ["u-eric", "u-nora", "u-derek", "u-kelly", "u-emily", "u-james"],
  "u-derek":  ["u-ben-l", "u-grace", "u-eric", "u-kelly", "u-ben-n", "u-vic", "u-tyler", "u-sam"],
  "u-anna":   ["u-jordan", "u-emily", "u-kelly", "u-nora", "u-grace", "u-ben-n", "u-eric", "u-tyler"],
  "u-ben-l":  ["u-ben-n", "u-vic", "u-james", "u-grace", "u-derek", "u-sam"],
  "u-grace":  ["u-tyler", "u-derek", "u-ben-l", "u-anna", "u-jordan", "u-vic"],
  "u-vic":    ["u-derek", "u-kelly", "u-james", "u-ben-l", "u-grace", "u-nora", "u-ben-n"],
  "u-james":  ["u-kelly", "u-ben-n", "u-vic", "u-tyler", "u-maya", "u-emily", "u-alex"],
};

export function getMutualConnections(userAId: string, userBId: string): LegacyUser[] {
  const aConns = new Set(CONNECTIONS[userAId] ?? []);
  const bConns = new Set(CONNECTIONS[userBId] ?? []);
  return [...aConns].filter((id) => bConns.has(id)).map((id) => USER_BY_ID[id]).filter(Boolean);
}

export function getSharedCommunities(userAId: string, userBId: string): string[] {
  const aEventCommunities = new Set(
    EVENTS.filter((e) => e.attendees.some((att) => att.id === userAId) || e.host.id === userAId).map((e) => e.communityId),
  );
  const bEventCommunities = new Set(
    EVENTS.filter((e) => e.attendees.some((att) => att.id === userBId) || e.host.id === userBId).map((e) => e.communityId),
  );
  return [...aEventCommunities].filter((id) => bEventCommunities.has(id));
}

// ─── ChatMessage ──────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

// ─── Thread stub ──────────────────────────────────────────────────────────────

export interface ThreadStub {
  id: string;
  matchGroupId: string;
  title: string;
  preview: string;
  authorId: string;
  replyCount: number;
  timestamp: string;
}

// ─── Recent session (activity card in feed) ───────────────────────────────────

export interface RecentSession {
  id: string;
  matchGroupId: string;
  userId: string;
  courseName: string;
  score: number;
  date: string;
}

// ─── Scheduled session (tee time) ─────────────────────────────────────────────

export interface ScheduledSession {
  id: string;
  matchGroupId: string;
  date: string;
  time: string;
  courseName: string;
  confirmedMemberIds: string[];
  status: "upcoming" | "past";
  scores?: Record<string, number>;
}

// ─── GOLF_ACTIVITY ────────────────────────────────────────────────────────────

export const GOLF_ACTIVITY: Activity = {
  id: "golf",
  name: "Golf",
  slug: "golf",
  icon: "Flag",
  description: "Find your foursome — matched by skill, intensity, and schedule.",
  coordinationSchema: {
    minGroupSize: 2,
    maxGroupSize: 5,
    idealGroupSize: 4,
    schedulingMode: "both",
    matchCriteria: [
      { field: "skill-level",       weight: 0.9, tolerance: "similar"  },
      { field: "intensity",         weight: 0.8, tolerance: "exact"    },
      { field: "frequencyGoal",     weight: 0.7, tolerance: "similar"  },
      { field: "preferred-format",  weight: 0.5, tolerance: "flexible" },
    ],
  },
  profileFields: [
    {
      id: "skill-level",
      label: "Typical Score",
      type: "range",
      range: { min: 60, max: 130, step: 1, unit: "strokes" },
      required: true,
    },
    {
      id: "preferred-format",
      label: "Preferred Format",
      type: "select",
      options: [
        { value: "stroke-play",  label: "Stroke Play"  },
        { value: "match-play",   label: "Match Play"   },
        { value: "scramble",     label: "Scramble"     },
        { value: "best-ball",    label: "Best Ball"    },
      ],
      required: true,
    },
    {
      id: "walking-preference",
      label: "Walking Preference",
      type: "select",
      options: [
        { value: "always-walk",   label: "Always Walk"      },
        { value: "prefer-cart",   label: "Prefer Cart"      },
        { value: "no-preference", label: "No Preference"    },
      ],
      required: false,
    },
    {
      id: "social-preference",
      label: "Round Vibe",
      type: "select",
      options: [
        { value: "social",    label: "Social Round"      },
        { value: "focused",   label: "Focused Practice"  },
        { value: "mix",       label: "Mix of Both"       },
      ],
      required: false,
    },
    {
      id: "preferred-tee-time",
      label: "Preferred Tee Time",
      type: "multi-select",
      options: [
        { value: "early-morning", label: "Early Morning (before 8am)" },
        { value: "mid-morning",   label: "Mid-Morning (8–11am)"       },
        { value: "afternoon",     label: "Afternoon (11am–3pm)"       },
        { value: "twilight",      label: "Twilight (after 4pm)"       },
      ],
      required: false,
    },
    {
      id: "home-course",
      label: "Home Course or Area",
      type: "text",
      required: false,
    },
  ],
  intensityLevels: [
    {
      id: "weekend-warrior",
      label: "Weekend Warrior",
      description: "Plays a few times a month, mostly for fun.",
      order: 1,
    },
    {
      id: "building-a-game",
      label: "Building a Game",
      description: "Plays weekly, actively improving.",
      order: 2,
    },
    {
      id: "getting-serious",
      label: "Getting Serious",
      description: "Plays 2–3x/week, takes lessons, tracks stats.",
      order: 3,
    },
    {
      id: "competitive",
      label: "Competitive",
      description: "Tournament player, single-digit handicap, structured practice.",
      order: 4,
    },
  ],
};

// ─── Helper to build a UserActivityProfile ────────────────────────────────────

function golfProfile(
  userId: string,
  intensityLevel: string,
  thirdObject: string,
  frequencyGoal: string,
  fieldValues: Record<string, unknown>,
): UserActivityProfile {
  return {
    userId,
    activityId: "golf",
    intensityLevel,
    thirdObject,
    frequencyGoal,
    fieldValues,
    createdAt: "2026-02-01T00:00:00Z",
    updatedAt: "2026-05-01T00:00:00Z",
  };
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export const CURRENT_USER: User = {
  id: "u-current",
  firstName: "Tyler",
  neighborhood: "Eagan",
  memberSince: "2025-09-15",
  eventsAttended: 14,
  communitiesCount: 3,
  connectionsCount: 22,
  streakWeeks: 6,
  matchGroups: ["mg-saturday-crew"],
  activityProfiles: [
    golfProfile(
      "u-current",
      "building-a-game",
      "Break 90 before the end of summer",
      "Once a week",
      {
        "skill-level": 93,
        "preferred-format": "stroke-play",
        "walking-preference": "prefer-cart",
        "social-preference": "mix",
        "preferred-tee-time": ["early-morning", "mid-morning"],
        "home-course": "Eastview Golf Course, Apple Valley",
      },
    ),
  ],
};

export const USERS: User[] = [
  CURRENT_USER,

  // ── Building a Game (Saturday Morning Crew members) ──────────────────────
  {
    id: "u-marcus",
    firstName: "Marcus",
    neighborhood: "Burnsville",
    memberSince: "2025-10-02",
    eventsAttended: 18,
    communitiesCount: 2,
    connectionsCount: 17,
    streakWeeks: 9,
    matchGroups: ["mg-saturday-crew"],
    activityProfiles: [
      golfProfile(
        "u-marcus",
        "building-a-game",
        "Play 36 holes every weekend this summer",
        "2x per week",
        {
          "skill-level": 88,
          "preferred-format": "stroke-play",
          "walking-preference": "always-walk",
          "social-preference": "mix",
          "preferred-tee-time": ["early-morning", "mid-morning"],
          "home-course": "Crystal Lake Golf Club, Burnsville",
        },
      ),
    ],
  },
  {
    id: "u-devin",
    firstName: "Devin",
    neighborhood: "Apple Valley",
    memberSince: "2026-01-10",
    eventsAttended: 8,
    communitiesCount: 2,
    connectionsCount: 11,
    streakWeeks: 4,
    matchGroups: ["mg-saturday-crew"],
    activityProfiles: [
      golfProfile(
        "u-devin",
        "building-a-game",
        "Get my handicap under 10",
        "Once a week",
        {
          "skill-level": 97,
          "preferred-format": "best-ball",
          "walking-preference": "prefer-cart",
          "social-preference": "social",
          "preferred-tee-time": ["mid-morning"],
          "home-course": "Valleywood Golf Course, Apple Valley",
        },
      ),
    ],
  },
  {
    id: "u-keisha",
    firstName: "Keisha",
    neighborhood: "Lakeville",
    memberSince: "2025-11-20",
    eventsAttended: 11,
    communitiesCount: 4,
    connectionsCount: 29,
    streakWeeks: 7,
    matchGroups: ["mg-saturday-crew"],
    activityProfiles: [
      golfProfile(
        "u-keisha",
        "building-a-game",
        "Shoot in the 80s before October",
        "Once a week",
        {
          "skill-level": 91,
          "preferred-format": "stroke-play",
          "walking-preference": "no-preference",
          "social-preference": "mix",
          "preferred-tee-time": ["early-morning", "mid-morning"],
          "home-course": "Lakeville Golf Center",
        },
      ),
    ],
  },

  // ── Getting Serious (South Metro Grinders) ───────────────────────────────
  {
    id: "u-ryan",
    firstName: "Ryan",
    neighborhood: "Edina",
    memberSince: "2025-08-05",
    eventsAttended: 24,
    communitiesCount: 3,
    connectionsCount: 41,
    streakWeeks: 14,
    matchGroups: ["mg-grinders"],
    activityProfiles: [
      golfProfile(
        "u-ryan",
        "getting-serious",
        "Qualify for the club championship at Interlachen",
        "3x per week",
        {
          "skill-level": 82,
          "preferred-format": "stroke-play",
          "walking-preference": "always-walk",
          "social-preference": "focused",
          "preferred-tee-time": ["early-morning"],
          "home-course": "Interlachen Country Club, Edina",
        },
      ),
    ],
  },
  {
    id: "u-priya",
    firstName: "Priya",
    neighborhood: "Bloomington",
    memberSince: "2025-09-28",
    eventsAttended: 19,
    communitiesCount: 2,
    connectionsCount: 33,
    streakWeeks: 11,
    matchGroups: ["mg-grinders"],
    activityProfiles: [
      golfProfile(
        "u-priya",
        "getting-serious",
        "Break 80 consistently by next spring",
        "2x per week",
        {
          "skill-level": 85,
          "preferred-format": "stroke-play",
          "walking-preference": "always-walk",
          "social-preference": "focused",
          "preferred-tee-time": ["early-morning", "mid-morning"],
          "home-course": "Hyland Greens Golf Club, Bloomington",
        },
      ),
    ],
  },
  {
    id: "u-joel",
    firstName: "Joel",
    neighborhood: "Woodbury",
    memberSince: "2025-07-14",
    eventsAttended: 31,
    communitiesCount: 5,
    connectionsCount: 48,
    streakWeeks: 18,
    matchGroups: ["mg-grinders"],
    activityProfiles: [
      golfProfile(
        "u-joel",
        "getting-serious",
        "Win my flight at the Woodbury City Amateur",
        "3x per week",
        {
          "skill-level": 79,
          "preferred-format": "match-play",
          "walking-preference": "always-walk",
          "social-preference": "mix",
          "preferred-tee-time": ["early-morning"],
          "home-course": "Prestwick Golf Club, Woodbury",
        },
      ),
    ],
  },

  // ── Competitive (Twilight League) ─────────────────────────────────────────
  {
    id: "u-brett",
    firstName: "Brett",
    neighborhood: "Eden Prairie",
    memberSince: "2025-06-01",
    eventsAttended: 37,
    communitiesCount: 4,
    connectionsCount: 62,
    streakWeeks: 22,
    matchGroups: ["mg-twilight"],
    activityProfiles: [
      golfProfile(
        "u-brett",
        "competitive",
        "Maintain a scratch handicap through the off-season",
        "4–5x per week",
        {
          "skill-level": 72,
          "preferred-format": "stroke-play",
          "walking-preference": "always-walk",
          "social-preference": "focused",
          "preferred-tee-time": ["twilight", "early-morning"],
          "home-course": "Bearpath Golf & Country Club, Eden Prairie",
        },
      ),
    ],
  },
  {
    id: "u-sam",
    firstName: "Sam",
    neighborhood: "Minnetonka",
    memberSince: "2025-06-15",
    eventsAttended: 29,
    communitiesCount: 3,
    connectionsCount: 54,
    streakWeeks: 19,
    matchGroups: ["mg-twilight"],
    activityProfiles: [
      golfProfile(
        "u-sam",
        "competitive",
        "Get back on the MGA Tour after a two-year break",
        "4x per week",
        {
          "skill-level": 68,
          "preferred-format": "stroke-play",
          "walking-preference": "always-walk",
          "social-preference": "focused",
          "preferred-tee-time": ["twilight"],
          "home-course": "Minnetonka Country Club",
        },
      ),
    ],
  },
  {
    id: "u-lena",
    firstName: "Lena",
    neighborhood: "Plymouth",
    memberSince: "2025-08-22",
    eventsAttended: 22,
    communitiesCount: 2,
    connectionsCount: 38,
    streakWeeks: 15,
    matchGroups: ["mg-twilight"],
    activityProfiles: [
      golfProfile(
        "u-lena",
        "competitive",
        "Play in the USGA Women's Mid-Am qualifier this fall",
        "4x per week",
        {
          "skill-level": 75,
          "preferred-format": "stroke-play",
          "walking-preference": "always-walk",
          "social-preference": "focused",
          "preferred-tee-time": ["twilight", "early-morning"],
          "home-course": "Wayzata Country Club",
        },
      ),
    ],
  },
  {
    id: "u-derek",
    firstName: "Derek",
    neighborhood: "Rosemount",
    memberSince: "2025-10-11",
    eventsAttended: 7,
    communitiesCount: 1,
    connectionsCount: 9,
    streakWeeks: 2,
    matchGroups: ["mg-twilight"],
    activityProfiles: [
      golfProfile(
        "u-derek",
        "competitive",
        "Post a sub-70 round at Stonebrooke this season",
        "3–4x per week",
        {
          "skill-level": 70,
          "preferred-format": "stroke-play",
          "walking-preference": "always-walk",
          "social-preference": "mix",
          "preferred-tee-time": ["twilight"],
          "home-course": "Stonebrooke Golf Club, Shakopee",
        },
      ),
    ],
  },

  // ── Weekend Warriors ──────────────────────────────────────────────────────
  {
    id: "u-chris",
    firstName: "Chris",
    neighborhood: "Inver Grove Heights",
    memberSince: "2026-03-01",
    eventsAttended: 3,
    communitiesCount: 1,
    connectionsCount: 5,
    streakWeeks: 1,
    matchGroups: [],
    activityProfiles: [
      golfProfile(
        "u-chris",
        "weekend-warrior",
        "Just enjoy Saturday mornings outside",
        "2x per month",
        {
          "skill-level": 108,
          "preferred-format": "scramble",
          "walking-preference": "prefer-cart",
          "social-preference": "social",
          "preferred-tee-time": ["mid-morning", "afternoon"],
          "home-course": "Rich Valley Golf Club, Rosemount",
        },
      ),
    ],
  },
];

// ─── THREADS ──────────────────────────────────────────────────────────────────

export const THREADS: ThreadStub[] = [
  // Saturday Morning Crew threads
  {
    id: "t-smc-1",
    matchGroupId: "mg-saturday-crew",
    title: "Course vote — Eastview vs. Valleywood this Saturday?",
    preview: "Eastview has better greens but Valleywood has 7am slots open. Thoughts?",
    authorId: "u-marcus",
    replyCount: 6,
    timestamp: "2h ago",
  },
  {
    id: "t-smc-2",
    matchGroupId: "mg-saturday-crew",
    title: "Good pre-round warmup routine?",
    preview: "Been showing up cold and it's killing my first three holes. What do you guys do?",
    authorId: "u-current",
    replyCount: 4,
    timestamp: "Yesterday",
  },
  {
    id: "t-smc-3",
    matchGroupId: "mg-saturday-crew",
    title: "Tracking shots this season — apps?",
    preview: "Thinking about trying Arccos or Shot Scope. Anyone have experience with either?",
    authorId: "u-devin",
    replyCount: 8,
    timestamp: "2d ago",
  },
  {
    id: "t-smc-4",
    matchGroupId: "mg-saturday-crew",
    title: "Rain policy — do we play through?",
    preview: "Forecast looks iffy for the 24th. Do we have a rain threshold or just play anyway?",
    authorId: "u-keisha",
    replyCount: 3,
    timestamp: "3d ago",
  },

  // South Metro Grinders threads
  {
    id: "t-smg-1",
    matchGroupId: "mg-grinders",
    title: "Lessons update — anyone try the new PGA coach at Hyland?",
    preview: "Heard there's a new instructor at Hyland who works specifically on mid-handicappers.",
    authorId: "u-priya",
    replyCount: 5,
    timestamp: "1h ago",
  },
  {
    id: "t-smg-2",
    matchGroupId: "mg-grinders",
    title: "Stats breakdown — what should we be tracking?",
    preview: "GIR, fairways, putts per round — I've been logging these. What else matters at our level?",
    authorId: "u-joel",
    replyCount: 7,
    timestamp: "Yesterday",
  },
  {
    id: "t-smg-3",
    matchGroupId: "mg-grinders",
    title: "Recruiting: who do we want as our 4th?",
    preview: "Group is at 3/4. Ryan has someone in mind from his league — posting details soon.",
    authorId: "u-ryan",
    replyCount: 2,
    timestamp: "2d ago",
  },

  // Twilight League threads
  {
    id: "t-tl-1",
    matchGroupId: "mg-twilight",
    title: "Tournament schedule 2026 — what's everyone targeting?",
    preview: "MGA Tour, City Amateurs, USGA qualifiers — let's pool our calendars.",
    authorId: "u-brett",
    replyCount: 9,
    timestamp: "3h ago",
  },
  {
    id: "t-tl-2",
    matchGroupId: "mg-twilight",
    title: "Swing analysis thread — post your range videos",
    preview: "Sharing a 7-iron sequence from last Thursday. Thoughts on the transition?",
    authorId: "u-sam",
    replyCount: 11,
    timestamp: "Yesterday",
  },
  {
    id: "t-tl-3",
    matchGroupId: "mg-twilight",
    title: "Best twilight rates in the metro right now?",
    preview: "Bearpath is $38 after 4pm on weekdays. Anyone found anything better?",
    authorId: "u-lena",
    replyCount: 6,
    timestamp: "2d ago",
  },
  {
    id: "t-tl-4",
    matchGroupId: "mg-twilight",
    title: "Pressure putting practice — drill recommendations",
    preview: "Been doing the clock drill but looking for something that simulates competition better.",
    authorId: "u-derek",
    replyCount: 4,
    timestamp: "3d ago",
  },
];

// ─── MATCH_GROUPS ─────────────────────────────────────────────────────────────

export const MATCH_GROUPS: MatchGroup[] = [
  {
    id: "mg-saturday-crew",
    activityId: "golf",
    name: "Saturday Morning Crew",
    memberIds: ["u-current", "u-marcus", "u-devin", "u-keisha"],
    matchScore: 91,
    status: "active",
    createdAt: "2026-03-08T09:00:00Z",
    coordinationSpace: {
      id: "cs-saturday-crew",
      matchGroupId: "mg-saturday-crew",
      threads: ["t-smc-1", "t-smc-2", "t-smc-3", "t-smc-4"],
      upcomingEvents: ["evt-smc-may24", "evt-smc-may31"],
      sharedGoals: [
        {
          id: "goal-smc-1",
          title: "All break 90 before July 4th",
          targetDate: "2026-07-04",
          memberProgress: [
            { userId: "u-current", current: 93, target: 89 },
            { userId: "u-marcus",  current: 88, target: 89 },
            { userId: "u-devin",   current: 97, target: 89 },
            { userId: "u-keisha",  current: 91, target: 89 },
          ],
        },
      ],
    },
  },
  {
    id: "mg-grinders",
    activityId: "golf",
    name: "South Metro Grinders",
    memberIds: ["u-ryan", "u-priya", "u-joel"],
    matchScore: 87,
    status: "forming",
    createdAt: "2026-04-15T07:30:00Z",
    coordinationSpace: {
      id: "cs-grinders",
      matchGroupId: "mg-grinders",
      threads: ["t-smg-1", "t-smg-2", "t-smg-3"],
      upcomingEvents: ["evt-smg-may25"],
      sharedGoals: [
        {
          id: "goal-smg-1",
          title: "Each post a personal-best round by Labor Day",
          targetDate: "2026-09-07",
          memberProgress: [
            { userId: "u-ryan",  current: 82, target: 78 },
            { userId: "u-priya", current: 85, target: 80 },
            { userId: "u-joel",  current: 79, target: 75 },
          ],
        },
      ],
    },
  },
  {
    id: "mg-twilight",
    activityId: "golf",
    name: "Twilight League",
    memberIds: ["u-brett", "u-sam", "u-lena", "u-derek"],
    matchScore: 94,
    status: "active",
    createdAt: "2026-02-20T16:00:00Z",
    coordinationSpace: {
      id: "cs-twilight",
      matchGroupId: "mg-twilight",
      threads: ["t-tl-1", "t-tl-2", "t-tl-3", "t-tl-4"],
      upcomingEvents: ["evt-tl-may26", "evt-tl-may28"],
      sharedGoals: [
        {
          id: "goal-tl-1",
          title: "At least two members make a 2026 tournament cut",
          targetDate: "2026-09-30",
          memberProgress: [
            { userId: "u-brett",  current: 0, target: 1 },
            { userId: "u-sam",    current: 0, target: 1 },
            { userId: "u-lena",   current: 0, target: 1 },
            { userId: "u-derek",  current: 0, target: 1 },
          ],
        },
      ],
    },
  },
];

// ─── COORDINATION_SPACES (convenience array) ──────────────────────────────────

export const COORDINATION_SPACES: CoordinationSpace[] = MATCH_GROUPS.map(
  (mg) => mg.coordinationSpace,
);

// ─── RECENT_SESSIONS ──────────────────────────────────────────────────────────

export const RECENT_SESSIONS: RecentSession[] = [
  // Saturday Morning Crew
  { id: "rs-smc-1", matchGroupId: "mg-saturday-crew", userId: "u-marcus",  courseName: "Crystal Lake GC",     score: 86, date: "2026-05-17" },
  { id: "rs-smc-2", matchGroupId: "mg-saturday-crew", userId: "u-keisha",  courseName: "Eastview Golf Course", score: 92, date: "2026-05-17" },
  { id: "rs-smc-3", matchGroupId: "mg-saturday-crew", userId: "u-current", courseName: "Valleywood Golf",     score: 95, date: "2026-05-10" },
  { id: "rs-smc-4", matchGroupId: "mg-saturday-crew", userId: "u-devin",   courseName: "Eastview Golf Course", score: 99, date: "2026-05-10" },

  // South Metro Grinders
  { id: "rs-smg-1", matchGroupId: "mg-grinders", userId: "u-ryan",  courseName: "Interlachen CC",    score: 81, date: "2026-05-18" },
  { id: "rs-smg-2", matchGroupId: "mg-grinders", userId: "u-joel",  courseName: "Prestwick GC",      score: 79, date: "2026-05-15" },
  { id: "rs-smg-3", matchGroupId: "mg-grinders", userId: "u-priya", courseName: "Hyland Greens GC",  score: 84, date: "2026-05-12" },

  // Twilight League
  { id: "rs-tl-1", matchGroupId: "mg-twilight", userId: "u-brett",  courseName: "Bearpath G&CC",       score: 71, date: "2026-05-20" },
  { id: "rs-tl-2", matchGroupId: "mg-twilight", userId: "u-sam",    courseName: "Minnetonka CC",        score: 69, date: "2026-05-19" },
  { id: "rs-tl-3", matchGroupId: "mg-twilight", userId: "u-lena",   courseName: "Wayzata CC",           score: 74, date: "2026-05-16" },
  { id: "rs-tl-4", matchGroupId: "mg-twilight", userId: "u-derek",  courseName: "Stonebrooke GC",       score: 72, date: "2026-05-14" },
];

// ─── SCHEDULED_SESSIONS ───────────────────────────────────────────────────────

export const SCHEDULED_SESSIONS: ScheduledSession[] = [
  // Saturday Morning Crew — upcoming
  {
    id: "evt-smc-may24",
    matchGroupId: "mg-saturday-crew",
    date: "Sat, May 24",
    time: "7:06 AM",
    courseName: "Eastview Golf Course",
    confirmedMemberIds: ["u-current", "u-marcus", "u-keisha"],
    status: "upcoming",
  },
  {
    id: "evt-smc-may31",
    matchGroupId: "mg-saturday-crew",
    date: "Sat, May 31",
    time: "7:30 AM",
    courseName: "Valleywood Golf Course",
    confirmedMemberIds: ["u-marcus"],
    status: "upcoming",
  },
  // Saturday Morning Crew — past
  {
    id: "evt-smc-may17",
    matchGroupId: "mg-saturday-crew",
    date: "Sat, May 17",
    time: "7:00 AM",
    courseName: "Crystal Lake GC",
    confirmedMemberIds: ["u-current", "u-marcus", "u-devin", "u-keisha"],
    status: "past",
    scores: { "u-current": 95, "u-marcus": 86, "u-devin": 99, "u-keisha": 92 },
  },
  {
    id: "evt-smc-may10",
    matchGroupId: "mg-saturday-crew",
    date: "Sat, May 10",
    time: "8:00 AM",
    courseName: "Valleywood Golf Course",
    confirmedMemberIds: ["u-current", "u-marcus", "u-keisha"],
    status: "past",
    scores: { "u-current": 97, "u-marcus": 89, "u-keisha": 94 },
  },

  // South Metro Grinders — upcoming
  {
    id: "evt-smg-may25",
    matchGroupId: "mg-grinders",
    date: "Sun, May 25",
    time: "8:00 AM",
    courseName: "Hyland Greens GC",
    confirmedMemberIds: ["u-ryan", "u-joel"],
    status: "upcoming",
  },
  // South Metro Grinders — past
  {
    id: "evt-smg-may18",
    matchGroupId: "mg-grinders",
    date: "Sun, May 18",
    time: "7:30 AM",
    courseName: "Interlachen CC",
    confirmedMemberIds: ["u-ryan", "u-priya", "u-joel"],
    status: "past",
    scores: { "u-ryan": 81, "u-priya": 84, "u-joel": 79 },
  },

  // Twilight League — upcoming
  {
    id: "evt-tl-may26",
    matchGroupId: "mg-twilight",
    date: "Mon, May 26",
    time: "5:00 PM",
    courseName: "Bearpath G&CC",
    confirmedMemberIds: ["u-brett", "u-sam", "u-lena", "u-derek"],
    status: "upcoming",
  },
  {
    id: "evt-tl-may28",
    matchGroupId: "mg-twilight",
    date: "Wed, May 28",
    time: "5:30 PM",
    courseName: "Minnetonka CC",
    confirmedMemberIds: ["u-brett", "u-lena"],
    status: "upcoming",
  },
  // Twilight League — past
  {
    id: "evt-tl-may20",
    matchGroupId: "mg-twilight",
    date: "Tue, May 20",
    time: "5:00 PM",
    courseName: "Bearpath G&CC",
    confirmedMemberIds: ["u-brett", "u-sam", "u-lena", "u-derek"],
    status: "past",
    scores: { "u-brett": 71, "u-sam": 69, "u-lena": 74, "u-derek": 72 },
  },
];

// ─── MATCH_GROUP_MESSAGES (Saturday Morning Crew) ─────────────────────────────

const CHAT_ID = "mg-saturday-crew";

export const MATCH_GROUP_MESSAGES: ChatMessage[] = [
  {
    id: "msg-smc-1",
    chatId: CHAT_ID,
    senderId: "u-marcus",
    text: "Hey guys — Eastview or Valleywood this Saturday? I can book either right now.",
    timestamp: "2026-05-22T19:04:00Z",
  },
  {
    id: "msg-smc-2",
    chatId: CHAT_ID,
    senderId: "u-devin",
    text: "Eastview. Their greens are actually rolling well right now. Played there Wednesday.",
    timestamp: "2026-05-22T19:11:00Z",
  },
  {
    id: "msg-smc-3",
    chatId: CHAT_ID,
    senderId: "u-current",
    text: "Eastview works for me. What time are you thinking? I can do 7 or 8.",
    timestamp: "2026-05-22T19:15:00Z",
  },
  {
    id: "msg-smc-4",
    chatId: CHAT_ID,
    senderId: "u-keisha",
    text: "7am is ideal — beat the heat. I'll bring snacks if someone else gets the cart.",
    timestamp: "2026-05-22T19:23:00Z",
  },
  {
    id: "msg-smc-5",
    chatId: CHAT_ID,
    senderId: "u-marcus",
    text: "Booked! 7:06am Saturday at Eastview. 4 players, one cart. Should I put it on my card and we all Venmo?",
    timestamp: "2026-05-22T19:31:00Z",
  },
  {
    id: "msg-smc-6",
    chatId: CHAT_ID,
    senderId: "u-current",
    text: "Works for me. $38 each right? I'll shoot you $40 for the snacks too Keisha.",
    timestamp: "2026-05-22T19:37:00Z",
  },
  {
    id: "msg-smc-7",
    chatId: CHAT_ID,
    senderId: "u-devin",
    text: "Forecast says chance of showers after 10. We should be done by then if we keep pace.",
    timestamp: "2026-05-22T20:02:00Z",
  },
  {
    id: "msg-smc-8",
    chatId: CHAT_ID,
    senderId: "u-keisha",
    text: "We'll be fine. Plus a little rain never hurt my score — can't get worse 😄",
    timestamp: "2026-05-22T20:08:00Z",
  },
  {
    id: "msg-smc-9",
    chatId: CHAT_ID,
    senderId: "u-marcus",
    text: "Reminder that loser buys breakfast at Perkins after. Last week that was me and I'm not doing it again.",
    timestamp: "2026-05-22T20:14:00Z",
  },
  {
    id: "msg-smc-10",
    chatId: CHAT_ID,
    senderId: "u-current",
    text: "See you guys at the range at 6:45. Going to actually warm up this time.",
    timestamp: "2026-05-22T20:21:00Z",
  },
];
