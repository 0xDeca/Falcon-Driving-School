// Server-side Supabase compatibility layer — delegates to the NestJS API

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

class ServerTableCompat {
  private table: string;
  private filters: any[] = [];
  private query: any = {};
  private operation: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private data: any = null;

  constructor(table: string) { this.table = table; }

  select(columns: string = "*") { this.query.select = columns; return this; }
  eq(key: string, value: any) { this.filters.push({ op: "eq", key, value }); return this; }
  in(key: string, values: any[]) { this.filters.push({ op: "in", key, values }); return this; }
  gte(key: string, value: any) { this.filters.push({ op: "gte", key, value }); return this; }
  lte(key: string, value: any) { this.filters.push({ op: "lte", key, value }); return this; }
  neq(key: string, value: any) { this.filters.push({ op: "neq", key, value }); return this; }
  is(key: string, value: any) { this.filters.push({ op: "is", key, value }); return this; }
  contains(key: string, value: any) { this.filters.push({ op: "contains", key, value }); return this; }
  order(column: string, opts?: any) { this.query.orderBy = column; this.query.orderDir = opts?.ascending ? "asc" : "desc"; return this; }
  limit(n: number) { this.query.limit = n; return this; }
  single() { this.query.single = true; return this; }
  maybeSingle() { this.query.maybeSingle = true; return this; }

  insert(data: any) { this.operation = "insert"; this.data = data; return this; }
  update(data: any) { this.operation = "update"; this.data = data; return this; }
  upsert(data: any) { this.operation = "upsert"; this.data = data; return this; }
  delete() { this.operation = "delete"; return this; }

  async then(resolve: (value: any) => any) {
    try {
      if (this.operation === "select") {
        const params = new URLSearchParams();
        if (this.query.limit) params.set("limit", String(this.query.limit));
        if (this.query.orderBy) { params.set("sortBy", this.query.orderBy); params.set("sortOrder", this.query.orderDir || "desc"); }
        const res = await fetch(`${API_URL}/${this.table}?${params}`);
        const json = await res.json();
        let items = json?.data || json || [];
        for (const f of this.filters) {
          if (f.op === "eq" && Array.isArray(items)) items = items.filter((d: any) => d[f.key] === f.value);
        }
        if (this.query.single) {
          const item = items?.[0];
          return resolve(!item && !this.query.maybeSingle ? { data: null, error: { message: "Not found" } } : { data: item || null, error: null });
        }
        return resolve({ data: items, error: null, count: json?.meta?.total ?? null });
      }

      const opts: any = { headers: { "Content-Type": "application/json" } };
      if (this.operation === "insert") {
        const payload = Array.isArray(this.data) ? this.data[0] : this.data;
        opts.method = "POST"; opts.body = JSON.stringify(payload);
        const res = await fetch(`${API_URL}/${this.table}`, opts);
        return resolve({ data: await res.json(), error: null });
      }
      if (this.operation === "update") {
        const idFilter = this.filters.find(f => f.op === "eq" && f.key === "id");
        opts.method = "PUT"; opts.body = JSON.stringify(this.data);
        const url = idFilter ? `${API_URL}/${this.table}/${idFilter.value}` : `${API_URL}/${this.table}`;
        await fetch(url, opts);
        return resolve({ data: null, error: null });
      }
      if (this.operation === "delete") {
        const idFilter = this.filters.find(f => f.op === "eq" && f.key === "id");
        if (idFilter) await fetch(`${API_URL}/${this.table}/${idFilter.value}`, { method: "DELETE" });
        return resolve({ data: null, error: null });
      }
      if (this.operation === "upsert") {
        opts.method = "PUT"; opts.body = JSON.stringify(this.data);
        const res = await fetch(`${API_URL}/${this.table}`, opts);
        return resolve({ data: await res.json(), error: null });
      }
      return resolve({ data: null, error: null });
    } catch (err: any) {
      return resolve({ data: null, error: { message: err.message } });
    }
  }
}

function createClient() {
  return {
    auth: {
      getUser: async () => {
        try {
          const res = await fetch(`${API_URL}/auth/profile`);
          if (!res.ok) return { data: { user: null }, error: { message: "Unauthorized" } };
          const json = await res.json();
          return { data: { user: json.data || json }, error: null };
        } catch {
          return { data: { user: null }, error: { message: "No token" } };
        }
      },
    },
    from: (table: string) => new ServerTableCompat(table),
  };
}

export const createServerSupabase = createClient;
export const getServerSupabase = createClient;
export const getServiceSupabase = () => ({
  auth: {
    admin: {
      createUser: async (...args: any[]) => {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(args[0]),
        });
        const json = await res.json();
        return res.ok ? { data: { user: json.data || json }, error: null } : { data: null, error: { message: json.message } };
      },
      deleteUser: async (userId: string) => { await fetch(`${API_URL}/users/${userId}`, { method: "DELETE" }); return { error: null }; },
      getUserById: async (userId: string) => {
        const res = await fetch(`${API_URL}/users/${userId}`);
        const json = await res.json();
        return { data: { user: json.data || json }, error: null };
      },
    },
  },
  from: (table: string) => new ServerTableCompat(table),
});

export function createAnonClient() { return getServiceSupabase(); }
