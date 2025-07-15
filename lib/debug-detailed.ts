import { supabase } from "./supabase"

export async function debugUserProgressDetailed(userId: string) {
  console.log("=== DEBUG USER PROGRESS DETAILED ===")
  console.log("User ID:", userId)
  
  try {
    // 1. Verificar si el usuario existe
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()
    
    console.log("User exists:", !!user)
    
    // 2. Verificar progreso directo del usuario
    const { data: userProgress } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
    
    console.log("User progress entries:", userProgress?.length || 0)
    console.log("User progress raw:", userProgress)
    
    // 3. Verificar progreso por curso usando la función robusta
    for (let courseId = 1; courseId <= 6; courseId++) {
      console.log(`\n--- Course ${courseId} ---`)
      
      // Obtener lecciones del curso
      const { data: lessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", courseId)
        .order("order_index")
      
      console.log(`Course ${courseId} lessons in DB:`, lessons?.length || 0)
      
      // Obtener progreso del usuario para este curso
      const { data: courseProgress } = await supabase
        .from("user_progress")
        .select(`
          *,
          lessons!inner(*)
        `)
        .eq("user_id", userId)
        .eq("lessons.course_id", courseId)
      
      console.log(`Course ${courseId} completed lessons:`, courseProgress?.length || 0)
      console.log(`Course ${courseId} progress details:`, courseProgress)
      
      if (lessons && lessons.length > 0) {
        const progress = Math.round(((courseProgress?.length || 0) / lessons.length) * 100)
        console.log(`Course ${courseId} calculated progress: ${progress}%`)
      }
    }
    
    // 4. Verificar estructura de cursos
    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .order("id")
    
    console.log("\nCourses in database:")
    courses?.forEach(course => {
      console.log(`Course ${course.id}: ${course.title} (${course.lessons_count} lessons)`)
    })
    
  } catch (error) {
    console.error("Detailed debug error:", error)
  }
}

// Función para verificar y corregir datos si es necesario
export async function checkAndFixProgressData(userId: string) {
  console.log("=== CHECKING AND FIXING PROGRESS DATA ===")
  
  try {
    // 1. Verificar courses.lessons_count está correcto
    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .order("id")
    
    for (const course of courses || []) {
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id")
        .eq("course_id", course.id)
        .eq("is_active", true)
      
      const actualLessonsCount = lessons?.length || 0
      
      if (actualLessonsCount !== course.lessons_count) {
        console.log(`Course ${course.id} lessons_count mismatch: DB=${course.lessons_count}, Actual=${actualLessonsCount}`)
        
        // Actualizar el conteo
        await supabase
          .from("courses")
          .update({ lessons_count: actualLessonsCount })
          .eq("id", course.id)
        
        console.log(`Updated course ${course.id} lessons_count to ${actualLessonsCount}`)
      }
    }
    
    // 2. Verificar progreso del usuario
    await debugUserProgressDetailed(userId)
    
  } catch (error) {
    console.error("Check and fix error:", error)
  }
}
