import type { UserStub } from './user';

/** Mirrors the server-side Prisma FriendshipStatus enum. */
export type FriendshipStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

/**
 * A single item from GET /api/friendships.
 * Returns the other user in the friendship plus when it was accepted.
 */
export interface FriendItem {
  friendshipId: string;
  since: string;
  friend: UserStub;
}

/**
 * Full friendship record with both participants embedded.
 * Returned from POST /api/friendships/request, POST …/:id/accept,
 * and POST …/:id/reject.
 */
export interface FriendshipWithUsers {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: string;
  updatedAt: string;
  requester: UserStub;
  addressee: UserStub;
}

/**
 * Item from GET /api/friendships/requests/pending.
 * Incoming request — only the requester is embedded.
 */
export interface PendingRequest {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: 'PENDING';
  createdAt: string;
  updatedAt: string;
  requester: UserStub;
}

/**
 * Item from GET /api/friendships/requests/sent.
 * Outgoing request — only the addressee is embedded.
 */
export interface SentRequest {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: 'PENDING';
  createdAt: string;
  updatedAt: string;
  addressee: UserStub;
}

/**
 * Response from GET /api/friendships/status/:userId.
 * status is 'NONE' when no relationship exists.
 */
export type FriendshipStatusResponse =
  | { status: 'NONE' }
  | { status: FriendshipStatus; friendshipId: string; isRequester: boolean };
