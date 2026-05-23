import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/group/$groupId/schedule")({
  component: GroupScheduleComponent,
  head: () => ({ meta: [{ title: "Gathr — Group Schedule" }] }),
});

function GroupScheduleComponent() {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-lg text-gathr-warm-gray">Group Schedule</p>
    </div>
  );
}
