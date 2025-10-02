// Vercel Edge Function - test endpoint
export const config = {
  runtime: 'edge',
}

export default async function handler(request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  return new Response(JSON.stringify({
    success: true,
    message: 'Edge Function serverless function is working!',
    timestamp: new Date().toISOString(),
    method: request.method,
    url: request.url
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
