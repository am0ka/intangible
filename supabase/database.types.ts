export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      auction_bids: {
        Row: {
          auction_item_id: string | null
          bid_amount: number
          created_at: string | null
          id: string
          is_winning: boolean | null
          user_id: string | null
        }
        Insert: {
          auction_item_id?: string | null
          bid_amount: number
          created_at?: string | null
          id?: string
          is_winning?: boolean | null
          user_id?: string | null
        }
        Update: {
          auction_item_id?: string | null
          bid_amount?: number
          created_at?: string | null
          id?: string
          is_winning?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_auction_item_id_fkey"
            columns: ["auction_item_id"]
            isOneToOne: false
            referencedRelation: "auction_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_bids_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_items: {
        Row: {
          created_at: string | null
          created_by: string | null
          current_bid: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          lowest_bid: number
          name: string
          questlog_url: string
          time_left: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          current_bid?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          lowest_bid: number
          name: string
          questlog_url: string
          time_left: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          current_bid?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          lowest_bid?: number
          name?: string
          questlog_url?: string
          time_left?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_orders: {
        Row: {
          auction_item_id: string | null
          created_at: string | null
          final_price: number
          id: string
          status: string | null
          winner_id: string | null
          winning_bid_id: string | null
        }
        Insert: {
          auction_item_id?: string | null
          created_at?: string | null
          final_price: number
          id?: string
          status?: string | null
          winner_id?: string | null
          winning_bid_id?: string | null
        }
        Update: {
          auction_item_id?: string | null
          created_at?: string | null
          final_price?: number
          id?: string
          status?: string | null
          winner_id?: string | null
          winning_bid_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_orders_auction_item_id_fkey"
            columns: ["auction_item_id"]
            isOneToOne: false
            referencedRelation: "auction_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_orders_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_orders_winning_bid_id_fkey"
            columns: ["winning_bid_id"]
            isOneToOne: false
            referencedRelation: "auction_bids"
            referencedColumns: ["id"]
          },
        ]
      }
      event_types: {
        Row: {
          created_at: string | null
          dkp: number
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dkp: number
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dkp?: number
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string
          datetime: string
          description: string
          event_type_id: string
          id: string
          image: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          datetime: string
          description: string
          event_type_id: string
          id?: string
          image: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          datetime?: string
          description?: string
          event_type_id?: string
          id?: string
          image?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_event_type_id_fkey"
            columns: ["event_type_id"]
            isOneToOne: false
            referencedRelation: "event_types"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          dkp: number
          event_id: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dkp: number
          event_id: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dkp?: number
          event_id?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      participations: {
        Row: {
          attended: boolean | null
          class: string | null
          created_at: string
          event_id: string
          id: string
          member_id: string
          role: string | null
          type: string
          updated_at: string
        }
        Insert: {
          attended?: boolean | null
          class?: string | null
          created_at?: string
          event_id: string
          id?: string
          member_id: string
          role?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          attended?: boolean | null
          class?: string | null
          created_at?: string
          event_id?: string
          id?: string
          member_id?: string
          role?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "participations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          discord_id: string
          global_name: string
          id: string
          last_used_class: string | null
          last_used_role: string
          server_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          discord_id: string
          global_name: string
          id?: string
          last_used_class?: string | null
          last_used_role: string
          server_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          discord_id?: string
          global_name?: string
          id?: string
          last_used_class?: string | null
          last_used_role?: string
          server_name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
