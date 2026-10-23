// Public Supabase browser configuration. The anon key is intended for browser use;
// secure access depends on Supabase Row Level Security policies in database/schema.sql.
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.status(200).json({
    supabaseUrl: process.env.SUPABASE_URL || "",
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ""
  });
}
