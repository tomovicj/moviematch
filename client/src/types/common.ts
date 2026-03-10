/** Shape of every error response from the server: { error: { message, status } } */
export interface ApiError {
  error: {
    message: string;
    status: number;
  };
}

/** Shape of simple success responses that only carry a message (e.g. kick, leave, invite) */
export interface MessageResponse {
  message: string;
}
