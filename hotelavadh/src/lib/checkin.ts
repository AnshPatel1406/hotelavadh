/**
 * Generates a random 6-character alphanumeric check-in reference code.
 * Uses uppercase letters and numbers for clarity (avoids 0/O confusion).
 */
export function generateCheckInCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
