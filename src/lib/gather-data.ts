// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface User {
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
  attendees: User[];
  totalAttendees: number;
  isSoon: boolean;
  isAttending: boolean;
  description: string;
  host: User;
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

export interface Chat {
  id: string;
  type: "event" | "dm";
  name: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  /** ISO datetime of the associated event ending — used to detect archived state (>48h) */
  eventEndedAt?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Thread {
  id: string;
  communityId: string;
  title: string;
  preview: string;
  fullText?: string;
  author: User;
  replyCount: number;
  upvotes: number;
  createdAt: string;
  lastActivity: string;
}

export interface Reply {
  id: string;
  threadId: string;
  author: User;
  text: string;
  upvotes: number;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  communityId: string;
  author: User;
  text: string;
  location?: string;
  category: "places" | "tips" | "food-drink" | "gear";
  upvotes: number;
  createdAt: string;
}

// ─── Helper: accent color → Tailwind bg class ─────────────────────────────────

export const ACCENT_COLOR_CLASS: Record<Community["accentColor"], string> = {
  amber: "bg-gathr-amber",
  sage: "bg-gathr-sage",
  coral: "bg-gathr-coral",
  terracotta: "bg-gathr-terracotta",
  "dusty-blue": "bg-gathr-dusty-blue",
};

// ─── Helper: get two-letter initials from a User ─────────────────────────────

export function getUserInitials(user: User): string {
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

// ─── Users (15+) ─────────────────────────────────────────────────────────────

export const CURRENT_USER: User = {
  id: "u-alex",
  firstName: "Alex",
  neighborhood: "Eagan",
  memberSince: "Aug 2024",
  eventsAttended: 12,
  communitiesCount: 5,
  connectionsCount: 8,
  streakWeeks: 4,
};

export const USERS: User[] = [
  CURRENT_USER,
  {
    id: "u-sam",
    firstName: "Sam",
    neighborhood: "Minneapolis",
    memberSince: "Jan 2024",
    eventsAttended: 23,
    communitiesCount: 4,
    connectionsCount: 17,
    streakWeeks: 8,
  },
  {
    id: "u-jordan",
    firstName: "Jordan",
    neighborhood: "St. Paul",
    memberSince: "Mar 2024",
    eventsAttended: 18,
    communitiesCount: 3,
    connectionsCount: 11,
    streakWeeks: 6,
  },
  {
    id: "u-ryan",
    firstName: "Ryan",
    neighborhood: "Eagan",
    memberSince: "Sep 2023",
    eventsAttended: 31,
    communitiesCount: 6,
    connectionsCount: 24,
    streakWeeks: 12,
  },
  {
    id: "u-kelly",
    firstName: "Kelly",
    neighborhood: "Bloomington",
    memberSince: "Feb 2024",
    eventsAttended: 9,
    communitiesCount: 2,
    connectionsCount: 6,
    streakWeeks: 3,
  },
  {
    id: "u-ben-n",
    firstName: "Ben",
    neighborhood: "Edina",
    memberSince: "Nov 2023",
    eventsAttended: 15,
    communitiesCount: 4,
    connectionsCount: 13,
    streakWeeks: 5,
  },
  {
    id: "u-emily",
    firstName: "Emily",
    neighborhood: "Minneapolis",
    memberSince: "Apr 2024",
    eventsAttended: 7,
    communitiesCount: 3,
    connectionsCount: 5,
    streakWeeks: 2,
  },
  {
    id: "u-eric",
    firstName: "Eric",
    neighborhood: "Lakeville",
    memberSince: "Jun 2023",
    eventsAttended: 41,
    communitiesCount: 5,
    connectionsCount: 29,
    streakWeeks: 16,
  },
  {
    id: "u-nora",
    firstName: "Nora",
    neighborhood: "St. Paul",
    memberSince: "Jan 2025",
    eventsAttended: 4,
    communitiesCount: 2,
    connectionsCount: 3,
    streakWeeks: 1,
  },
  {
    id: "u-tyler",
    firstName: "Tyler",
    neighborhood: "Maple Grove",
    memberSince: "Oct 2023",
    eventsAttended: 22,
    communitiesCount: 4,
    connectionsCount: 18,
    streakWeeks: 9,
  },
  {
    id: "u-maya",
    firstName: "Maya",
    neighborhood: "St. Paul",
    memberSince: "Mar 2024",
    eventsAttended: 11,
    communitiesCount: 3,
    connectionsCount: 8,
    streakWeeks: 4,
  },
  {
    id: "u-derek",
    firstName: "Derek",
    neighborhood: "Minneapolis",
    memberSince: "Jul 2023",
    eventsAttended: 35,
    communitiesCount: 7,
    connectionsCount: 31,
    streakWeeks: 14,
  },
  {
    id: "u-anna",
    firstName: "Anna",
    neighborhood: "Plymouth",
    memberSince: "Dec 2023",
    eventsAttended: 16,
    communitiesCount: 3,
    connectionsCount: 12,
    streakWeeks: 6,
  },
  {
    id: "u-ben-l",
    firstName: "Ben",
    neighborhood: "Minneapolis",
    memberSince: "May 2023",
    eventsAttended: 44,
    communitiesCount: 5,
    connectionsCount: 38,
    streakWeeks: 18,
  },
  {
    id: "u-grace",
    firstName: "Grace",
    neighborhood: "Minneapolis",
    memberSince: "Aug 2023",
    eventsAttended: 28,
    communitiesCount: 4,
    connectionsCount: 21,
    streakWeeks: 11,
  },
  {
    id: "u-vic",
    firstName: "Vic",
    neighborhood: "St. Paul",
    memberSince: "Feb 2024",
    eventsAttended: 13,
    communitiesCount: 3,
    connectionsCount: 9,
    streakWeeks: 5,
  },
  {
    id: "u-james",
    firstName: "James",
    neighborhood: "Burnsville",
    memberSince: "Sep 2024",
    eventsAttended: 6,
    communitiesCount: 2,
    connectionsCount: 4,
    streakWeeks: 2,
  },
];

// Convenience lookup
export const USER_BY_ID = Object.fromEntries(USERS.map((u) => [u.id, u]));

// ─── Communities (8) ─────────────────────────────────────────────────────────

export const COMMUNITIES: Community[] = [
  {
    id: "vikings",
    name: "Vikings Fans — Twin Cities",
    description: "Sundays, Skol chants, and stadium energy.",
    memberCount: 1284,
    accentColor: "coral",
    activityPulse: "Game day tailgate this Sunday",
    isJoined: true,
    category: "Sports",
    weeklyGrowth: 31,
  },
  {
    id: "family",
    name: "Family Adventures — Eagan",
    description: "Parents who'd rather not spend Saturday at home.",
    memberCount: 388,
    accentColor: "sage",
    activityPulse: "12 people heading to Como Zoo Saturday",
    isJoined: true,
    category: "Family",
    weeklyGrowth: 14,
  },
  {
    id: "outdoor",
    name: "Outdoor & Trails — Twin Cities",
    description: "Trails, climbs, lakes, and long Saturday mornings.",
    memberCount: 521,
    accentColor: "dusty-blue",
    activityPulse: "New conversation: Best fall hikes?",
    isJoined: true,
    category: "Outdoors",
    weeklyGrowth: 24,
  },
  {
    id: "food",
    name: "Food & Drink — Twin Cities",
    description: "New spots, neighborhood gems, and patio season.",
    memberCount: 734,
    accentColor: "terracotta",
    activityPulse: "3 events this weekend",
    isJoined: true,
    category: "Food & drink",
    weeklyGrowth: 19,
  },
  {
    id: "twins",
    name: "Twins Fans — Twin Cities",
    description: "Target Field regulars and dollar dog die-hards.",
    memberCount: 942,
    accentColor: "coral",
    activityPulse: "New conversation: Best seats for dollar dog night",
    isJoined: false,
    suggestionLine: "Popular with Vikings Fans members",
    category: "Sports",
    weeklyGrowth: 18,
  },
  {
    id: "wild",
    name: "Wild Hockey — Twin Cities",
    description: "Puck drops, watch parties, and rec league chat.",
    memberCount: 612,
    accentColor: "sage",
    activityPulse: "Watch party tonight — 34 going",
    isJoined: false,
    suggestionLine: "8 people in Eagan just joined",
    category: "Sports",
    weeklyGrowth: 22,
  },
  {
    id: "pickup",
    name: "Weekend Pickup Sports — Twin Cities",
    description: "Soccer, basketball, frisbee — whoever shows up.",
    memberCount: 264,
    accentColor: "amber",
    activityPulse: "Soccer pickup Saturday at 6pm",
    isJoined: false,
    suggestionLine: "Popular with Outdoor & Trails members",
    category: "Sports",
    weeklyGrowth: 9,
  },
  {
    id: "breweries",
    name: "Breweries & Taprooms — Twin Cities",
    description: "Local craft, rotating taps, and good people.",
    memberCount: 441,
    accentColor: "terracotta",
    activityPulse: "New: Surly patio season is here",
    isJoined: false,
    suggestionLine: "Popular with Food & Drink members",
    category: "Food & drink",
    weeklyGrowth: 11,
  },
  {
    id: "run-club",
    name: "Twin Cities Run Club",
    description: "Morning miles, post-run coffee, and race day crew.",
    memberCount: 318,
    accentColor: "sage",
    activityPulse: "Sunday long run — 6am Minnehaha",
    isJoined: false,
    suggestionLine: "Popular with Outdoor & Trails members",
    category: "Fitness",
    weeklyGrowth: 16,
  },
  {
    id: "yoga-parks",
    name: "Yoga in the Parks — Twin Cities",
    description: "Free outdoor classes all summer long.",
    memberCount: 197,
    accentColor: "dusty-blue",
    activityPulse: "Saturday Loring Park class — 27 going",
    isJoined: false,
    suggestionLine: "Growing fast in Eagan",
    category: "Fitness",
    weeklyGrowth: 21,
  },
  {
    id: "arts-music",
    name: "Arts & Music — Twin Cities",
    description: "Gallery openings, live music, and creative meetups.",
    memberCount: 276,
    accentColor: "amber",
    activityPulse: "Open mic at Amsterdam tonight",
    isJoined: false,
    suggestionLine: "New community — 40 joined this week",
    category: "Arts & culture",
    weeklyGrowth: 40,
  },
  {
    id: "theater",
    name: "Twin Cities Theater Lovers",
    description: "Guthrie regulars, Fringe devotees, and improv fans.",
    memberCount: 154,
    accentColor: "terracotta",
    activityPulse: "Fringe Festival tickets — group discount",
    isJoined: false,
    suggestionLine: "Popular with Arts & Music members",
    category: "Arts & culture",
    weeklyGrowth: 8,
  },
];

// ─── Events (21) ─────────────────────────────────────────────────────────────

// Dates are relative to the week of May 22–28, 2026

function u(...ids: string[]): User[] {
  return ids.map((id) => USER_BY_ID[id]).filter(Boolean);
}

export const EVENTS: GathrEvent[] = [
  {
    id: "vikes",
    name: "Vikings vs Packers tailgate",
    communityId: "vikings",
    communityName: "Vikings Fans",
    location: "US Bank Stadium · Lot C",
    address: "401 Chicago Ave, Minneapolis, MN 55415",
    lat: 44.9735,
    lng: -93.2575,
    dateTime: "2026-05-24T13:00:00",
    attendees: u("u-sam", "u-anna", "u-ryan", "u-kelly", "u-ben-n", "u-emily"),
    totalAttendees: 47,
    isSoon: true,
    isAttending: false,
    description:
      "Pulling up early to Lot C around 10. Blue tent, brats on the grill, bring a chair. Heading in together around 12:30.",
    host: USER_BY_ID["u-sam"],
  },
  {
    id: "trail",
    name: "Saturday trail run",
    communityId: "outdoor",
    communityName: "Outdoor & Trails",
    location: "Lebanon Hills · Eagan",
    address: "860 Cliff Rd, Eagan, MN 55123",
    lat: 44.8062,
    lng: -93.2084,
    dateTime: "2026-05-23T08:00:00",
    attendees: u("u-eric", "u-nora", "u-tyler", "u-maya"),
    totalAttendees: 12,
    isSoon: true,
    isAttending: false,
    description:
      "Easy 6 miles, coffee after at the trailhead. All paces welcome.",
    host: USER_BY_ID["u-eric"],
  },
  {
    id: "park",
    name: "Kids + coffee at the park",
    communityId: "family",
    communityName: "Family Adventures",
    location: "Como Regional Park",
    address: "1199 Midway Pkwy, St Paul, MN 55103",
    lat: 44.9813,
    lng: -93.1517,
    dateTime: "2026-05-23T10:00:00",
    attendees: u("u-maya", "u-derek", "u-anna"),
    totalAttendees: 8,
    isSoon: true,
    isAttending: false,
    description: "Meet at the big playground. Bringing donuts and a thermos.",
    host: USER_BY_ID["u-maya"],
  },
  {
    id: "trivia",
    name: "Trivia night @ Surly",
    communityId: "food",
    communityName: "Food & Drink",
    location: "Surly Brewing · Mpls",
    address: "520 Malcolm Ave SE, Minneapolis, MN 55414",
    lat: 44.9732,
    lng: -93.2212,
    dateTime: "2026-05-28T19:00:00",
    attendees: u("u-ben-l", "u-vic", "u-james", "u-grace"),
    totalAttendees: 19,
    isSoon: false,
    isAttending: false,
    description:
      "Teams of 4–6. Grabbing the big booth in back. We're 'The Hot Dish'.",
    host: USER_BY_ID["u-ben-l"],
  },
  {
    id: "farm",
    name: "Mill City Farmers Market",
    communityId: "food",
    communityName: "Food & Drink",
    location: "Mill City Museum · Mpls",
    address: "704 S 2nd St, Minneapolis, MN 55401",
    lat: 44.9795,
    lng: -93.2582,
    dateTime: "2026-05-23T09:00:00",
    attendees: u("u-grace", "u-tyler"),
    totalAttendees: 6,
    isSoon: false,
    isAttending: false,
    description: "Slow walk through the market, then coffee at Spyhouse.",
    host: USER_BY_ID["u-grace"],
  },
  {
    id: "twins-game",
    name: "Twins vs Cubs watch party",
    communityId: "twins",
    communityName: "Twins Fans",
    location: "Kieran's Irish Pub · Mpls",
    address: "330 2nd Ave S, Minneapolis, MN 55401",
    lat: 44.9782,
    lng: -93.2607,
    dateTime: "2026-05-27T18:30:00",
    attendees: u("u-jordan", "u-ryan", "u-emily", "u-anna"),
    totalAttendees: 22,
    isSoon: false,
    isAttending: false,
    description:
      "Catching the Twins at 7:10. Meet at 6:30 for pre-game drinks. I'll grab the big booth.",
    host: USER_BY_ID["u-jordan"],
  },
  {
    id: "wild-watch",
    name: "Wild playoff watch party",
    communityId: "wild",
    communityName: "Wild Hockey",
    location: "McCoy's Public House · St. Paul",
    address: "1819 Suburban Ave, St Paul, MN 55106",
    lat: 44.9449,
    lng: -93.0551,
    dateTime: "2026-05-23T18:30:00",
    attendees: u("u-derek", "u-kelly", "u-james", "u-ben-n", "u-vic"),
    totalAttendees: 34,
    isSoon: true,
    isAttending: false,
    description:
      "Game 5. Come ready. They've got $5 Wild pints and a projector setup.",
    host: USER_BY_ID["u-derek"],
  },
  {
    id: "soccer",
    name: "Friday pickup soccer",
    communityId: "pickup",
    communityName: "Weekend Pickup Sports",
    location: "Rosemount Community Center fields",
    address: "13885 S Robert Trail, Rosemount, MN 55068",
    lat: 44.7466,
    lng: -93.1208,
    dateTime: "2026-05-23T18:00:00",
    attendees: u("u-tyler", "u-eric", "u-ryan", "u-james"),
    totalAttendees: 14,
    isSoon: true,
    isAttending: false,
    description:
      "Open field, show up to play. Pinnies provided. Cleats recommended but not required.",
    host: USER_BY_ID["u-tyler"],
  },
  {
    id: "minnehaha",
    name: "Minnehaha Falls morning hike",
    communityId: "outdoor",
    communityName: "Outdoor & Trails",
    location: "Minnehaha Regional Park",
    address: "4801 S Minnehaha Dr, Minneapolis, MN 55417",
    lat: 44.9152,
    lng: -93.2108,
    dateTime: "2026-05-24T09:00:00",
    attendees: u("u-anna", "u-nora", "u-grace"),
    totalAttendees: 9,
    isSoon: false,
    isAttending: false,
    description:
      "Meeting at the upper falls trailhead. 3-mile loop, then the Hot Plate for breakfast burritos.",
    host: USER_BY_ID["u-anna"],
  },
  {
    id: "como-zoo",
    name: "Como Zoo morning",
    communityId: "family",
    communityName: "Family Adventures",
    location: "Como Park Zoo & Conservatory",
    address: "1225 Estabrook Dr, St Paul, MN 55103",
    lat: 44.9836,
    lng: -93.1519,
    dateTime: "2026-05-24T09:30:00",
    attendees: u("u-kelly", "u-emily", "u-anna", "u-james"),
    totalAttendees: 13,
    isSoon: false,
    isAttending: false,
    description:
      "Free admission. Meet at the main entrance. Kids go crazy for the giraffes.",
    host: USER_BY_ID["u-kelly"],
  },
  {
    id: "brewery-tour",
    name: "Northeast brewery crawl",
    communityId: "breweries",
    communityName: "Breweries & Taprooms",
    location: "Indeed Brewing → Dangerous Man → Bauhaus",
    address: "711 15th Ave NE, Minneapolis, MN 55413",
    lat: 44.9933,
    lng: -93.2476,
    dateTime: "2026-05-23T14:00:00",
    attendees: u("u-ben-l", "u-grace", "u-derek", "u-vic"),
    totalAttendees: 11,
    isSoon: false,
    isAttending: false,
    description:
      "Starting at Indeed. Ending wherever our legs take us. Budget around $40 for flights.",
    host: USER_BY_ID["u-ben-l"],
  },
  {
    id: "bbq",
    name: "Backyard BBQ in Eagan",
    communityId: "family",
    communityName: "Family Adventures",
    location: "Private backyard · Eagan",
    address: "Eagan, MN 55122",
    lat: 44.804,
    lng: -93.167,
    dateTime: "2026-05-24T16:00:00",
    attendees: u("u-alex", "u-sam", "u-ryan", "u-kelly", "u-james", "u-emily"),
    totalAttendees: 18,
    isSoon: false,
    isAttending: true,
    description:
      "Kids welcome. Bring a dish to share. Pool will be open. Dogs too.",
    host: USER_BY_ID["u-alex"],
  },
  {
    id: "greenway-ride",
    name: "Monday Greenway bike ride",
    communityId: "outdoor",
    communityName: "Outdoor & Trails",
    location: "Midtown Greenway · Mpls",
    address: "3100 Midtown Greenway, Minneapolis, MN 55408",
    lat: 44.9493,
    lng: -93.2889,
    dateTime: "2026-05-26T06:00:00",
    attendees: u("u-eric", "u-tyler", "u-derek"),
    totalAttendees: 7,
    isSoon: false,
    isAttending: false,
    description:
      "Easy 15-mile loop on the Greenway to Lake Harriet and back. Coffee stop at Angry Catfish.",
    host: USER_BY_ID["u-eric"],
  },
  {
    id: "twins-field",
    name: "Twins game — Target Field",
    communityId: "twins",
    communityName: "Twins Fans",
    location: "Target Field · Mpls",
    address: "1 Twins Way, Minneapolis, MN 55403",
    lat: 44.9817,
    lng: -93.2778,
    dateTime: "2026-05-23T19:10:00",
    attendees: u("u-jordan", "u-grace", "u-sam"),
    totalAttendees: 8,
    isSoon: true,
    isAttending: false,
    description:
      "Dollar dog night. Section 112, row 4. Message me for the ticket group link.",
    host: USER_BY_ID["u-jordan"],
  },
  {
    id: "edina-market",
    name: "Edina Farmers Market",
    communityId: "food",
    communityName: "Food & Drink",
    location: "Centennial Lakes Park · Edina",
    address: "7499 France Ave S, Edina, MN 55435",
    lat: 44.8736,
    lng: -93.3404,
    dateTime: "2026-05-24T08:00:00",
    attendees: u("u-anna", "u-ben-n", "u-emily"),
    totalAttendees: 5,
    isSoon: false,
    isAttending: false,
    description:
      "The Edina market has the best tamale vendor. Come hungry. Parking is easy at 7am.",
    host: USER_BY_ID["u-anna"],
  },
  {
    id: "como-kayak",
    name: "Como Lake kayak morning",
    communityId: "outdoor",
    communityName: "Outdoor & Trails",
    location: "Como Lake Boathouse",
    address: "1360 Lexington Pkwy N, St Paul, MN 55103",
    lat: 44.9827,
    lng: -93.1531,
    dateTime: "2026-05-24T10:00:00",
    attendees: u("u-nora", "u-maya", "u-vic"),
    totalAttendees: 6,
    isSoon: false,
    isAttending: false,
    description:
      "Rentals are $15/hr. No experience needed. Lake is calm in the morning.",
    host: USER_BY_ID["u-nora"],
  },
  {
    id: "photo-walk",
    name: "Minneapolis Photo Walk",
    communityId: "outdoor",
    communityName: "Outdoor & Trails",
    location: "Stone Arch Bridge · Mpls",
    address: "100 Portland Ave, Minneapolis, MN 55401",
    lat: 44.9809,
    lng: -93.2556,
    dateTime: "2026-05-25T10:00:00",
    attendees: u("u-derek", "u-grace", "u-emily", "u-vic"),
    totalAttendees: 9,
    isSoon: false,
    isAttending: false,
    description:
      "Bring any camera — phone cameras totally welcome. 2-mile loop through the Mill District.",
    host: USER_BY_ID["u-derek"],
  },
  {
    id: "board-brew",
    name: "Pizza & games @ Board & Brew",
    communityId: "food",
    communityName: "Food & Drink",
    location: "Board & Brew · Rosemount",
    address: "3445 150th St W, Rosemount, MN 55068",
    lat: 44.7497,
    lng: -93.1267,
    dateTime: "2026-05-23T19:00:00",
    attendees: u("u-james", "u-kelly", "u-ben-n"),
    totalAttendees: 10,
    isSoon: false,
    isAttending: false,
    description:
      "Bring $20–30 for a game rental + food. Good rotating tap list. Reservations needed.",
    host: USER_BY_ID["u-james"],
  },
  {
    id: "parkway-run",
    name: "River Road running club",
    communityId: "outdoor",
    communityName: "Outdoor & Trails",
    location: "West River Pkwy · Mpls",
    address: "West River Pkwy & Franklin Ave, Minneapolis, MN 55405",
    lat: 44.9617,
    lng: -93.2583,
    dateTime: "2026-05-26T18:00:00",
    attendees: u("u-eric", "u-nora", "u-anna", "u-tyler"),
    totalAttendees: 15,
    isSoon: false,
    isAttending: false,
    description:
      "6 miles along the river. 3 pace groups: 8, 9, and 10+ min miles. Post-run beers at Bauhaus.",
    host: USER_BY_ID["u-eric"],
  },
  {
    id: "skol-bar",
    name: "Vikings draft watch at Grumpy's",
    communityId: "vikings",
    communityName: "Vikings Fans",
    location: "Grumpy's Bar · NE Mpls",
    address: "2200 4th St NE, Minneapolis, MN 55418",
    lat: 44.9988,
    lng: -93.2428,
    dateTime: "2026-05-22T19:00:00",
    attendees: u("u-sam", "u-ryan", "u-ben-n", "u-derek", "u-jordan"),
    totalAttendees: 31,
    isSoon: true,
    isAttending: false,
    description:
      "First round picks, $4 rail drinks. Skol bucket for anyone they draft a WR.",
    host: USER_BY_ID["u-sam"],
  },
  {
    id: "berry-pick",
    name: "Afton Apple berry picking",
    communityId: "family",
    communityName: "Family Adventures",
    location: "Afton Apple Orchard",
    address: "14421 S 90th St, Hastings, MN 55033",
    lat: 44.8108,
    lng: -92.8553,
    dateTime: "2026-05-25T10:30:00",
    attendees: u("u-maya", "u-kelly", "u-emily", "u-james"),
    totalAttendees: 14,
    isSoon: false,
    isAttending: false,
    description:
      "Strawberries are peak right now. Bring containers. The bakery there is worth the trip alone.",
    host: USER_BY_ID["u-maya"],
  },
];

// ─── Threads (20+) ────────────────────────────────────────────────────────────

export const THREADS: Thread[] = [
  {
    id: "t-vike-1",
    communityId: "vikings",
    title: "Best parking spot for Sunday's game?",
    preview:
      "Lot C is fine but if you get there after 11 you're walking 20 minutes. Hidden gem: the ramp on 4th Ave.",
    fullText:
      "Lot C is fine but if you get there after 11 you're walking 20 minutes. The hidden gem is the ramp on 4th Ave — it's $15 flat and you're out before the crush. I've been doing this for 3 seasons and I've never waited more than 10 minutes to leave. Bonus: there's a good bar right there called The Newsroom if you want to grab one more before the walk.",
    author: USER_BY_ID["u-sam"],
    replyCount: 14,
    upvotes: 31,
    createdAt: "2026-05-22T08:00:00",
    lastActivity: "2026-05-22T14:30:00",
  },
  {
    id: "t-vike-2",
    communityId: "vikings",
    title: "Anyone wanna split a brisket order from Animales?",
    preview:
      "Thinking of ordering a full brisket for tailgate. Looking for 4 people to split. $25/person.",
    author: USER_BY_ID["u-ben-l"],
    replyCount: 7,
    upvotes: 12,
    createdAt: "2026-05-21T20:00:00",
    lastActivity: "2026-05-22T10:15:00",
  },
  {
    id: "t-vike-3",
    communityId: "vikings",
    title: "Skol chant practice for the new folks",
    preview:
      "Seriously, it's not that hard but you have to commit. Here's the rhythm: SKOL — [clap] — MINNESOTA.",
    author: USER_BY_ID["u-jordan"],
    replyCount: 23,
    upvotes: 44,
    createdAt: "2026-05-20T15:00:00",
    lastActivity: "2026-05-22T09:00:00",
  },
  {
    id: "t-vike-4",
    communityId: "vikings",
    title: "Draft grades — what does everyone think?",
    preview:
      "I'll go first: A- overall. The WR pick in round 2 surprised me but the upside is real.",
    author: USER_BY_ID["u-derek"],
    replyCount: 38,
    upvotes: 56,
    createdAt: "2026-05-22T22:00:00",
    lastActivity: "2026-05-22T23:45:00",
  },
  {
    id: "t-twins-1",
    communityId: "twins",
    title: "Best seats for dollar dog night?",
    preview:
      "Section 232 has shade after the 4th inning. Avoid the bleachers if it's sunny — brutal.",
    author: USER_BY_ID["u-jordan"],
    replyCount: 11,
    upvotes: 19,
    createdAt: "2026-05-21T12:00:00",
    lastActivity: "2026-05-22T11:30:00",
  },
  {
    id: "t-twins-2",
    communityId: "twins",
    title: "Does anyone have the Target Field app coupon?",
    preview:
      "They sent a 20% off merch email last week. Can anyone share? My inbox ate it.",
    author: USER_BY_ID["u-grace"],
    replyCount: 4,
    upvotes: 8,
    createdAt: "2026-05-21T09:00:00",
    lastActivity: "2026-05-21T16:00:00",
  },
  {
    id: "t-twins-3",
    communityId: "twins",
    title: "Buxton is back — let's gooo",
    preview:
      "Man came back and immediately went yard. Twins season is officially alive again.",
    author: USER_BY_ID["u-ryan"],
    replyCount: 22,
    upvotes: 67,
    createdAt: "2026-05-22T21:00:00",
    lastActivity: "2026-05-22T23:30:00",
  },
  {
    id: "t-wild-1",
    communityId: "wild",
    title: "Anyone streaming the away game tonight?",
    preview:
      "ESPN+ has it but the stream kept dying last week. Anyone got a backup link or bar suggestion?",
    author: USER_BY_ID["u-derek"],
    replyCount: 9,
    upvotes: 14,
    createdAt: "2026-05-22T16:00:00",
    lastActivity: "2026-05-22T18:30:00",
  },
  {
    id: "t-wild-2",
    communityId: "wild",
    title: "Kaprizov playing through a hurt knee — thoughts?",
    preview:
      "You can tell he's not right. I'd rather have him healthy for game 6 than risk it.",
    author: USER_BY_ID["u-kelly"],
    replyCount: 31,
    upvotes: 48,
    createdAt: "2026-05-22T10:00:00",
    lastActivity: "2026-05-22T20:00:00",
  },
  {
    id: "t-family-1",
    communityId: "family",
    title: "Swim lesson recommendations in Eagan?",
    preview:
      "Looking for something that takes 3-year-olds. The YMCA has a waitlist. Any private instructors?",
    fullText:
      "Looking for swim lessons for my 3-year-old. The YMCA South of the River has a 6-week waitlist right now which isn't going to work for this summer. Has anyone used a private instructor in the Eagan or Apple Valley area? She's a bit nervous around water so small class size matters — we don't want to traumatize her, just get her comfortable. Budget is around $25-30/session. Any recs would be amazing.",
    author: USER_BY_ID["u-maya"],
    replyCount: 6,
    upvotes: 11,
    createdAt: "2026-05-21T14:00:00",
    lastActivity: "2026-05-22T08:00:00",
  },
  {
    id: "t-family-2",
    communityId: "family",
    title: "Best splash pad in the south metro?",
    preview:
      "We hit the Apple Valley one last weekend — kids were obsessed. Anyone been to the Burnsville one?",
    author: USER_BY_ID["u-kelly"],
    replyCount: 18,
    upvotes: 29,
    createdAt: "2026-05-20T11:00:00",
    lastActivity: "2026-05-22T13:00:00",
  },
  {
    id: "t-outdoor-1",
    communityId: "outdoor",
    title: "Lebanon Hills trail conditions?",
    preview:
      "Went out Tuesday — some mud on the lower loop but the main single track is solid.",
    fullText:
      "Went out Tuesday morning for about 2 hours. The lower loop near the lake has some mud patches — nothing terrible, maybe 3 spots where you'll want to go around. The main single track on the east side is completely dry and in great shape. The creek crossing at mile 2 has some standing water but you can hop it if you have good shoes. Overall I'd call it a 7/10 day. Should be fully clear by the weekend if we don't get more rain.",
    author: USER_BY_ID["u-eric"],
    replyCount: 5,
    upvotes: 16,
    createdAt: "2026-05-21T07:00:00",
    lastActivity: "2026-05-22T07:30:00",
  },
  {
    id: "t-outdoor-2",
    communityId: "outdoor",
    title: "Anyone doing the Afton Trail Run this year?",
    preview:
      "Registered for the 50K. Training has been rough but I'm committed. Anyone else in?",
    author: USER_BY_ID["u-anna"],
    replyCount: 12,
    upvotes: 22,
    createdAt: "2026-05-19T18:00:00",
    lastActivity: "2026-05-22T12:00:00",
  },
  {
    id: "t-outdoor-3",
    communityId: "outdoor",
    title: "Best cycling route for a 40-mile weekend ride?",
    preview:
      "Gateway Trail to Stillwater is beautiful but starts crowded. Consider starting from Woodbury.",
    author: USER_BY_ID["u-tyler"],
    replyCount: 8,
    upvotes: 17,
    createdAt: "2026-05-20T09:00:00",
    lastActivity: "2026-05-21T20:00:00",
  },
  {
    id: "t-food-1",
    communityId: "food",
    title: "New ramen spot in NE — anyone been?",
    preview:
      "Okashi opened last week. The tonkotsu is legitimately the best in the cities. Go NOW before the line gets long.",
    fullText:
      "Okashi opened last week at 13th and Central in NE. I went Thursday night around 6:30 and waited about 20 minutes for a table. Completely worth it. The tonkotsu broth is rich and not too salty — they clearly did their homework. The chashu pork melts. The gyoza is a must-order. Priced around $17-22 per bowl which feels fair for the quality. They don't take reservations yet so just show up. Thursday/Friday nights seem to be the peak times to avoid.",
    author: USER_BY_ID["u-grace"],
    replyCount: 14,
    upvotes: 34,
    createdAt: "2026-05-21T19:00:00",
    lastActivity: "2026-05-22T17:00:00",
  },
  {
    id: "t-food-2",
    communityId: "food",
    title: "Patio season is officially on — your picks?",
    preview:
      "Bryant Lake Bowl always, Surly patio for big groups, Harriet Brewing for a quieter vibe.",
    author: USER_BY_ID["u-ben-l"],
    replyCount: 27,
    upvotes: 51,
    createdAt: "2026-05-20T16:00:00",
    lastActivity: "2026-05-22T19:00:00",
  },
  {
    id: "t-pickup-1",
    communityId: "pickup",
    title: "Anyone want to add basketball to the rotation?",
    preview:
      "There are outdoor courts at Rosemount HS. Could do Sunday morning, separate from soccer.",
    author: USER_BY_ID["u-tyler"],
    replyCount: 9,
    upvotes: 20,
    createdAt: "2026-05-21T10:00:00",
    lastActivity: "2026-05-22T09:00:00",
  },
  {
    id: "t-pickup-2",
    communityId: "pickup",
    title: "What cleats are people running?",
    preview:
      "The field at Rosemount has turf in the fall and grass in spring. Recommend turf shoes for now.",
    author: USER_BY_ID["u-james"],
    replyCount: 3,
    upvotes: 6,
    createdAt: "2026-05-22T08:00:00",
    lastActivity: "2026-05-22T10:00:00",
  },
  {
    id: "t-brew-1",
    communityId: "breweries",
    title: "Surly's new seasonal is incredible",
    preview:
      "The Blueberry Wheat is back and better than ever. On tap now at the main taproom.",
    author: USER_BY_ID["u-vic"],
    replyCount: 7,
    upvotes: 18,
    createdAt: "2026-05-21T17:00:00",
    lastActivity: "2026-05-22T15:00:00",
  },
  {
    id: "t-brew-2",
    communityId: "breweries",
    title: "Dangerous Man crowler question",
    preview:
      "Do they still do crowlers to go? Going there Saturday and want to bring some to the BBQ.",
    author: USER_BY_ID["u-ryan"],
    replyCount: 4,
    upvotes: 9,
    createdAt: "2026-05-22T12:00:00",
    lastActivity: "2026-05-22T14:00:00",
  },
  {
    id: "t-brew-3",
    communityId: "breweries",
    title: "Best flight in the cities right now?",
    preview:
      "Voted: Indeed for variety, Bauhaus for the vibe, Pryes for the best single pour.",
    author: USER_BY_ID["u-ben-l"],
    replyCount: 19,
    upvotes: 38,
    createdAt: "2026-05-19T20:00:00",
    lastActivity: "2026-05-22T16:00:00",
  },
];

// ─── Replies (mock thread replies) ───────────────────────────────────────────

export const REPLIES: Reply[] = [
  // t-vike-1 replies
  {
    id: "rep-vike-1-1",
    threadId: "t-vike-1",
    author: USER_BY_ID["u-derek"],
    text: "The 4th Ave ramp is legit. I've been using it for two seasons. Just note it fills up by 10:30 on big game days — get there early.",
    upvotes: 8,
    createdAt: "2026-05-22T09:15:00",
  },
  {
    id: "rep-vike-1-2",
    threadId: "t-vike-1",
    author: USER_BY_ID["u-ryan"],
    text: "We usually park at the Hilton ramp on Marquette and just walk through the skyway. It's enclosed so if it's cold you stay warm the whole way.",
    upvotes: 12,
    createdAt: "2026-05-22T10:00:00",
  },
  {
    id: "rep-vike-1-3",
    threadId: "t-vike-1",
    author: USER_BY_ID["u-ben-l"],
    text: "Anyone tried the light rail? We did it once from Mall of America and it was actually seamless. Packed but fast.",
    upvotes: 6,
    createdAt: "2026-05-22T11:30:00",
  },
  {
    id: "rep-vike-1-4",
    threadId: "t-vike-1",
    author: USER_BY_ID["u-sam"],
    text: "Light rail is great if you're coming from the south — MOA station is easy. From the north it's less convenient. Still better than paying $40 to sit in traffic.",
    upvotes: 9,
    createdAt: "2026-05-22T12:45:00",
  },
  {
    id: "rep-vike-1-5",
    threadId: "t-vike-1",
    author: USER_BY_ID["u-jordan"],
    text: "The Newsroom shoutout is real — good bar, not too crushed before kickoff. Great spot for one more.",
    upvotes: 4,
    createdAt: "2026-05-22T14:30:00",
  },

  // t-family-1 replies
  {
    id: "rep-fam-1-1",
    threadId: "t-family-1",
    author: USER_BY_ID["u-kelly"],
    text: "We used Aqua-Tots in Burnsville for our daughter at that age. Small classes, super patient instructors. It's not cheap but worth it — she went from terrified to jumping in by week 3.",
    upvotes: 7,
    createdAt: "2026-05-21T15:30:00",
  },
  {
    id: "rep-fam-1-2",
    threadId: "t-family-1",
    author: USER_BY_ID["u-emily"],
    text: "There's a woman named Lisa who does private lessons out of her backyard pool in Apple Valley. She specializes in nervous kids. I can get you her number if you want.",
    upvotes: 11,
    createdAt: "2026-05-21T17:00:00",
  },
  {
    id: "rep-fam-1-3",
    threadId: "t-family-1",
    author: USER_BY_ID["u-james"],
    text: "Eagan Community Center has a summer session starting June 1 — we just registered. I think there were still a couple spots left as of last week.",
    upvotes: 5,
    createdAt: "2026-05-22T07:00:00",
  },
  {
    id: "rep-fam-1-4",
    threadId: "t-family-1",
    author: USER_BY_ID["u-maya"],
    text: "Emily — yes please!! Would love Lisa's number. DMing you now.",
    upvotes: 2,
    createdAt: "2026-05-22T08:00:00",
  },

  // t-outdoor-1 replies
  {
    id: "rep-out-1-1",
    threadId: "t-outdoor-1",
    author: USER_BY_ID["u-anna"],
    text: "Thanks for the update! I was going to take my dog out there Saturday morning. Sounds like it'll be fine by then.",
    upvotes: 3,
    createdAt: "2026-05-21T08:30:00",
  },
  {
    id: "rep-out-1-2",
    threadId: "t-outdoor-1",
    author: USER_BY_ID["u-tyler"],
    text: "The mud spots near the lake have been there all spring. I think it just sits in a low area that doesn't drain. Wear something you don't mind getting dirty.",
    upvotes: 6,
    createdAt: "2026-05-21T10:00:00",
  },
  {
    id: "rep-out-1-3",
    threadId: "t-outdoor-1",
    author: USER_BY_ID["u-eric"],
    text: "Update: went out again this morning. The mud spots are drying out. Should be a really solid run this weekend.",
    upvotes: 9,
    createdAt: "2026-05-22T07:30:00",
  },

  // t-food-1 replies
  {
    id: "rep-food-1-1",
    threadId: "t-food-1",
    author: USER_BY_ID["u-ben-l"],
    text: "We went Saturday and agreed completely. The broth is what gets you. I'm already planning a return trip.",
    upvotes: 5,
    createdAt: "2026-05-22T08:00:00",
  },
  {
    id: "rep-food-1-2",
    threadId: "t-food-1",
    author: USER_BY_ID["u-vic"],
    text: "Do they have a vegetarian option? My partner doesn't eat meat and every ramen place in the cities either doesn't have one or the veggie broth is sad.",
    upvotes: 4,
    createdAt: "2026-05-22T10:30:00",
  },
  {
    id: "rep-food-1-3",
    threadId: "t-food-1",
    author: USER_BY_ID["u-grace"],
    text: "Vic — yes! They have a shio broth that's vegetarian and it's actually really good. It's lighter than the tonkotsu but the depth is there.",
    upvotes: 7,
    createdAt: "2026-05-22T11:00:00",
  },
  {
    id: "rep-food-1-4",
    threadId: "t-food-1",
    author: USER_BY_ID["u-ryan"],
    text: "Went for lunch on a Tuesday — zero wait. Might be the move if you want to skip the dinner rush.",
    upvotes: 6,
    createdAt: "2026-05-22T17:00:00",
  },
];

// ─── Recommendations (15+) ────────────────────────────────────────────────────

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: "r-vike-1",
    communityId: "vikings",
    author: USER_BY_ID["u-sam"],
    text: "Parking at Lot C is half the price of the stadium ramp and only a 5-min walk.",
    category: "tips",
    upvotes: 23,
    createdAt: "2026-05-20T09:00:00",
  },
  {
    id: "r-vike-2",
    communityId: "vikings",
    author: USER_BY_ID["u-derek"],
    text: "Brit's Pub patio before the game is criminally underrated. Half-price apps before noon.",
    location: "Brit's Pub, 1110 Nicollet Mall",
    category: "places",
    upvotes: 14,
    createdAt: "2026-05-18T14:00:00",
  },
  {
    id: "r-vike-3",
    communityId: "vikings",
    author: USER_BY_ID["u-eric"],
    text: "Hand warmers from the Holiday on Park Ave save lives in November. Get there early — they sell out.",
    category: "gear",
    upvotes: 9,
    createdAt: "2026-05-15T10:00:00",
  },
  {
    id: "r-twins-1",
    communityId: "twins",
    author: USER_BY_ID["u-jordan"],
    text: "The Twins Store on the main concourse usually has a 'last call' sale rack on weeknights.",
    category: "tips",
    upvotes: 18,
    createdAt: "2026-05-20T12:00:00",
  },
  {
    id: "r-twins-2",
    communityId: "twins",
    author: USER_BY_ID["u-grace"],
    text: "Pre-game drinks at Tullibee in the Hewing Hotel — great cocktails, 5 min walk from Target Field.",
    location: "Tullibee, 300 Washington Ave N",
    category: "food-drink",
    upvotes: 31,
    createdAt: "2026-05-16T18:00:00",
  },
  {
    id: "r-outdoor-1",
    communityId: "outdoor",
    author: USER_BY_ID["u-eric"],
    text: "Lebanon Hills lower loop is the best after rain. The gravel drains fast and you get the falls.",
    location: "Lebanon Hills, Eagan",
    category: "places",
    upvotes: 27,
    createdAt: "2026-05-10T07:00:00",
  },
  {
    id: "r-outdoor-2",
    communityId: "outdoor",
    author: USER_BY_ID["u-anna"],
    text: "Salomon Speedcross 6 is the move for Minnesota trails. Grip on roots and mud is unreal.",
    category: "gear",
    upvotes: 22,
    createdAt: "2026-05-08T16:00:00",
  },
  {
    id: "r-outdoor-3",
    communityId: "outdoor",
    author: USER_BY_ID["u-tyler"],
    text: "Angry Catfish on 28th for post-ride coffee. Bike parking right outside. Incredible latte.",
    location: "Angry Catfish, 2812 E 28th St",
    category: "food-drink",
    upvotes: 19,
    createdAt: "2026-05-12T08:00:00",
  },
  {
    id: "r-family-1",
    communityId: "family",
    author: USER_BY_ID["u-maya"],
    text: "Como Zoo is free, which means it's worth it even for a 45-minute trip. Best on weekday mornings.",
    location: "Como Park Zoo, St. Paul",
    category: "places",
    upvotes: 35,
    createdAt: "2026-05-05T10:00:00",
  },
  {
    id: "r-family-2",
    communityId: "family",
    author: USER_BY_ID["u-kelly"],
    text: "Burnsville's Alimagnet Park splash pad opens Memorial Day and has free parking. Underrated.",
    location: "Alimagnet Park, Burnsville",
    category: "places",
    upvotes: 28,
    createdAt: "2026-05-18T11:00:00",
  },
  {
    id: "r-food-1",
    communityId: "food",
    author: USER_BY_ID["u-grace"],
    text: "Spyhouse on Nicollet has the best window seats in the city and the pour-over is dialed in.",
    location: "Spyhouse Coffee, 945 Nicollet Mall",
    category: "food-drink",
    upvotes: 41,
    createdAt: "2026-05-14T09:00:00",
  },
  {
    id: "r-food-2",
    communityId: "food",
    author: USER_BY_ID["u-ben-l"],
    text: "Alma's Sunday brunch is worth the reservation hassle. The smoked salmon hash is legendary.",
    location: "Restaurant Alma, 528 University Ave SE",
    category: "food-drink",
    upvotes: 24,
    createdAt: "2026-05-11T12:00:00",
  },
  {
    id: "r-brew-1",
    communityId: "breweries",
    author: USER_BY_ID["u-vic"],
    text: "Pryes has the best patio for big groups — reservable tables and the beer quality is elite.",
    location: "Pryes Brewing, 1401 West River Rd",
    category: "places",
    upvotes: 32,
    createdAt: "2026-05-13T17:00:00",
  },
  {
    id: "r-brew-2",
    communityId: "breweries",
    author: USER_BY_ID["u-ryan"],
    text: "Dangerous Man doesn't take cards — bring cash. And the brown ale is always on point.",
    location: "Dangerous Man Brewing, 1300 2nd St NE",
    category: "tips",
    upvotes: 17,
    createdAt: "2026-05-09T19:00:00",
  },
  {
    id: "r-brew-3",
    communityId: "breweries",
    author: USER_BY_ID["u-derek"],
    text: "Bauhaus rooftop opens at noon on weekends. Get there early — it fills up by 1pm.",
    location: "Bauhaus Brew Labs, 1315 Tyler St NE",
    category: "tips",
    upvotes: 26,
    createdAt: "2026-05-07T12:00:00",
  },
];

