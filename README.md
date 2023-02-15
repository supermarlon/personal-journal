# [journal.supermarlon.de](https://journal.supermarlon.de/)

This website helps you create a journal entry about your week in just a few seconds. You first upload your week from your calendar in the form of an .ics file and the website will parse it. Then, you select how you felt that week and click the 'Generate your journal entry' button to create a journal entry. This website is powered by OpenAI and Vercel Edge Functions which work together to quickly generate a journal entry.

## How it works

This project uses the [OpenAI GPT-3 API](https://openai.com/api/) (specifically, text-davinci-003) and [Vercel Edge functions](https://vercel.com/features/edge-functions) with streaming. It constructs a prompt based on the form and user input, sends it to the GPT-3 API via a Vercel Edge function, then streams the response back to the application.


## One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):
