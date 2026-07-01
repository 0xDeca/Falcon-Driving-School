// Supabase compatibility layer — delegates all calls to the self-hosted NestJS API
// This file replaces the old @supabase/supabase-js client

import { api } from "./api-client";

// Compatible interface matching existing supabase.from().select() patterns
// Over time, migrate all callers to use api.* directly

class SupabaseCompat {
  from(table: string) {
    return new TableCompat(table);
  }

  get auth() {
    return {
      getUser: async () => {
        try {
          const user = await api.getProfile();
          return { data: { user }, error: null };
        } catch (err: any) {
          return { data: { user: null }, error: { message: err.message } };
        }
      },
      signUp: async ({ email, password, options }: any) => {
        try {
          const user = await api.register({
            email,
            password,
            fullName: options?.data?.full_name || "",
            phone: options?.data?.phone || "",
          });
          return { data: { user }, error: null };
        } catch (err: any) {
          return { data: { user: null }, error: { message: err.message } };
        }
      },
      signInWithPassword: async ({ email, password }: any) => {
        try {
          const user = await api.login(email, password);
          return { data: { user, session: {} }, error: null };
        } catch (err: any) {
          return { data: { user: null, session: null }, error: { message: err.message } };
        }
      },
      signOut: async () => {
        await api.logout();
        return { error: null };
      },
      getSession: async () => {
        try {
          const user = await api.getProfile();
          return { data: { session: user ? {} : null }, error: null };
        } catch {
          return { data: { session: null }, error: null };
        }
      },
      updateUser: async () => ({ data: { user: null }, error: null }),
      resetPasswordForEmail: async (email: string) => {
        await api.post("/auth/forgot-password", { email });
        return { data: {}, error: null };
      },
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      admin: {
        deleteUser: async () => ({ error: { message: "Use API route instead" } }),
        createUser: async () => ({ data: { user: null }, error: { message: "Use API route instead" } }),
      },
    };
  }

  get storage() {
    return {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => {
          try {
            const url = await api.uploadFile(file, path.split("/").slice(0, -1).join("/"));
            return { data: { path: url }, error: null };
          } catch (err: any) {
            return { data: null, error: { message: err.message } };
          }
        },
        getPublicUrl: (path: string) => ({
          data: { publicUrl: path },
        }),
      }),
    };
  }
}

class TableCompat {
  private table: string;
  private query: any = {};
  private filters: any[] = [];
  private operation: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private data: any = null;

  constructor(table: string) { this.table = table; }

  select(columns: string = "*") {
    this.query.select = columns;
    return this;
  }

  eq(key: string, value: any) { this.filters.push({ op: "eq", key, value }); return this; }
  in(key: string, values: any[]) { this.filters.push({ op: "in", key, values }); return this; }
  gte(key: string, value: any) { this.filters.push({ op: "gte", key, value }); return this; }
  lte(key: string, value: any) { this.filters.push({ op: "lte", key, value }); return this; }
  neq(key: string, value: any) { this.filters.push({ op: "neq", key, value }); return this; }
  is(key: string, value: any) { this.filters.push({ op: "is", key, value }); return this; }
  contains(key: string, value: any) { this.filters.push({ op: "contains", key, value }); return this; }

  order(column: string, { ascending }: { ascending?: boolean } = {}) {
    this.query.orderBy = column;
    this.query.orderDir = ascending ? "asc" : "desc";
    return this;
  }

  limit(count: number) { this.query.limit = count; return this; }

  single() { this.query.single = true; return this; }
  maybeSingle() { this.query.maybeSingle = true; return this; }

  insert(data: any) { this.operation = "insert"; this.data = data; return this; }
  update(data: any) { this.operation = "update"; this.data = data; return this; }
  upsert(data: any) { this.operation = "upsert"; this.data = data; return this; }
  delete() { this.operation = "delete"; return this; }

  async then(resolve: (value: any) => any) {
    try {
      if (this.operation === "select") {
        const params: any = { limit: this.query.limit || 50 };
        if (this.query.orderBy) {
          params.sortBy = this.query.orderBy;
          params.sortOrder = this.query.orderDir || "desc";
        }
        let response = await api.get(`/${this.table}`, { params });

        for (const filter of this.filters) {
          if (filter.op === "eq" && response?.data) {
            response.data = response.data.filter((d: any) => d[filter.key] === filter.value);
          }
        }

        if (this.query.single) {
          const item = response?.data?.[0] || response?.[0];
          if (!item && !this.query.maybeSingle) {
            return resolve({ data: null, error: { message: "Not found" } });
          }
          return resolve({ data: item || null, error: null });
        }

        return resolve({ data: response?.data || response || [], error: null, count: response?.meta?.total || null });
      }

      if (this.operation === "insert") {
        const payload = Array.isArray(this.data) ? this.data[0] : this.data;
        const result = await api.post(`/${this.table}`, payload);
        return resolve({ data: result?.data || result, error: null });
      }

      if (this.operation === "update") {
        const idFilter = this.filters.find(f => f.op === "eq" && f.key === "id");
        if (idFilter) {
          await api.put(`/${this.table}/${idFilter.value}`, this.data);
        } else {
          await api.put(`/${this.table}`, this.data);
        }
        return resolve({ data: null, error: null });
      }

      if (this.operation === "delete") {
        const idFilter = this.filters.find(f => f.op === "eq" && f.key === "id");
        if (idFilter) {
          await api.delete(`/${this.table}/${idFilter.value}`);
        }
        return resolve({ data: null, error: null });
      }

      if (this.operation === "upsert") {
        const result = await api.put(`/${this.table}`, this.data);
        return resolve({ data: result?.data || result, error: null });
      }

      return resolve({ data: null, error: null });
    } catch (err: any) {
      return resolve({ data: null, error: { message: err.message } });
    }
  }
}

// Singleton for backward compatibility
export const supabase = new SupabaseCompat();
