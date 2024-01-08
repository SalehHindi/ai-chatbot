import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
// import OpenAI from 'openai'
import { JSDOM } from 'jsdom';


import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { Client } from "@octoai/client";


// const openai = new OpenAI({
//   apiKey: process.env.PERPLEXITY_API_KEY
// })

const octo_client = new Client(
  process.env.PERPLEXITY_API_KEY 
)


export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = "userIdMock"
  const url = messages[messages.length-1]['content']

  console.log("URL", url)

  // console.log("XXXXXXXX", JSON.stringify(messages))

  var textContent = "ERROR"
  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    textContent = dom?.window?.document?.body?.textContent?.replace(/\s+/g, ' ').trim() ? dom?.window?.document?.body?.textContent?.replace(/\s+/g, ' ').trim() : ""

    // return new Response(textContent, {
    //   headers: {
    //     'Content-Type': 'text/plain'
    //   },
    //   status: 200
    // });
  } catch (error) {
    console.error('Error fetching URL:', error);
    // return new Response('Internal Server Error', {
    //   status: 500
    // });
  }
  
  var prompt = "Given the following page text, follow the instructions of the following tweet. Ignore any code, only pay attention to English text. Give the response as a list of sarcastic and rude bulletpoints for each criticism.\n\nTweet Instructions:\nlist out every possible criticism with the worst headline possible. Then, while preserving the core value proposition, reposition the product so it’s bulletproof against any criticism. Don’t delegate this: you own the product and you should know all possible ways it will be perceived.\n\nPage Text:\n\n"
  var finalMessages = messages
  finalMessages[messages.length-1]['content'] = prompt + textContent


  console.log("******", textContent)


  // if (!userId) {
  //   return new Response('Unauthorized', {
  //     status: 401
  //   })
  // }

  // if (true) {
  //   openai.apiKey = previewToken
  // }

  const res = await octo_client.chat.completions.create({
    model: 'mixtral-8x7b-instruct-fp16',
    messages: finalMessages,
    stream: false,
    max_tokens: 1028,
    presence_penalty: 0,
    temperature: 0,
    top_p: 1
  })

  // console.log("res:" , res.choices[0].message.content)
  
  const responseText = res.choices[0].message.content
  console.log("!!!!!! ", responseText)
  

  // const stream = OpenAIStream(res, {
  //   async onCompletion(completion) {
  //     const title = json.messages[0].content.substring(0, 100)
  //     const id = json.id ?? nanoid()
  //     const createdAt = Date.now()
  //     const path = `/chat/${id}`
  //     const payload = {
  //       id,
  //       title,
  //       userId,
  //       createdAt,
  //       path,
  //       messages: [
  //         ...messages,
  //         {
  //           content: completion,
  //           role: 'assistant'
  //         }
  //       ]
  //     }
  //     await kv.hmset(`chat:${id}`, payload)
  //     await kv.zadd(`user:chat:${userId}`, {
  //       score: createdAt,
  //       member: `chat:${id}`
  //     })
  //   }
  // })

  return new Response(responseText, {
    headers: {
      'Content-Type': 'application/json'
    },
    status: 200 // or appropriate HTTP status code
  });

  // return new StreamingTextResponse(stream)
}
