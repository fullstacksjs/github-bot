import { config } from "#config";

interface TelegramReportApi {
  sendMessage: (chatId: number, text: string, other?: { parse_mode?: "HTML" }) => Promise<unknown>;
}

export async function sendReport(api: TelegramReportApi, message: string) {
  const reportId = config.bot.reportChatId;
  if (!reportId) return;

  return api.sendMessage(reportId, message, { parse_mode: "HTML" });
}
