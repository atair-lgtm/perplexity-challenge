import { OpenAIStream } from "@/utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

type Query = {
  userQuery: string;
  response: string | null;
};

export default async function handler(req: Request) {
  const { prevHistory, prompt } = (await req.json()) as {
    prevHistory: Query[];
    prompt: string;
  };

  const stream = await OpenAIStream({ prompt, prevHistory });

  return new Response(stream);
}
