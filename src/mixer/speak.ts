import type { SynthesizeRequest } from "./clips";

export async function speakVoiceMix(request: SynthesizeRequest) {
  const response = await fetch("/api/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "This mix could not play. Please try again.");
  }
  return response.blob();
}
