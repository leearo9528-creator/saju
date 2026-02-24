const GOOGLE_SHEETS_API =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL ||
  "https://script.google.com/macros/s/AKfycbxx.../exec";

export interface SubmitPayload {
  name: string;
  birthDate: string;
  birthTime: string;
  gender: string;
  resultType: string;
  resultTitle: string;
  timestamp?: string;
}

export async function sendToGoogleSheets(payload: SubmitPayload): Promise<void> {
  const body = {
    name: payload.name,
    birthDate: payload.birthDate,
    birthTime: payload.birthTime,
    gender: payload.gender,
    resultType: payload.resultType,
    resultTitle: payload.resultTitle,
    timestamp: payload.timestamp ?? new Date().toISOString(),
  };

  const res = await fetch(GOOGLE_SHEETS_API, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok && res.type !== "opaque") {
    throw new Error(`전송 실패: ${res.status}`);
  }
}
