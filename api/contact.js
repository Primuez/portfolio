import { processContactSubmission } from '../lib/contact-handler.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await processContactSubmission(data, process.env);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const result = await processContactSubmission(data, process.env);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
