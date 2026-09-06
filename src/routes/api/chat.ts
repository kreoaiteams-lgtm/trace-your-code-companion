import { createAPIFileRoute } from '@tanstack/react-start/api';

export const APIRoute = createAPIFileRoute('/api/chat')({
  POST: async ({ request }) => {
    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: 'SARVAM_API_KEY is not configured in the environment' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json();
      const { messages } = body;

      if (!messages || !Array.isArray(messages)) {
        return new Response(JSON.stringify({ error: 'Invalid messages payload' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Call the Sarvam API
      const sarvamResponse = await fetch('https://api.sarvam.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': apiKey,
        },
        body: JSON.stringify({
          model: 'sarvam-105b',
          messages: messages,
          temperature: 0.7,
        }),
      });

      if (!sarvamResponse.ok) {
        const errorText = await sarvamResponse.text();
        console.error("Sarvam API Error:", errorText);
        return new Response(JSON.stringify({ error: `Sarvam API returned status ${sarvamResponse.status}` }), {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = await sarvamResponse.json();
      
      // We expect data to have { choices: [{ message: { role: 'assistant', content: '...' } }] }
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error("Server error processing chat request:", error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
});
