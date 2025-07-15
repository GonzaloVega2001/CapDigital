import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funciones de autenticación
export const authService = {
  async register(email: string, password: string, name: string, age?: number) {
    try {
      // Verificar si el usuario ya existe
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        throw new Error('El usuario ya existe')
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 12)

      // Crear el usuario
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email,
            password: hashedPassword,
            name,
            age
          }
        ])
        .select()
        .single()

      if (error) throw error

      return { success: true, user: data }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  },

  async login(email: string, password: string) {
    try {
      // Buscar el usuario por email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error || !user) {
        throw new Error('Usuario no encontrado')
      }

      // Verificar la contraseña
      let isPasswordValid = false
      
      try {
        // Intentar verificar con bcrypt (contraseña hasheada)
        isPasswordValid = await bcrypt.compare(password, user.password)
      } catch (bcryptError) {
        // Si falla bcrypt, verificar si es una contraseña en texto plano (migración)
        if (password === user.password) {
          // Migrar la contraseña a hash
          const hashedPassword = await bcrypt.hash(password, 12)
          await supabase
            .from('users')
            .update({ password: hashedPassword, updated_at: new Date().toISOString() })
            .eq('id', user.id)
          
          isPasswordValid = true
        }
      }

      if (!isPasswordValid) {
        throw new Error('Contraseña incorrecta')
      }

      // Retornar usuario sin la contraseña
      const { password: _, ...userWithoutPassword } = user
      return { success: true, user: userWithoutPassword }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  },

  async updatePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      // Verificar contraseña actual
      const { data: user, error } = await supabase
        .from('users')
        .select('password')
        .eq('id', userId)
        .single()

      if (error || !user) {
        throw new Error('Usuario no encontrado')
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)

      if (!isCurrentPasswordValid) {
        throw new Error('Contraseña actual incorrecta')
      }

      // Hashear nueva contraseña
      const hashedNewPassword = await bcrypt.hash(newPassword, 12)

      // Actualizar contraseña
      const { error: updateError } = await supabase
        .from('users')
        .update({ password: hashedNewPassword, updated_at: new Date().toISOString() })
        .eq('id', userId)

      if (updateError) throw updateError

      return { success: true }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  }
}

// Función de prueba para verificar usuarios existentes
export async function debugUserPassword(email: string) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('email, password')
      .eq('email', email)
      .single()

    if (error || !user) {
      return { success: false, error: 'Usuario no encontrado' }
    }

    return { 
      success: true, 
      user: {
        email: user.email,
        passwordLength: user.password.length,
        passwordStartsWith: user.password.substring(0, 10),
        isHashed: user.password.startsWith('$2b$') || user.password.startsWith('$2a$')
      }
    }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

// Tipos de datos
export interface User {
  id: string
  email: string
  name: string
  password: string
  age?: number
  created_at: string
  updated_at: string
}

export interface Course {
  id: number
  title: string
  description: string
  lessons_count: number
  duration: string
  difficulty: string
  icon: string
  color: string
  order_index: number
  is_active: boolean
  created_at: string
}

export interface Lesson {
  id: number
  course_id: number
  title: string
  description: string
  content: string
  duration: string
  order_index: number
  video_url?: string
  is_active: boolean
  created_at: string
}

export interface Achievement {
  id: number
  title: string
  description: string
  points: number
  icon: string
  requirements: any
  rarity: string
  is_active: boolean
  created_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: number
  completed_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: number
  earned_at: string
}
