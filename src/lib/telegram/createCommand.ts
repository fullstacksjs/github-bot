import type { CommandOptions } from "@grammyjs/commands";
import type { TranslateFunction } from "@grammyjs/i18n";
import type { BotContext } from "#bot";
import type { CommandContext, Middleware } from "grammy";
import type { BotCommandScope } from "grammy/types";
import type { output, ZodObject, ZodType } from "zod";

import { Command } from "@grammyjs/commands";

import { CommandParser } from "./CommandParser.ts";

type ContextWithValidator<S extends Record<string, ZodType>> = BotContext<output<ZodObject<S>>>;

interface BaseCommandArgs {
  description: string;
  options?: Partial<CommandOptions>;
  template: string;
  scopes?: BotCommandScope[];
}

type CommandWithValidator<S extends Record<string, ZodType>> = BaseCommandArgs & {
  handler: Middleware<CommandContext<ContextWithValidator<S>>>;
  schema: ZodObject<S>;
  helpMessage: ((t: TranslateFunction) => string) | string;
};

type CommandWithValidatorOnly = BaseCommandArgs & {
  handler: Middleware<CommandContext<BotContext>>;
};

type CreateCommand<S extends Record<string, ZodType>> = CommandWithValidator<S> | CommandWithValidatorOnly;

const hasValidator = <S extends Record<string, ZodType>>(args: CreateCommand<S>): args is CommandWithValidator<S> => {
  return "schema" in args;
};

export const createCommand = <S extends Record<string, ZodType>>(args: CreateCommand<S>) => {
  const { template, description, handler, options, scopes } = args;
  const name = template.split(" ")[0];

  const messageValidator = (ctx: ContextWithValidator<S>, next: () => Promise<void>) => {
    if (!ctx.message?.text) return;
    next();
  };

  const validator = (ctx: ContextWithValidator<S>, next: () => Promise<void>) => {
    if (!hasValidator(args)) return next();

    const parse = CommandParser<S>(template, args.schema);
    const command = parse(ctx.message.text);

    if (!command.success) {
      const message = typeof args.helpMessage === "function" ? args.helpMessage(ctx.t) : args.helpMessage;
      return ctx.html.reply(message ?? `Invalid command usage. Correct format: /${template}`);
    }

    ctx.args = command.data;
    next();
  };

  const middleware = [
    messageValidator,
    validator,
    async (ctx, next) => {
      // @ts-expect-error It's safe
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      return handler(ctx, next).catch(ctx.report);
    },
  ] satisfies Middleware<CommandContext<ContextWithValidator<S>>>[];

  const command = new Command<ContextWithValidator<S>>(name, description, middleware, options);
  scopes?.forEach((scope) => {
    // @ts-expect-error It's safe
    command.addToScope(scope, middleware);
  });

  return command;
};
