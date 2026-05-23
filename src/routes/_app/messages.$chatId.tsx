import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TopBar, GathrAvatar } from "@/components/ui";
import {
  CHATS,
  CHAT_MESSAGES,
  USER_BY_ID,
  getUserInitials,
  type ChatMessage,
} from "@/lib/gather-data";

export const Route = createFileRoute("/_app/messages/$chatId")({
  head: () => ({ meta: [{ title: "Gathr — Chat" }] }),
  component: ChatThread,
});

const CURRENT_USER_ID = "u-alex";

function formatMsgTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

/** Show a timestamp label every 3rd message roughly */
function shouldShowTimestamp(messages: ChatMessage[], index: number): boolean {
  return index === 0 || index % 3 === 0;
}

function ChatThread() {
  const { chatId } = Route.useParams();
  const chat = CHATS.find((c) => c.id === chatId);

  const [messages, setMessages] = useState<ChatMessage[]>(
    CHAT_MESSAGES.filter((m) => m.chatId === chatId),
  );
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function sendMessage() {
    const text = inputValue.trim();
    if (!text) return;
    const newMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      chatId,
      senderId: CURRENT_USER_ID,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    inputRef.current?.focus();
  }

  if (!chat) {
    return (
      <div className="h-full flex flex-col bg-gathr-cream">
        <TopBar back="/messages" title="Chat" />
        <main className="flex-1 flex items-center justify-center pt-16">
          <p className="text-sm text-gathr-warm-gray">Conversation not found.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gathr-cream">
      <TopBar back="/messages" title={chat.name} />

      {/* Message list */}
      <main className="flex-1 overflow-y-auto pt-16 pb-[88px]">
        <div className="mx-auto max-w-2xl px-4 py-4 flex flex-col gap-1">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isSelf = msg.senderId === CURRENT_USER_ID;
              const sender = USER_BY_ID[msg.senderId];
              const showTs = shouldShowTimestamp(messages, idx);

              return (
                <motion.div
                  key={msg.id}
                  initial={msg.id.startsWith("local-") ? { opacity: 0, x: 24 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {showTs && (
                    <p className="text-center text-xs text-gathr-warm-gray my-3">
                      {formatMsgTime(msg.timestamp)}
                    </p>
                  )}

                  {isSelf ? (
                    /* Own message — right aligned */
                    <div className="flex justify-end mb-1">
                      <div className="max-w-[72%] rounded-2xl rounded-tr-sm bg-gathr-amber-glow px-4 py-2.5">
                        <p className="text-sm text-gathr-charcoal leading-relaxed">{msg.text}</p>
                      </div>
                    </div>
                  ) : (
                    /* Other's message — left aligned */
                    <div className="flex items-end gap-2 mb-1">
                      <GathrAvatar
                        size="xs"
                        initials={sender ? getUserInitials(sender) : "?"}
                        className="mb-0.5"
                      />
                      <div className="max-w-[72%]">
                        {(!messages[idx - 1] || messages[idx - 1].senderId !== msg.senderId) && (
                          <p className="text-xs font-semibold text-gathr-charcoal mb-1 ml-1">
                            {sender?.firstName ?? "Someone"}
                          </p>
                        )}
                        <div className="rounded-2xl rounded-tl-sm bg-gathr-cream-dark px-4 py-2.5">
                          <p className="text-sm text-gathr-charcoal leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Fixed input bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-gathr-cream border-t border-gathr-warm-gray-light/30">
        <div className="mx-auto max-w-2xl px-4 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
          {/* 8px gap above BottomNav (64px) */}
          <div className="mb-[72px] flex items-center gap-2">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 h-12 rounded-full bg-gathr-cream-dark px-5 text-sm text-gathr-charcoal placeholder:text-gathr-warm-gray-light outline-none border-none focus-visible:ring-2 focus-visible:ring-gathr-amber"
            />
            <button
              onClick={sendMessage}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gathr-amber hover:bg-gathr-amber-light transition active:scale-95"
            >
              <Send className="h-4 w-4 text-white" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
