interface Env {
  FIREBASE_SERVICE_ACCOUNT_KEY: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // In production, replace '*' with your specific frontend domain
  "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    const method = request.method;

    try {
      if (url.pathname === "/api/complete-habit" && method === "POST") {
        return await handleHabitCompletion(request, env);
      }
      
      if (url.pathname === "/api/start-adventure" && method === "POST") {
        return await handleStartAdventure(request, env);
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }
};

async function handleHabitCompletion(request: Request, env: Env) {
  const { userId, habitId, timestamp } = await request.json();
  
  // Logic: 
  // 1. Verify habit exists and isn't completed today (UTC check)
  // 2. Calculate EP and Gold rewards
  // 3. Update Firestore: increment EP, Gold, check for Evolution
  // 4. If an Adventure is active, reduce timer by 10 mins (600 seconds)
  
  return new Response(JSON.stringify({
    success: true,
    reward: { ep: 10, gold: 5 },
    adventureTimeReduction: 600
  }), { 
    headers: { 
      "Content-Type": "application/json",
      ...corsHeaders
    } 
  });
}

async function handleStartAdventure(request: Request, env: Env) {
  // Logic:
  // 1. Verify user has 35 EP today (Simulated via client payload for now)
  const { userId, dailyEp } = await request.json();
  
  if (!dailyEp || dailyEp < 35) {
     return new Response(JSON.stringify({ error: "Insufficient EP" }), { 
       status: 403,
       headers: { "Content-Type": "application/json", ...corsHeaders }
     });
  }

  // 2. Set adventure_start_utc
  // 3. Calculate seed for loot based on Pet Traits
  return new Response(JSON.stringify({ startTime: Date.now() }), { 
    status: 200, 
    headers: { "Content-Type": "application/json", ...corsHeaders } 
  });
}