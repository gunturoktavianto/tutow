import { NextResponse } from "next/server";

export async function POST() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(`OPENAI_API_KEY is not set`);
    }

    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini-realtime-preview-2024-12-17",
          voice: "alloy",
          modalities: ["audio", "text"],
          instructions:
            "Kamu adalah AI tutor untuk aplikasi Tutow, aplikasi pembelajaran matematika untuk anak SD. Tugasmu adalah membantu anak-anak belajar matematika dengan cara yang menyenangkan dan mudah dipahami. Selalu gunakan bahasa Indonesia yang ramah dan sesuai untuk anak-anak. Ketika menjelaskan materi, berikan contoh yang mudah dipahami dan ajak anak untuk berinteraksi. Jika ada soal yang perlu dijelaskan, berikan petunjuk step-by-step tanpa langsung memberikan jawaban.",
          tool_choice: "auto",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching session data:", error);
    return NextResponse.json(
      { error: "Failed to fetch session data" },
      { status: 500 }
    );
  }
}
