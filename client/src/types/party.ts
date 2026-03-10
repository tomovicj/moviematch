import type { Movie } from './movie';

/** Mirrors the server-side Prisma PartyInvitationStatus enum. */
export type PartyInvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

/**
 * Party record returned from GET /api/parties, GET /api/parties/:id,
 * POST /api/parties, and DELETE /api/parties/:id.
 */
export interface Party {
  id: string;
  name: string;
  hostId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Party invitation record returned from GET /api/parties/invitations
 * and POST /api/parties/invitations/:id/respond/*.
 */
export interface PartyInvitation {
  id: string;
  partyId: string;
  inviteeId: string;
  status: PartyInvitationStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * A single member entry from GET /api/parties/:id/members.
 * The host has isHost: true; accepted invitees have isHost: false.
 */
export interface PartyMember {
  id: string;
  name: string;
  image: string | null;
  isHost: boolean;
}

/**
 * A movie that every party member has swiped LIKE on.
 * Returned from GET /api/parties/:id/matches.
 * Shape matches the full Movie record.
 */
export type PartyMatch = Movie;
