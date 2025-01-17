import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'
import Image from 'next/image';

const exampleMessages = [
  {
    heading: 'Criticize Google',
    message: 'https://www.google.com/'
  },
  // {
  //   heading: 'Summarize an article',
  //   message: 'Summarize the following article for a 2nd grader: \n'
  // },
  // {
  //   heading: 'Draft an email',
  //   message: `Draft an email to my boss about the following: \n`
  // }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome friend
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          <Image src="nikita.png" width={1198} height={360} alt="Picture of Nikita"/>
        </p>
        <p className="leading-normal text-muted-foreground">
          Try sending a URL like https://www.google.com/
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
