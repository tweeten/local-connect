import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/group/$groupId/chat")({
  component: GroupChatComponent,
  head: () => ({ meta: [{ title: "Gathr — Group Chat" }] }),
});

function GroupChatComponent() {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-lg text-gathr-warm-gray">Group Chat</p>
    </div>
  );
}
