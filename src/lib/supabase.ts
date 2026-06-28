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

function createMockClient(): ReturnType<typeof createBrowserClient> {
  return {
    from: () => ({
      data: null,
      error: null,
      count: null,
      select: () => new Proxy({}, { get: () => () => ({ data: null, error: null, count: null }) }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      upsert: () => Promise.resolve({ data: null, error: null }),
      delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
      eq: () => new Proxy({}, { get: () => () => ({ data: null, error: null, count: null }) }),
      in: () => new Proxy({}, { get: () => () => ({ data: null, error: null, count: null }) }),
      order: () => new Proxy({}, { get: () => () => ({ data: null, error: null, count: null }) }),
      gte: () => new Proxy({}, { get: () => () => ({ data: null, error: null, count: null }) }),
      limit: () => new Proxy({}, { get: () => () => ({ data: null, error: null, count: null }) }),
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
  } as unknown as ReturnType<typeof createBrowserClient>;
}

export const supabase = typeof window !== "undefined" ? getSupabaseClient()! : createMockClient();
