/**
 * Thrown for problems caused by the user's input (bad URL, unresolvable
 * address, link too complex, etc). The message is safe to show to the
 * client as-is; anything else should be logged and replaced with a generic
 * message before it reaches the response.
 */
export class UserInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserInputError";
  }
}
