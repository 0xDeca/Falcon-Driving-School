import { createBrowserClient } from "@supabase/ssr";

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

function getSupabaseClient() {
  if (supabaseInstance) return supabaseInstance;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables");
    return createMockClient();
  }
  supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

function createMockClient() {
  return {
    from: () => ({
      select: () => ({ data: null, error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      upsert: () => Promise.resolve({ data: null, error: null }),
      delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      eq: () => ({ data: null, error: null, single: async () => ({ data: null, error: null }), order: () => ({ data: null, error: null }), gte: () => ({ data: null, error: null }), limit: () => ({ data: null, error: null }) }),
      order: () => ({ data: null, error: null }),
      gte: () => ({ data: null, error: null }),
      limit: () => ({ data: null, error: null }),
      single: async () => ({ data: null, error: null }),
      maybeSingle: async () => ({ data: null, error: null }),
    }),
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      signOut: async () => ({ error: null }),
      signUp: async () => ({ data: { user: null, session: null }, error: null }),
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
      signInWithOtp: async () => ({ data: { user: null }, error: null }),
      resetPasswordForEmail: async () => ({ data: {}, error: null }),
      updateUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  };
}

export const supabase: ReturnType<typeof createBrowserClient> = typeof window !== "undefined" ? getSupabaseClient()! : (createMockClient() as any);
