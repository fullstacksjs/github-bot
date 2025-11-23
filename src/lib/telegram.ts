export function cleanTelegramUsername(username: string): string {
  return username.startsWith("@") ? username.slice(1) : username;
}

export function isTelegramId(arg: number | string): boolean {
  const num = Number(arg);
  return /^\d+$/.test(String(arg)) && num > 0 && num <= 2147483647;
}
