import { createFileRoute, Link } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { motion } from "motion/react";
import { TopBar, GathrAvatar } from "@/components/ui";
import { CHATS, USER_BY_ID, getUserInitials } from "@/lib/gather-data";
import { STAGGER_CONTAINER, TRANSITION_DEFAULT } from "@/lib/design-tokens";

export const Route = createFileRoute("/_app/messages")({
  head: () => ({ meta: [{ title: "Gathr — Messages" }] }),
  component: MessagesScreen,
});

const CURRENT_USER_ID = "u-alex";

function isArchived(chat: (typeof CHATS)[number]): boolean {
  if (!chat.eventEndedAt) return false;
  const endedMs = new Date(chat.eventEndedAt).getTime();
  const nowMs = Date.now();
  return nowMs - endedMs > 48 * 60 * 60 * 1000;
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h`;
  return `${Math.floor(diffHrs / 24)}d`;
}

function MessagesScreen() {
  const eventChats = CHATS.filter((c) => c.type === "event").sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );
  const dmChats = CHATS.filter((c) => c.type === "dm").sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
  );

  return (
    <div className="h-full flex flex-col bg-gathr-cream">
      <TopBar back="/profile" title="Messages" />
      <main className="flex-1 overflow-y-auto pt-16 pb-20">
        <div className="mx-auto max-w-2xl">
          {/* EVENT CHATS */}
          <section className="pt-6">
            <p className="px-5 text-xs font-semibold tracking-widest uppercase text-gathr-warm-gray mb-2">
              Event Chats
            </p>
            <motion.div
              variants={STAGGER_CONTAINER}
              initial="initial"
              animate="animate"
            >
              {eventChats.map((chat) => {
                const archived = isArchived(chat);
                return (
                  <motion.div
                    key={chat.id}
                    variants={{ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0, transition: TRANSITION_DEFAULT } }}
                  >
                  <Link
                    to="/messages/$chatId"
                    params={{ chatId: chat.id }}
                    className={`flex items-center gap-3 px-5 py-3.5 hover:bg-gathr-cream-dark/60 transition border-b border-gathr-warm-gray-light/30 ${archived ? "opacity-60" : ""}`}
                  >
                    {/* Group icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gathr-amber-glow">
                      <Users className="h-5 w-5 text-gathr-amber" strokeWidth={1.75} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="font-semibold text-gathr-charcoal text-sm leading-snug truncate">
                          {chat.name}
                        </p>
                        {archived && (
                          <span className="shrink-0 text-xs text-gathr-warm-gray border border-gathr-warm-gray-light rounded-full px-1.5 py-px leading-none">
                            Archived
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gathr-warm-gray truncate mt-0.5">
                        {chat.lastMessage}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="text-xs text-gathr-warm-gray">
                        {formatTimestamp(chat.lastMessageAt)}
                      </span>
                      {chat.unreadCount > 0 && (
                        <span className="block h-2 w-2 rounded-full bg-gathr-coral" />
                      )}
                    </div>
                  </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>

          {/* DIRECT MESSAGES */}
          <section className="pt-6">
            <p className="px-5 text-xs font-semibold tracking-widest uppercase text-gathr-warm-gray mb-2">
              Direct Messages
            </p>
            {dmChats.length === 0 ? (
              <p className="px-5 py-4 text-sm text-gathr-warm-gray">
                No messages yet. Mutual connections from events can message you here.
              </p>
            ) : (
              <motion.div
                variants={STAGGER_CONTAINER}
                initial="initial"
                animate="animate"
              >
                {dmChats.map((chat) => {
                  const otherId = chat.participantIds.find((id) => id !== CURRENT_USER_ID);
                  const other = otherId ? USER_BY_ID[otherId] : null;
                  return (
                    <motion.div
                      key={chat.id}
                      variants={{ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0, transition: TRANSITION_DEFAULT } }}
                    >
                    <Link
                      to="/messages/$chatId"
                      params={{ chatId: chat.id }}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-gathr-cream-dark/60 transition border-b border-gathr-warm-gray-light/30"
                    >
                      <GathrAvatar
                        size="sm"
                        initials={other ? getUserInitials(other) : "?"}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gathr-charcoal text-sm leading-snug">
                          {chat.name}
                        </p>
                        <p className="text-sm text-gathr-warm-gray truncate mt-0.5">
                          {chat.lastMessage}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-col items-end gap-1.5">
                        <span className="text-xs text-gathr-warm-gray">
                          {formatTimestamp(chat.lastMessageAt)}
                        </span>
                        {chat.unreadCount > 0 && (
                          <span className="block h-2 w-2 rounded-full bg-gathr-coral" />
                        )}
                      </div>
                    </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
