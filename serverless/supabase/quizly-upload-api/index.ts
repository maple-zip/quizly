// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// Types
interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

interface SuccessResponse {
  success: true;
  fileId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  publicUrl: string;
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}

console.info("Upload ZIP Edge Function started");

// Verify Turnstile token
async function verifyTurnstile(
  token: string,
  secretKey: string,
  ip?: string
): Promise<TurnstileResponse> {
  const formData = new FormData();
  formData.append("secret", secretKey);
  formData.append("response", token);
  if (ip) {
    formData.append("remoteip", ip);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    }
  );

  return await response.json();
}

Deno.serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://maple-zip.github.io",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
  };

  // Handle OPTIONS request (preflight)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Only accept POST
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Method not allowed",
      } as ErrorResponse),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Get environment variables (sử dụng tên chuẩn của Supabase)
    const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const bucketName = Deno.env.get("BUCKET_NAME") || "quizly"; // Default bucket name

    if (!turnstileSecret) {
      throw new Error("Missing TURNSTILE_SECRET_KEY environment variable");
    }
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const turnstileToken = formData.get("turnstileToken") as string;

    // Validate inputs
    if (!file) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No file provided",
        } as ErrorResponse),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!turnstileToken) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No Turnstile token provided",
        } as ErrorResponse),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".zip") && file.type !== "application/zip" && file.type !== "application/x-zip-compressed") {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid file type. Only ZIP files are allowed",
        } as ErrorResponse),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get client IP for Turnstile verification
    const clientIp = req.headers.get("cf-connecting-ip") || 
                     req.headers.get("x-forwarded-for")?.split(",")[0] ||
                     req.headers.get("x-real-ip");

    // Verify Turnstile
    console.info("Verifying Turnstile token...");
    const turnstileResult = await verifyTurnstile(
      turnstileToken,
      turnstileSecret,
      clientIp || undefined
    );

    if (!turnstileResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Turnstile verification failed",
          details: turnstileResult["error-codes"]?.join(", "),
        } as ErrorResponse),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.info("Turnstile verification successful");

    // Generate UUID for file name
    const fileId = crypto.randomUUID();
    const fileName = `${fileId}.zip`;

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Convert file to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    const fileSize = fileBuffer.byteLength;

    console.info(`Uploading file: ${fileName}, size: ${fileSize} bytes`);

    // Upload to Supabase Storage (root of bucket)
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: "application/zip",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);

    console.info("Upload successful:", fileName);

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        fileId,
        fileName,
        filePath: data.path,
        fileSize,
        publicUrl: publicUrlData.publicUrl,
      } as SuccessResponse),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      } as ErrorResponse),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
