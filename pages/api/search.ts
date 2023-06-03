import { OpenAIStream } from "@/utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const { prompt } = (await req.json()) as {
    prompt: string;
  };

  const stream = await OpenAIStream({ prompt });

  return new Response(stream);
}