// ─── Connections map ─────────────────────────────────────────────────────────
// Each key is a user ID; value is the set of user IDs they are connected to.
// Derived from shared event attendance patterns in the mock data.

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

export function getMutualConnections(userAId: string, userBId: string): User[] {
  const aConns = new Set(CONNECTIONS[userAId] ?? []);
  const bConns = new Set(CONNECTIONS[userBId] ?? []);
  return [...aConns].filter((id) => bConns.has(id)).map((id) => USER_BY_ID[id]).filter(Boolean);
}

export function getSharedCommunities(userAId: string, userBId: string): string[] {
  // Returns community IDs that both users belong to.
  // Since community membership is global state in context, we derive it from events:
  // a community is "shared" if both users have attended events in that community.
  const aEventCommunities = new Set(
    EVENTS.filter((e) => e.attendees.some((u) => u.id === userAId) || e.host.id === userAId).map((e) => e.communityId),
  );
  const bEventCommunities = new Set(
    EVENTS.filter((e) => e.attendees.some((u) => u.id === userBId) || e.host.id === userBId).map((e) => e.communityId),
  );
  return [...aEventCommunities].filter((id) => bEventCommunities.has(id));
}

// ─── Legacy avatar palette (kept for backward compatibility) ─────────────────

export const AVATAR_PALETTE = [
  "bg-primary/85 text-primary-foreground",
  "bg-gathr-sage/85 text-white",
  "bg-gathr-coral/85 text-white",
  "bg-gathr-forest/85 text-white",
  "bg-accent text-accent-foreground",
];

