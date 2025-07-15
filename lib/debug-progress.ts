// Debug temporal para verificar el progreso
import { supabase } from "./supabase"

export async function debugUserProgress(userId: string) {
  console.log("=== DEBUG USER PROGRESS ===")
  console.log("User ID:", userId)
  
  try {
    // 1. Verificar progreso del usuario
    const { data: userProgress } = await supabase
      .from("user_progress")
      .select(`
        lesson_id,
        lessons!inner(
          id,
          course_id,
          title,
          order_index
        )
      `)
      .eq("user_id", userId)
    
    console.log("User progress entries:", userProgress?.length || 0)
    console.log("User progress:", userProgress)
    
    // 2. Verificar cursos y su estructura
    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .order("id")
    
    console.log("Courses in database:", courses)
    
    // 3. Verificar lecciones por curso
    for (let courseId = 1; courseId <= 6; courseId++) {
      const { data: lessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index")
      
      console.log(`Course ${courseId} lessons:`, lessons?.length || 0)
      
      const completedInCourse = userProgress?.filter((p: any) => p.lessons.course_id === courseId) || []
      console.log(`Course ${courseId} completed lessons:`, completedInCourse.length)
      
      if (lessons && lessons.length > 0) {
        const progress = Math.round((completedInCourse.length / lessons.length) * 100)
        console.log(`Course ${courseId} progress: ${progress}%`)
      }
    }
    
  } catch (error) {
    console.error("Debug error:", error)
  }
}

// Función para verificar la estructura de la base de datos
export async function checkDatabaseStructure() {
  try {
    console.log("=== CHECKING DATABASE STRUCTURE ===")
    
    // Verificar tabla courses
    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .limit(1)
    
    console.log("Courses table structure:", courses?.[0])
    
    // Verificar tabla lessons
    const { data: lessons } = await supabase
      .from("lessons")
      .select("*")
      .limit(1)
    
    console.log("Lessons table structure:", lessons?.[0])
    
    // Verificar tabla user_progress
    const { data: progress } = await supabase
      .from("user_progress")
      .select("*")
      .limit(1)
    
    console.log("User_progress table structure:", progress?.[0])
    
  } catch (error) {
    console.error("Structure check error:", error)
  }
}
