// Generate a 4-character room code using A-HJ-NP-Z (excludes I, O to avoid confusion)
const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * ROOM_CODE_CHARS.length);
    code += ROOM_CODE_CHARS[randomIndex];
  }
  return code;
}
