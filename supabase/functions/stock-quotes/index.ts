import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Production-ready CORS headers
// Use wildcard in development, restrict to Vercel domain in production
const getOrigin = () => {
  const isProd = Deno.env.get("ENVIRONMENT") === "production";
  return isProd ? "https://hushh.ai" : "*";
};

const corsHeaders = {
  "Access-Control-Allow-Origin": getOrigin(),
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Credentials": "true",
};

// Stock symbols to fetch - the hushh 27 alpha bets watchlist
const STOCK_SYMBOLS = [
  "AAPL", "GOOGL", "MSFT", "NVDA", "AMZN", "META", "BRK.B", "JPM", 
  "XOM", "TSM", "TM", "WMT", "BAC", "V", "JNJ", "PG", "MA", "HD",
  "CVX", "MRK", "PFE", "ABBV", "KO", "PEP", "COST", "AVGO", "ORCL"
];

interface StockQuote {
  symbol: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

interface FinnhubQuoteResponse {
  c: number;  // Current price
  d: number;  // Change
  dp: number; // Percent change
  h: number;  // High
  l: number;  // Low
  o: number;  // Open
  pc: number; // Previous close
  t: number;  // Timestamp
}

// Fetch quote for a single stock from Finnhub
async function fetchStockQuote(symbol: string, apiKey: string): Promise<StockQuote | null> {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    
    if (!response.ok) {
      console.error(`Failed to fetch ${symbol}: ${response.status}`);
      return null;
    }
    
    const data: FinnhubQuoteResponse = await response.json();
    
    // Check if we got valid data (Finnhub returns 0 for invalid symbols)
    if (data.c === 0 && data.d === 0) {
      console.warn(`No data for symbol: ${symbol}`);
      return null;
    }
    
    return {
      symbol,
      currentPrice: data.c,
      change: data.d,
      percentChange: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      timestamp: data.t,
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

// Fetch all stock quotes in parallel with rate limiting
async function fetchAllQuotes(apiKey: string): Promise<StockQuote[]> {
  const quotes: StockQuote[] = [];
  
  // Finnhub free tier: 60 calls/minute, so we can fetch all 27 stocks
  // Batch them in groups of 10 with small delays to be safe
  const batchSize = 10;
  
  for (let i = 0; i < STOCK_SYMBOLS.length; i += batchSize) {
    const batch = STOCK_SYMBOLS.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(symbol => fetchStockQuote(symbol, apiKey))
    );
    
    // Filter out null results and add to quotes
    batchResults.forEach(quote => {
      if (quote) quotes.push(quote);
    });
    
    // Small delay between batches to respect rate limits
    if (i + batchSize < STOCK_SYMBOLS.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  return quotes;
}

serve(async (req) => {
  // Log CORS request details for debugging
  const origin = req.headers.get("origin");
  const requestId = crypto.randomUUID();
  const logContext = {
    requestId,
    method: req.method,
    origin,
    timestamp: new Date().toISOString(),
  };

  console.log("[stock-quotes] Request received:", logContext);

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    console.log("[stock-quotes] CORS preflight OK:", logContext);
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get Finnhub API key from environment (secret)
    const finnhubApiKey = Deno.env.get("FINNHUB_API_KEY");
    
    if (!finnhubApiKey) {
      console.error("[stock-quotes] FINNHUB_API_KEY not configured:", logContext);
      return new Response(
        JSON.stringify({ 
          error: "Stock API not configured",
          quotes: [],
          requestId,
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Check if specific symbols requested
    let symbolsToFetch = STOCK_SYMBOLS;
    
    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (body.symbols && Array.isArray(body.symbols)) {
          symbolsToFetch = body.symbols;
        }
      } catch (parseErr) {
        console.warn("[stock-quotes] Failed to parse POST body:", logContext, parseErr);
        // Use default symbols if body parsing fails
      }
    }

    console.log(`[stock-quotes] Fetching quotes for ${symbolsToFetch.length} symbols...`, logContext);
    
    // Fetch all quotes
    const quotes = await fetchAllQuotes(finnhubApiKey);
    
    console.log(`[stock-quotes] Successfully fetched ${quotes.length} quotes (${symbolsToFetch.length} requested)`, logContext);

    return new Response(
      JSON.stringify({
        success: true,
        quotes,
        fetchedAt: new Date().toISOString(),
        count: quotes.length,
        requestId,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[stock-quotes] Unhandled error:", logContext, errorMessage);
    
    return new Response(
      JSON.stringify({
        error: "Failed to fetch stock quotes",
        message: errorMessage,
        quotes: [],
        requestId,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
