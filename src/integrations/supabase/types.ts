export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      fortune_cookie_history: {
        Row: {
          category: string
          fortune_date: string
          fortune_id: number
          id: string
          message: string
          opened_at: string
          user_id: string
        }
        Insert: {
          category: string
          fortune_date: string
          fortune_id: number
          id?: string
          message: string
          opened_at?: string
          user_id: string
        }
        Update: {
          category?: string
          fortune_date?: string
          fortune_id?: number
          id?: string
          message?: string
          opened_at?: string
          user_id?: string
        }
        Relationships: []
      }
      generated_messages: {
        Row: {
          created_at: string
          favorite: boolean
          id: string
          message: string
          mood_entry_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          favorite?: boolean
          id?: string
          message: string
          mood_entry_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          favorite?: boolean
          id?: string
          message?: string
          mood_entry_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_messages_mood_entry_id_fkey"
            columns: ["mood_entry_id"]
            isOneToOne: false
            referencedRelation: "mood_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_entries: {
        Row: {
          created_at: string
          detected_mood: string | null
          id: string
          mood_text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          detected_mood?: string | null
          id?: string
          mood_text: string
          user_id: string
        }
        Update: {
          created_at?: string
          detected_mood?: string | null
          id?: string
          mood_text?: string
          user_id?: string
        }
        Relationships: []
      }
      music_recommendations: {
        Row: {
          artist: string
          created_at: string
          explanation: string
          feedback: string | null
          id: string
          mood_entry_id: string | null
          mood_label: string | null
          song: string
          spotify_url: string
          user_id: string
        }
        Insert: {
          artist: string
          created_at?: string
          explanation?: string
          feedback?: string | null
          id?: string
          mood_entry_id?: string | null
          mood_label?: string | null
          song: string
          spotify_url?: string
          user_id: string
        }
        Update: {
          artist?: string
          created_at?: string
          explanation?: string
          feedback?: string | null
          id?: string
          mood_entry_id?: string | null
          mood_label?: string | null
          song?: string
          spotify_url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "music_recommendations_mood_entry_id_fkey"
            columns: ["mood_entry_id"]
            isOneToOne: false
            referencedRelation: "mood_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          onboarded: boolean
          plan: string
        }
        Insert: {
          created_at?: string
          email?: string
          id: string
          name?: string
          onboarded?: boolean
          plan?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          onboarded?: boolean
          plan?: string
        }
        Relationships: []
      }
      user_music_preferences: {
        Row: {
          discovery_level: number
          favorite_artists: string
          genres: string[]
          sad_music_preference: string
          updated_at: string
          user_id: string
        }
        Insert: {
          discovery_level?: number
          favorite_artists?: string
          genres?: string[]
          sad_music_preference?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          discovery_level?: number
          favorite_artists?: string
          genres?: string[]
          sad_music_preference?: string
          updated_at?: string
          user_id?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
