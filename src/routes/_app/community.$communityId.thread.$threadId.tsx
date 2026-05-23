import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, ChevronUp } from "lucide-react";
import { TopBar, GathrAvatar } from "@/components/ui";
import {
  THREADS,
  REPLIES,
  CURRENT_USER,
  getUserInitials,
  type Reply,
} from "@/lib/gather-data";
import { TRANSITION_DEFAULT, TRANSITION_SPRING } from "@/lib/design-tokens";

export const Route = createFileRoute(
  "/_app/community/$communityId/thread/$threadId"
)({
  head: () => ({ meta: [{ title: "Gathr — Thread" }] }),
  component: ThreadDetail,
});

function formatTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ThreadDetail() {
  const { communityId, threadId } = Route.useParams();
  const thread = THREADS.find((t) => t.id === threadId);
  const baseReplies = REPLIES.filter((r) => r.threadId === threadId);

  const [localReplies, setLocalReplies] = useState<Reply[]>(baseReplies);
  const [replyText, setReplyText] = useState("");
  const [postUpvoted, setPostUpvoted] = useState(false);
  const [postUpvotes, setPostUpvotes] = useState(thread?.upvotes ?? 0);
  const [upvotedReplies, setUpvotedReplies] = useState<Set<string>>(new Set());
  const [replyUpvoteCounts, setReplyUpvoteCounts] = useState<Record<string, number>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localReplies.length]);

  function handleSend() {
    const text = replyText.trim();
    if (!text) return;
    const newReply: Reply = {
      id: `rep-local-${Date.now()}`,
      threadId: threadId,
      author: CURRENT_USER,
      text,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };
    setLocalReplies((prev) => [...prev, newReply]);
    setReplyText("");
  }

  function handleUpvoteReply(replyId: string, base: number) {
    setUpvotedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(replyId)) {
        next.delete(replyId);
        setReplyUpvoteCounts((c) => ({ ...c, [replyId]: (c[replyId] ?? base) - 1 }));
      } else {
        next.add(replyId);
        setReplyUpvoteCounts((c) => ({ ...c, [replyId]: (c[replyId] ?? base) + 1 }));
      }
      return next;
    });
  }

  if (!thread) {
    return (
      <div className="h-full flex flex-col bg-gathr-cream">
        <TopBar back={`/community/${communityId}`} title="Thread" />
        <main className="flex-1 overflow-y-auto pt-16 pb-20 px-5">
          <p className="mt-8 text-center text-sm text-gathr-warm-gray">
            This thread no longer exists.
          </p>
          <Link
            to="/community/$communityId"
            params={{ communityId }}
            className="mt-4 block text-center text-sm text-gathr-amber"
          >
            ← Back to community
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gathr-cream">
      <TopBar back={`/community/${communityId}`} title={thread.title} scrolled />

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto pt-16 pb-32 px-4">
        {/* Original post */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={TRANSITION_DEFAULT}
          className="mt-4 rounded-2xl bg-gathr-cream-dark shadow-warm p-5"
        >
          <div className="flex items-start gap-3">
            <GathrAvatar
              initials={getUserInitials(thread.author)}
              size="sm"
              className="mt-0.5 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-body font-semibold text-sm text-gathr-charcoal">
                  {thread.author.firstName}
                </span>
                <span className="text-xs text-gathr-warm-gray shrink-0">
                  {formatTime(thread.createdAt)}
                </span>
              </div>
              <h1 className="mt-1 font-display text-lg text-gathr-charcoal leading-snug">
                {thread.title}
              </h1>
              <p className="mt-2 text-sm text-gathr-charcoal leading-relaxed">
                {thread.fullText ?? thread.preview}
              </p>

              <motion.button
                onClick={() => {
                  setPostUpvoted((p) => !p);
                  setPostUpvotes((n) => (postUpvoted ? n - 1 : n + 1));
                }}
                whileTap={{ scale: 0.98 }}
                transition={TRANSITION_SPRING}
                aria-label="Upvote post"
                className={`mt-3 flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  postUpvoted ? "text-gathr-amber" : "text-gathr-warm-gray hover:text-gathr-amber"
                }`}
              >
                <motion.span
                  animate={postUpvoted ? { y: [-3, 0] } : { y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronUp className="h-4 w-4" strokeWidth={2} />
                </motion.span>
                <motion.span
                  key={postUpvotes}
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                              {postUpvotes} helpful
                </motion.span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Replies */}
        {localReplies.length > 0 && (
          <div className="mt-4">
            <p className="px-1 mb-3 text-xs font-semibold tracking-wide text-gathr-warm-gray uppercase">
              {localReplies.length} {localReplies.length === 1 ? "reply" : "replies"}
            </p>
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {localReplies.map((reply, i) => {
                  const isUpvoted = upvotedReplies.has(reply.id);
                  const count = replyUpvoteCounts[reply.id] ?? reply.upvotes;
                  return (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: i < baseReplies.length ? i * 0.04 : 0 }}
                      className="flex items-start gap-3"
                    >
                      <GathrAvatar
                        initials={getUserInitials(reply.author)}
                        size="xs"
                        className="mt-0.5 shrink-0"
                      />
                      <div className="min-w-0 flex-1 rounded-2xl bg-gathr-cream-dark px-4 py-3 shadow-warm-sm">
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <span className="font-body font-semibold text-sm text-gathr-charcoal">
                            {reply.author.firstName}
                          </span>
                          <span className="text-xs text-gathr-warm-gray shrink-0">
                            {formatTime(reply.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gathr-charcoal leading-relaxed">
                          {reply.text}
                        </p>
                        {reply.upvotes > 0 || upvotedReplies.has(reply.id) ? (
                          <motion.button
                            onClick={() => handleUpvoteReply(reply.id, reply.upvotes)}
                            whileTap={{ scale: 0.98 }}
                            transition={TRANSITION_SPRING}
                            aria-label="Upvote reply"
                            className={`mt-2 flex items-center gap-1 text-xs font-medium transition-colors ${
                              isUpvoted ? "text-gathr-amber" : "text-gathr-warm-gray hover:text-gathr-amber"
                            }`}
                          >
                            <ChevronUp className="h-3.5 w-3.5" strokeWidth={2} />
                            <motion.span
                              key={count}
                              initial={{ y: -4, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.12 }}
                            >
                              {count}
                            </motion.span>
                          </motion.button>
                        ) : null}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* Fixed reply input */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-gathr-cream border-t border-gathr-warm-gray-light/40 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-3">
          <GathrAvatar
            initials={getUserInitials(CURRENT_USER)}
            size="xs"
            className="shrink-0"
          />
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Add a reply..."
            className="flex-1 rounded-full bg-gathr-cream-dark px-4 py-2 text-sm text-gathr-charcoal placeholder:text-gathr-warm-gray-light outline-none border border-gathr-warm-gray-light/60 focus:border-gathr-amber transition-colors"
          />
          <motion.button
            whileTap={{ scale: 0.98 }}
            transition={TRANSITION_SPRING}
            onClick={handleSend}
            disabled={!replyText.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gathr-amber text-white disabled:opacity-40 transition-opacity"
            aria-label="Send reply"
          >
            <Send className="h-4 w-4" strokeWidth={2} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
