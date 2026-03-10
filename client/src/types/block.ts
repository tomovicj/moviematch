import type { UserStub } from './user';

/**
 * A single item from GET /api/blocks.
 * Also returned (201) from POST /api/blocks/:userId.
 */
export interface BlockItem {
  id: string;
  blockerId: string;
  blockedId: string;
  createdAt: string;
  blocked: UserStub;
}
