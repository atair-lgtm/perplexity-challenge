import { OpenAIStream } from "@/utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

type Query = {
  userQuery: string;
  response: string | null;
};

export default async function handler(req: Request) {
  const { prevHistory, currentPrompt } = (await req.json()) as {
    prevHistory: Query[];
    currentPrompt: string;
  };

  const stream = await OpenAIStream({ prompt: currentPrompt, prevHistory });

  return new Response(stream);
}
