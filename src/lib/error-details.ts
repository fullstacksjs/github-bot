function stringifyUnknownError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? `${error.name}: ${error.message}`;
  }

  if (typeof error === "string") return error;

  try {
    return JSON.stringify(error, null, 2) ?? String(error);
  } catch {
    return String(error);
  }
}

export function formatErrorDetails(error: unknown): string {
  if (error instanceof AggregateError && error.errors.length > 0) {
    const showLabels = error.errors.length > 1;

    return error.errors
      .map((item, index) => {
        const details = formatErrorDetails(item);
        return showLabels ? `Error ${index + 1}:\n${details}` : details;
      })
      .join("\n\n");
  }

  return stringifyUnknownError(error);
}
