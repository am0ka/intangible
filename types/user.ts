export interface User {
  _id: string
  discord_id: string
  global_name: string
  server_name: string
  main_role: 'tank' | 'dps' | 'heal'
  created_at: string
  updated_at: string
} 