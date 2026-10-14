// Tipos do banco de dados do Supabase — ARQUIVO GERADO AUTOMATICAMENTE.
//
// Não edite à mão: sempre que a estrutura do banco mudar (nova migration),
// regenere este arquivo com:
//
//   npx supabase gen types typescript --project-id yuonmgkzbzvytxdvhytr > types/database.ts
//
// (e recoloque este cabeçalho). Os clientes em lib/supabase usam estes tipos
// para dar autocompletar e checagem de tipos em todas as consultas.
//
// Atalhos úteis exportados no fim do arquivo:
//   Tables<"perguntas">        → tipo de uma linha lida da tabela
//   TablesInsert<"respostas">  → tipo dos dados para inserir na tabela

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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      alternativas: {
        Row: {
          correta: boolean
          id: string
          ordem: number
          pergunta_id: string
          texto: string
        }
        Insert: {
          correta?: boolean
          id?: string
          ordem?: number
          pergunta_id: string
          texto: string
        }
        Update: {
          correta?: boolean
          id?: string
          ordem?: number
          pergunta_id?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "alternativas_pergunta_id_fkey"
            columns: ["pergunta_id"]
            isOneToOne: false
            referencedRelation: "perguntas"
            referencedColumns: ["id"]
          },
        ]
      }
      categorias: {
        Row: {
          id: string
          nome: string
        }
        Insert: {
          id?: string
          nome: string
        }
        Update: {
          id?: string
          nome?: string
        }
        Relationships: []
      }
      partidas: {
        Row: {
          acertos: number
          criado_em: string
          id: string
          pontuacao: number
          usuario_id: string
        }
        Insert: {
          acertos?: number
          criado_em?: string
          id?: string
          pontuacao?: number
          usuario_id: string
        }
        Update: {
          acertos?: number
          criado_em?: string
          id?: string
          pontuacao?: number
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partidas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      perguntas: {
        Row: {
          categoria_id: string
          enunciado: string
          feedback: string | null
          id: string
          pontos: number
        }
        Insert: {
          categoria_id: string
          enunciado: string
          feedback?: string | null
          id?: string
          pontos?: number
        }
        Update: {
          categoria_id?: string
          enunciado?: string
          feedback?: string | null
          id?: string
          pontos?: number
        }
        Relationships: [
          {
            foreignKeyName: "perguntas_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      respostas: {
        Row: {
          alternativa_id: string
          correta: boolean
          id: string
          partida_id: string
          pergunta_id: string
        }
        Insert: {
          alternativa_id: string
          correta: boolean
          id?: string
          partida_id: string
          pergunta_id: string
        }
        Update: {
          alternativa_id?: string
          correta?: boolean
          id?: string
          partida_id?: string
          pergunta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "respostas_alternativa_id_fkey"
            columns: ["alternativa_id"]
            isOneToOne: false
            referencedRelation: "alternativas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respostas_alternativa_id_pergunta_id_fkey"
            columns: ["alternativa_id", "pergunta_id"]
            isOneToOne: false
            referencedRelation: "alternativas"
            referencedColumns: ["id", "pergunta_id"]
          },
          {
            foreignKeyName: "respostas_partida_id_fkey"
            columns: ["partida_id"]
            isOneToOne: false
            referencedRelation: "partidas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respostas_pergunta_id_fkey"
            columns: ["pergunta_id"]
            isOneToOne: false
            referencedRelation: "perguntas"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          criado_em: string
          id: string
          nome: string
          turma: string | null
        }
        Insert: {
          criado_em?: string
          id?: string
          nome: string
          turma?: string | null
        }
        Update: {
          criado_em?: string
          id?: string
          nome?: string
          turma?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ranking: {
        Args: { p_limite?: number; p_partida_id?: string }
        Returns: {
          acertos: number
          criado_em: string
          nome: string
          partida_id: string
          pontuacao: number
          posicao: number
          turma: string
        }[]
      }
      responder: {
        Args: { p_alternativa_id: string; p_pergunta_id: string }
        Returns: {
          acertou: boolean
          alternativa_correta_id: string
          feedback: string
          pontos: number
        }[]
      }
      registrar_partida: {
        Args: { p_respostas: Json; p_usuario_id: string }
        Returns: {
          acertos: number
          partida_id: string
          pontuacao: number
        }[]
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
