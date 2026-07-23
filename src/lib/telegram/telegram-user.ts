import type { User } from "grammy/types";

export const toTelegramFullName = (user: User) => {
  return [user.first_name, user.last_name].filter(Boolean).join(" ");
};
