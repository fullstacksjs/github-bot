import zod from "zod";

export const tgUsername = zod
  .string()
  .min(5)
  .max(32)
  .regex(/^@?\w+$/, "Telegram username can only contain alphanumeric characters and underscores")
  .transform((val) => (val.startsWith("@") ? val.slice(1) : val))
  .brand<"TelegramUsername">();

export const ghUsername = zod
  .string()
  .min(1)
  .max(39)
  .regex(/^[-0-9a-z]+$/i, "GitHub username can only contain alphanumeric characters and hyphens")
  .refine((val) => !val.startsWith("-") && !val.endsWith("-"), "GitHub username cannot start or end with a hyphen")
  .refine((val) => !val.includes("--"), "GitHub username cannot contain consecutive hyphens")
  .brand<"GitHubUsername">();

export const repoUrl = zod
  .url()
  .refine((val) => val.startsWith("https://github.com/"))
  .brand<"GitHubRepoUrl">();
