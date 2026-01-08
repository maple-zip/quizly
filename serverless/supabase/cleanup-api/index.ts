// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

interface CleanupResponse {
  success: boolean;
  deletedFiles: string[];
  deletedCount: number;
  error?: string;
  details?: string;
}

console.info("Cleanup API Edge Function started");

Deno.serve(async (req: Request) => {
  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
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
        error: "Method not allowed. Use POST method.",
        deletedFiles: [],
        deletedCount: 0,
      } as CleanupResponse),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const bucketName = Deno.env.get("BUCKET_NAME") || "quizly";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    console.info(`Starting cleanup for bucket: ${bucketName}`);

    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // List all files in bucket
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list("", {
        limit: 1000,
        sortBy: { column: "created_at", order: "asc" },
      });

    if (listError) {
      console.error("Error listing files:", listError);
      throw new Error(`Failed to list files: ${listError.message}`);
    }

    if (!files || files.length === 0) {
      console.info("No files found in bucket");
      return new Response(
        JSON.stringify({
          success: true,
          deletedFiles: [],
          deletedCount: 0,
          details: "No files found in bucket",
        } as CleanupResponse),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.info(`Found ${files.length} files in bucket`);

    // Calculate cutoff date (7 days ago)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    console.info(`Cutoff date: ${sevenDaysAgo.toISOString()}`);

    // Filter files older than 7 days and are ZIP files
    const filesToDelete = files.filter((file) => {
      const createdAt = new Date(file.created_at);
      const isZip = file.name.toLowerCase().endsWith(".zip");
      const isOld = createdAt < sevenDaysAgo;
      
      if (isZip && isOld) {
        console.info(`File to delete: ${file.name} (created: ${createdAt.toISOString()})`);
      }
      
      return isZip && isOld;
    });

    if (filesToDelete.length === 0) {
      console.info("No files older than 7 days found");
      return new Response(
        JSON.stringify({
          success: true,
          deletedFiles: [],
          deletedCount: 0,
          details: "No files older than 7 days found",
        } as CleanupResponse),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.info(`Found ${filesToDelete.length} files to delete`);

    // Delete files
    const fileNames = filesToDelete.map((file) => file.name);
    const { data: deleteData, error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove(fileNames);

    if (deleteError) {
      console.error("Error deleting files:", deleteError);
      throw new Error(`Failed to delete files: ${deleteError.message}`);
    }

    console.info(`Successfully deleted ${fileNames.length} files`);

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        deletedFiles: fileNames,
        deletedCount: fileNames.length,
        details: `Deleted ${fileNames.length} file(s) older than 7 days`,
      } as CleanupResponse),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Cleanup error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        deletedFiles: [],
        deletedCount: 0,
      } as CleanupResponse),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
