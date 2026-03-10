/**
 * Minimal public profile returned from:
 *   GET /api/users/me
 *   GET /api/users/search
 *   GET /api/users/:userId
 *
 * Also used as the embedded `friend`, `requester`, `addressee`, `invitee`,
 * and `blocked` user stubs across other endpoints.
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

/**
 * Minimal user stub embedded in relation objects (friendships, blocks, parties).
 * A subset of UserProfile — no email field.
 */
export interface UserStub {
  id: string;
  name: string;
  image: string | null;
}
