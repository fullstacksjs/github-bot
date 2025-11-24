import type { ZodObject, ZodType } from "zod";
/**
 * create a command parser from a template string and zod schema
 *
 * @param template - command template string with placeholders in curly braces
 * @param schema - zod schema to validate parsed arguments
 * @returns a function that takes a message string and returns an object with parsed arguments
 *
  @example
  const parser = CommandParser("/link $ghUsername $tgUsername", z.object({
    tgUsername: z.string(),
    ghUsername: z.string(),
  }));
  const { success, data } = parser("/link ASafaeirad S_Kill");
*/
export function CommandParser<S extends Record<string, ZodType>>(template: string, schema: ZodObject<S>) {
  return (message: string) => {
    const [_, ...args] = message.split(" ").filter(Boolean);
    const argMap: Record<string, string> = {};
    const templateParts = template.split(" ").filter(Boolean);

    templateParts.forEach((part, index) => {
      if (part.startsWith("$")) {
        const key = part.slice(1);
        argMap[key] = args[index - 1];
      }
    });
    return schema.safeParse(argMap);
  };
}
