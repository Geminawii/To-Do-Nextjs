import { NextRequest, NextResponse } from "next/server";
import Fuse from "fuse.js";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export async function POST(req: NextRequest) {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key is not configured." },
      { status: 500 }
    );
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const faqAnswers: Record<string, string> = {
      "what is justdoeet": `
This is dedicated to helping you plan and categorise yout daily tasks. Click on the plus sign to begin :D
`,

      "how do i add a new category": `
To add a new category:

1. Go to the "Categories" page in the sidebar.

2. Click the "Add Category" plus button.

3. Enter a category name and save.
`,

      "how do i add a todo": `
To add a new to-do:

1. Go to the home or tasks page.

2. Click the "+" button at the top of the to-dos.

3. Enter the title, description, and due date.

4. Click "Save".
`,

      "how do i delete a todo": `
To delete a to-do:

1. Find the task you want to delete.

2. Click the trash icon or "Delete" button.

3. Confirm deletion when prompted.
`,

      "how do i edit a todo": `
To edit a to-do:

1. Click on the task you want to edit.

2. Modify the title, description, due date, or category.

3. Click "Save" to apply changes.
`,

      "how do i logout": `
To log out:

Use the 'Logout' link in the sidebar menu.
`,

      "thank you": `
You're welcome! :)
`,
    };

    const latestMessageRaw = messages[messages.length - 1]?.content || "";
    const normalizedMessage = latestMessageRaw
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();

    for (const [faqKey, answer] of Object.entries(faqAnswers)) {
      if (normalizedMessage.includes(faqKey)) {
        return NextResponse.json({ reply: answer });
      }
    }

    const fuse = new Fuse(Object.keys(faqAnswers), {
      threshold: 0.4,
    });

    const result = fuse.search(normalizedMessage);
    if (
      result.length > 0 &&
      result[0].score !== undefined &&
      result[0].score <= 0.4
    ) {
      const bestMatchKey = result[0].item;
      const answer = faqAnswers[bestMatchKey];
      return NextResponse.json({ reply: answer });
    }

    const contents = (messages as ChatMessage[]).map((msg) => ({
      role: msg.role === "bot" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const systemInstruction = {
      role: "user",
      parts: [{ text: "You are a helpful assistant in a to-do app." }],
    };

    const payload = {
      contents: [systemInstruction, ...contents],
    };

    const geminiResp = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!geminiResp.ok) {
      const errorText = await geminiResp.text();
      console.error("Gemini API error:", errorText);
      return NextResponse.json(
        { error: "Gemini API call failed", details: errorText },
        { status: geminiResp.status }
      );
    }

    const data = await geminiResp.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.error("Gemini response is missing reply content:", data);
      return NextResponse.json(
        { error: "Gemini response is missing reply content" },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
