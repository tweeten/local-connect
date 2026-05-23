import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { TopBar, GathrAvatar, GathrButton, GathrToggle } from "@/components/ui";
import { useGathr } from "@/lib/GathrContext";
import { getUserInitials } from "@/lib/gather-data";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Gathr — Settings" }] }),
  component: SettingsScreen,
});

interface SettingsRowProps {
  label: string;
  secondary?: string;
  danger?: boolean;
  showChevron?: boolean;
  avatar?: React.ReactNode;
  onClick?: () => void;
  right?: React.ReactNode;
}

function SettingsRow({
  label,
  secondary,
  danger,
  showChevron = true,
  avatar,
  onClick,
  right,
}: SettingsRowProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="flex h-14 w-full items-center gap-3 px-5 text-left hover:bg-gathr-cream-dark/60 transition border-b border-gathr-warm-gray-light/30 last:border-b-0"
    >
      {avatar && <span className="shrink-0">{avatar}</span>}
      <span className={`flex-1 text-base ${danger ? "text-gathr-coral" : "text-gathr-charcoal"}`}>
        {label}
      </span>
      {right ?? (
        <span className="flex shrink-0 items-center gap-1.5">
          {secondary && (
            <span className="text-sm text-gathr-warm-gray">{secondary}</span>
          )}
          {showChevron && !danger && (
            <ChevronRight className="h-4 w-4 text-gathr-warm-gray-light" strokeWidth={1.75} />
          )}
        </span>
      )}
    </motion.button>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="mt-6">
      <p className="px-5 mb-2 text-xs font-semibold tracking-widest uppercase text-gathr-warm-gray">
        {title}
      </p>
      <div className="border-t border-gathr-warm-gray-light/30">{children}</div>
    </section>
  );
}

function SettingsScreen() {
  const { state } = useGathr();
  const user = state.currentUser;

  const [notifs, setNotifs] = useState({
    eventReminders: true,
    postEventCheckins: true,
    communityConversations: true,
    weeklyDigest: true,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  function toggleNotif(key: keyof typeof notifs) {
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    // Single root element — Fragment roots cause AnimatePresence to misfire
    <div className="h-full flex flex-col bg-gathr-cream">
      {/* Solid TopBar background so it doesn't appear transparent on entry */}
      <TopBar back="/profile" title="Settings" scrolled />

      <main className="flex-1 overflow-y-auto pt-16 pb-20">
        {/* Profile */}
        <Section title="Profile">
          <SettingsRow
            label="Edit name"
            secondary={user.firstName}
            onClick={() => alert("Edit name")}
          />
          <SettingsRow
            label="Change photo"
            avatar={
              <GathrAvatar
                size="xs"
                initials={getUserInitials(user)}
                className="!ring-0"
              />
            }
            onClick={() => alert("Change photo")}
          />
          <SettingsRow
            label="Neighborhood"
            secondary={user.neighborhood}
            onClick={() => alert("Change neighborhood")}
          />
        </Section>

        {/* Notifications */}
        <Section title="Notifications">
          {(
            [
              ["eventReminders",        "Event reminders"],
              ["postEventCheckins",      "Post-event check-ins"],
              ["communityConversations", "Community conversations"],
              ["weeklyDigest",          "Weekly digest"],
            ] as [keyof typeof notifs, string][]
          ).map(([key, label]) => (
            <SettingsRow
              key={key}
              label={label}
              showChevron={false}
              right={
                <GathrToggle
                  checked={notifs[key]}
                  onChange={() => toggleNotif(key)}
                  label={label}
                />
              }
            />
          ))}
        </Section>

        {/* Privacy */}
        <Section title="Privacy">
          <SettingsRow
            label="Who can see my events"
            secondary="My communities"
            onClick={() => alert("Who can see my events")}
          />
          <SettingsRow
            label="Who can send requests"
            secondary="Everyone"
            onClick={() => alert("Who can send requests")}
          />
          <SettingsRow
            label="Blocked users"
            onClick={() => alert("Blocked users")}
          />
        </Section>

        {/* Account */}
        <Section title="Account">
          <SettingsRow
            label="Subscription"
            secondary="Free plan"
            onClick={() => alert("Subscription")}
          />
          <SettingsRow
            label="Help & support"
            onClick={() => alert("Help & support")}
          />
          <SettingsRow
            label="Delete account"
            danger
            showChevron={false}
            onClick={() => setShowDeleteModal(true)}
          />
        </Section>

        <div className="h-8" />
      </main>

      {/* Delete account modal — inside single root, fixed positioning handles viewport placement */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-gathr-charcoal/40"
              onClick={() => setShowDeleteModal(false)}
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 mx-auto max-w-sm rounded-card-lg bg-gathr-cream p-6 shadow-warm"
            >
              <h2 className="font-display text-xl text-gathr-charcoal text-center">
                Are you sure?
              </h2>
              <p className="mt-3 text-sm text-gathr-warm-gray text-center leading-relaxed">
                This is permanent and can't be undone. All your connections and history will be removed.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <GathrButton
                  variant="secondary"
                  className="w-full border-gathr-coral text-gathr-coral hover:bg-gathr-coral/10"
                  onClick={() => alert("Account deleted")}
                >
                  Delete my account
                </GathrButton>
                <GathrButton
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Never mind
                </GathrButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