// ─── Chats & Messages ─────────────────────────────────────────────────────────

export const CHATS: Chat[] = [
  // ── Event chats ──
  {
    id: "chat-vikes-tailgate",
    type: "event",
    name: "Vikings vs Packers Tailgate",
    participantIds: ["u-alex", "u-sam", "u-ryan", "u-kelly", "u-ben-n", "u-jordan"],
    lastMessage: "I'll grab the charcoal, someone bring brats",
    lastMessageAt: "2026-05-22T01:30:00",
    unreadCount: 2,
    eventEndedAt: "2026-05-24T18:00:00",
  },
  {
    id: "chat-lebanon-hike",
    type: "event",
    name: "Lebanon Hills Group Hike",
    participantIds: ["u-alex", "u-emily", "u-jordan", "u-anna"],
    lastMessage: "Trail conditions look perfect — see y'all at 8!",
    lastMessageAt: "2026-05-21T21:45:00",
    unreadCount: 0,
    eventEndedAt: "2026-05-22T12:00:00",
  },
  {
    id: "chat-soccer-pickup",
    type: "event",
    name: "Saturday Pickup Soccer",
    participantIds: ["u-alex", "u-tyler", "u-derek", "u-ryan", "u-ben-n", "u-grace"],
    lastMessage: "Good game everyone, same time next week?",
    lastMessageAt: "2026-05-17T19:20:00",
    unreadCount: 0,
    // Ended > 48h ago — will show as archived
    eventEndedAt: "2026-05-17T18:00:00",
  },
  // ── Direct messages ──
  {
    id: "chat-dm-sam",
    type: "dm",
    name: "Sam",
    participantIds: ["u-alex", "u-sam"],
    lastMessage: "Yeah let's do it, I'll send you the address",
    lastMessageAt: "2026-05-22T00:15:00",
    unreadCount: 1,
  },
  {
    id: "chat-dm-jordan",
    type: "dm",
    name: "Jordan",
    participantIds: ["u-alex", "u-jordan"],
    lastMessage: "Glad we ran into each other at the hike!",
    lastMessageAt: "2026-05-21T18:30:00",
    unreadCount: 0,
  },
  {
    id: "chat-dm-kelly",
    type: "dm",
    name: "Kelly",
    participantIds: ["u-alex", "u-kelly"],
    lastMessage: "The food tent at Lot C is way underrated",
    lastMessageAt: "2026-05-20T14:00:00",
    unreadCount: 0,
  },
];

