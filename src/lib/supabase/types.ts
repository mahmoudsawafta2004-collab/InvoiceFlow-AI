/**
 * Hand-written to match supabase/migrations/0001_init.sql. If you add
 * columns, run `supabase gen types typescript` for the real thing instead of
 * editing this by hand.
 *
 * `Relationships: []` on every table, and `Views`/`Functions` on the schema,
 * are required by @supabase/postgrest-js's GenericTable/GenericSchema
 * constraints even though nothing here uses them — omitting them makes every
 * `.from(...)` call silently infer `never` instead of erroring loudly.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: "user" | "admin";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          email: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      plans: {
        Row: {
          id: string;
          key: string;
          name: string;
          price_cents: number;
          currency: string;
          monthly_invoice_limit: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["plans"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["plans"]["Row"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          status: "active" | "trialing" | "past_due" | "canceled" | "incomplete";
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]> & {
          user_id: string;
          plan_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
        Relationships: [];
      };
      usage_events: {
        Row: {
          id: string;
          user_id: string;
          file_name: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["usage_events"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["usage_events"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

export type Plan = Database["public"]["Tables"]["plans"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
