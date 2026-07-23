/* eslint-disable no-console */
import { bot } from "#bot";

import { formatErrorDetails } from "../../error-details.ts";
import { escapeHtml } from "../../escape-html.ts";
import { sendReport } from "../../telegram/report.ts";

const reportedWebhookError = Symbol("reportedWebhookError");

interface WebhookReportContext {
  eventId?: string;
  eventName?: string;
  source?: string;
}

function isObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === "object" && value !== null;
}

function markWebhookErrorReported(error: unknown) {
  if (!isObject(error)) return;

  error[reportedWebhookError] = true;
}

function hasReportedWebhookError(error: unknown) {
  return isObject(error) && error[reportedWebhookError] === true;
}

function getEventName(event: unknown) {
  if (!isObject(event)) return undefined;

  const name = typeof event.name === "string" ? event.name : undefined;
  const payload = isObject(event.payload) ? event.payload : undefined;
  const action = typeof payload?.action === "string" ? payload.action : undefined;

  if (!name) return undefined;
  if (!action || name.includes(".")) return name;

  return `${name}.${action}`;
}

function getEventInfo(error: unknown): WebhookReportContext {
  if (!isObject(error) || !isObject(error.event)) return {};

  return {
    eventId: typeof error.event.id === "string" ? error.event.id : undefined,
    eventName: getEventName(error.event),
  };
}

export function buildWebhookErrorReport(error: unknown, context: WebhookReportContext = {}) {
  const event = getEventInfo(error);
  const eventName = context.eventName ?? event.eventName;
  const eventId = context.eventId ?? event.eventId;
  const lines = ["<b>GitHub Webhook Error:</b>"];

  if (eventName) lines.push(`Event: <code>${escapeHtml(eventName)}</code>`);
  if (eventId) lines.push(`Delivery: <code>${escapeHtml(eventId)}</code>`);
  if (context.source) lines.push(`Source: <code>${escapeHtml(context.source)}</code>`);

  lines.push("", "<b>Message:</b>", "", `<pre>${escapeHtml(formatErrorDetails(error))}</pre>`, "", "#webhook #error");

  return lines.join("\n");
}

export async function reportWebhookError(error: unknown, context: WebhookReportContext = {}) {
  if (hasReportedWebhookError(error)) return;

  markWebhookErrorReported(error);
  console.error(error);

  return sendReport(bot.api, buildWebhookErrorReport(error, context));
}