export const CHAT_MESSAGES: ChatMessage[] = [
  // ── Vikings tailgate group chat ──
  { id: "m1",  chatId: "chat-vikes-tailgate", senderId: "u-sam",    text: "Who's handling parking? Lot C fills up fast on game days.",               timestamp: "2026-05-22T00:05:00" },
  { id: "m2",  chatId: "chat-vikes-tailgate", senderId: "u-ryan",   text: "I'll get there by 11 and hold a spot. Bring a cooler.",                    timestamp: "2026-05-22T00:12:00" },
  { id: "m3",  chatId: "chat-vikes-tailgate", senderId: "u-alex",   text: "On it. Also — does anyone have a portable speaker?",                       timestamp: "2026-05-22T00:18:00" },
  { id: "m4",  chatId: "chat-vikes-tailgate", senderId: "u-kelly",  text: "I've got a JBL. Sam, you're on brats right?",                              timestamp: "2026-05-22T00:25:00" },
  { id: "m5",  chatId: "chat-vikes-tailgate", senderId: "u-sam",    text: "Yep, two packs. Ryan bringing the beer?",                                  timestamp: "2026-05-22T00:31:00" },
  { id: "m6",  chatId: "chat-vikes-tailgate", senderId: "u-ryan",   text: "Obviously. Summit EPA incoming.",                                           timestamp: "2026-05-22T00:35:00" },
  { id: "m7",  chatId: "chat-vikes-tailgate", senderId: "u-jordan", text: "I can be there by noon. Does the lot open at 10?",                         timestamp: "2026-05-22T01:10:00" },
  { id: "m8",  chatId: "chat-vikes-tailgate", senderId: "u-ben-n",  text: "Usually 9:30 for Lot C. Ryan can you text when you're set up?",             timestamp: "2026-05-22T01:20:00" },
  { id: "m9",  chatId: "chat-vikes-tailgate", senderId: "u-ryan",   text: "Will do. Look for the blue tent.",                                         timestamp: "2026-05-22T01:25:00" },
  { id: "m10", chatId: "chat-vikes-tailgate", senderId: "u-alex",   text: "I'll grab the charcoal, someone bring brats",                              timestamp: "2026-05-22T01:30:00" },

  // ── Lebanon Hills hike group chat ──
  { id: "m11", chatId: "chat-lebanon-hike",   senderId: "u-emily",  text: "Just checked the trail map — lower loop is 3.5 miles and super scenic.",   timestamp: "2026-05-21T19:00:00" },
  { id: "m12", chatId: "chat-lebanon-hike",   senderId: "u-jordan", text: "I've done it twice this spring. It's perfect right now.",                   timestamp: "2026-05-21T19:15:00" },
  { id: "m13", chatId: "chat-lebanon-hike",   senderId: "u-alex",   text: "Meet at the south trailhead parking lot? 8am?",                            timestamp: "2026-05-21T19:30:00" },
  { id: "m14", chatId: "chat-lebanon-hike",   senderId: "u-anna",   text: "Works for me! Should I bring snacks?",                                     timestamp: "2026-05-21T20:00:00" },
  { id: "m15", chatId: "chat-lebanon-hike",   senderId: "u-emily",  text: "Yes please — I'll bring water. Jordan, you have the good trail shoes?",    timestamp: "2026-05-21T20:10:00" },
  { id: "m16", chatId: "chat-lebanon-hike",   senderId: "u-jordan", text: "Salomon Speedcross. Ready.",                                               timestamp: "2026-05-21T20:14:00" },
  { id: "m17", chatId: "chat-lebanon-hike",   senderId: "u-alex",   text: "Lol perfect. Weather looks great — 62° and sunny.",                        timestamp: "2026-05-21T21:40:00" },
  { id: "m18", chatId: "chat-lebanon-hike",   senderId: "u-emily",  text: "Trail conditions look perfect — see y'all at 8!",                          timestamp: "2026-05-21T21:45:00" },

  // ── Soccer pickup (archived) ──
  { id: "m19", chatId: "chat-soccer-pickup",  senderId: "u-tyler",  text: "Field at Rosemount Athletic Complex is open — everyone good with 4pm?",    timestamp: "2026-05-17T09:00:00" },
  { id: "m20", chatId: "chat-soccer-pickup",  senderId: "u-derek",  text: "Works for me. How many we got?",                                           timestamp: "2026-05-17T09:30:00" },
  { id: "m21", chatId: "chat-soccer-pickup",  senderId: "u-alex",   text: "Looks like 6 confirmed. Need 4 more for a proper game.",                   timestamp: "2026-05-17T10:00:00" },
  { id: "m22", chatId: "chat-soccer-pickup",  senderId: "u-grace",  text: "I can bring my brother and his friend if that helps.",                     timestamp: "2026-05-17T10:15:00" },
  { id: "m23", chatId: "chat-soccer-pickup",  senderId: "u-ryan",   text: "Perfect. I'll grab the pinnies.",                                          timestamp: "2026-05-17T10:20:00" },
  { id: "m24", chatId: "chat-soccer-pickup",  senderId: "u-ben-n",  text: "See you all out there. Don't forget cleats — field was muddy last week.",  timestamp: "2026-05-17T12:00:00" },
  { id: "m25", chatId: "chat-soccer-pickup",  senderId: "u-tyler",  text: "Good game everyone, same time next week?",                                 timestamp: "2026-05-17T19:20:00" },

  // ── Sam DM ──
  { id: "m26", chatId: "chat-dm-sam",         senderId: "u-sam",    text: "Hey! Great tailgate on Sunday. We should do a proper dinner sometime.",    timestamp: "2026-05-21T22:00:00" },
  { id: "m27", chatId: "chat-dm-sam",         senderId: "u-alex",   text: "100%. Somewhere on Nicollet? I've been wanting to try Young Joni.",       timestamp: "2026-05-21T22:10:00" },
  { id: "m28", chatId: "chat-dm-sam",         senderId: "u-sam",    text: "Oh that place is incredible. Friday or Saturday work for you?",            timestamp: "2026-05-21T22:15:00" },
  { id: "m29", chatId: "chat-dm-sam",         senderId: "u-alex",   text: "Friday's better. Should I make a reservation?",                            timestamp: "2026-05-21T23:55:00" },
  { id: "m30", chatId: "chat-dm-sam",         senderId: "u-sam",    text: "Yeah let's do it, I'll send you the address",                              timestamp: "2026-05-22T00:15:00" },

  // ── Jordan DM ──
  { id: "m31", chatId: "chat-dm-jordan",      senderId: "u-jordan", text: "Hey Alex! Really enjoyed the hike today.",                                 timestamp: "2026-05-21T14:00:00" },
  { id: "m32", chatId: "chat-dm-jordan",      senderId: "u-alex",   text: "Same! Lebanon Hills is seriously underrated. We should do the upper loop next time.", timestamp: "2026-05-21T14:20:00" },
  { id: "m33", chatId: "chat-dm-jordan",      senderId: "u-jordan", text: "Definitely. I heard the waterfall is best in early June.",                 timestamp: "2026-05-21T15:00:00" },
  { id: "m34", chatId: "chat-dm-jordan",      senderId: "u-alex",   text: "Let's plan for it. Also — loved the snacks Anna brought.",                 timestamp: "2026-05-21T17:50:00" },
  { id: "m35", chatId: "chat-dm-jordan",      senderId: "u-jordan", text: "Glad we ran into each other at the hike!",                                timestamp: "2026-05-21T18:30:00" },

  // ── Kelly DM ──
  { id: "m36", chatId: "chat-dm-kelly",       senderId: "u-kelly",  text: "Are you going to the Vikings game on Sunday?",                             timestamp: "2026-05-19T11:00:00" },
  { id: "m37", chatId: "chat-dm-kelly",       senderId: "u-alex",   text: "Yes! Tailgating with Sam and Ryan beforehand. Join us if you want.",       timestamp: "2026-05-19T11:15:00" },
  { id: "m38", chatId: "chat-dm-kelly",       senderId: "u-kelly",  text: "I'll be there for the tailgate. Lot C right?",                             timestamp: "2026-05-19T11:30:00" },
  { id: "m39", chatId: "chat-dm-kelly",       senderId: "u-alex",   text: "Yep. Blue tent near the east entrance.",                                   timestamp: "2026-05-20T13:00:00" },
  { id: "m40", chatId: "chat-dm-kelly",       senderId: "u-kelly",  text: "The food tent at Lot C is way underrated",                                 timestamp: "2026-05-20T14:00:00" },
];
