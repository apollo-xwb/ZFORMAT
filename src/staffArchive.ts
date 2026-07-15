import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { sanitizeForFirestore } from "./firestoreUtils";

export type ArchivedStaffProfile = {
  id: string;
  name: string;
  pin: string;
  role: "admin" | "general";
  onShift: boolean;
  mustChangePin?: boolean;
  archivedAt: number;
  archivedBy?: string;
  originalId: string;
};

export const DEFAULT_STAFF_PIN = "1234";

export async function archiveStaffProfile(input: {
  profile: {
    id: string;
    name: string;
    pin: string;
    role: "admin" | "general";
    onShift: boolean;
    mustChangePin?: boolean;
  };
  archivedBy?: string;
}) {
  const archiveId = `arch-${input.profile.id}-${Date.now().toString(36)}`;
  const record: ArchivedStaffProfile = {
    id: archiveId,
    originalId: input.profile.id,
    name: input.profile.name,
    pin: input.profile.pin,
    role: input.profile.role,
    onShift: false,
    mustChangePin: input.profile.mustChangePin,
    archivedAt: Date.now(),
    archivedBy: input.archivedBy,
  };
  await setDoc(
    doc(db, "staff_archives", archiveId),
    sanitizeForFirestore(record) as Record<string, unknown>
  );
  return record;
}
