import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/group/$groupId/thread/$threadId")({
  component: GroupThreadComponent,
  head: () => ({ meta: [{ title: "Gathr — Thread" }] }),
});

function GroupThreadComponent() {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-lg text-gathr-warm-gray">Group Thread</p>
    </div>
  );
}
