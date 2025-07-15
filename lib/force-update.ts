import { supabase } from "./supabase"

// Función para forzar actualización del progreso
export async function forceUpdateAllProgress(userId: string) {
  try {
    console.log("🔄 Forzando actualización del progreso...")
    
    // 1. Primero, actualizar el conteo de lecciones de todos los cursos
    const { data: courses } = await supabase
      .from("courses")
      .select("id")
    
    if (courses) {
      for (const course of courses) {
        const { data: lessons } = await supabase
          .from("lessons")
          .select("id")
          .eq("course_id", course.id)
          .eq("is_active", true)
        
        await supabase
          .from("courses")
          .update({ lessons_count: lessons?.length || 0 })
          .eq("id", course.id)
      }
    }
    
    // 2. Obtener progreso actualizado por curso
    const progressByCourse: { [key: number]: number } = {}
    
    for (let courseId = 1; courseId <= 6; courseId++) {
      // Obtener total de lecciones
      const { data: course } = await supabase
        .from("courses")
        .select("lessons_count")
        .eq("id", courseId)
        .single()
      
      if (course && course.lessons_count > 0) {
        // Obtener lecciones completadas
        const { data: completedLessons } = await supabase
          .from("user_progress")
          .select(`
            lessons!inner(course_id)
          `)
          .eq("user_id", userId)
          .eq("lessons.course_id", courseId)
        
        const completedCount = completedLessons?.length || 0
        const progress = Math.round((completedCount / course.lessons_count) * 100)
        progressByCourse[courseId] = progress
        
        console.log(`📊 Curso ${courseId}: ${completedCount}/${course.lessons_count} lecciones (${progress}%)`)
      } else {
        progressByCourse[courseId] = 0
      }
    }
    
    return progressByCourse
  } catch (error) {
    console.error("Error al actualizar progreso:", error)
    return {}
  }
}

// Función para verificar si un usuario completó específicamente una lección
export async function checkLessonCompletion(userId: string, courseId: number, lessonOrder: number) {
  try {
    const { data: lesson } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", courseId)
      .eq("order_index", lessonOrder)
      .single()
    
    if (!lesson) return false
    
    const { data: progress } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("lesson_id", lesson.id)
      .single()
    
    return !!progress
  } catch (error) {
    return false
  }
}

// Función para mostrar progreso detallado
export async function showDetailedProgress(userId: string) {
  console.log("📋 PROGRESO DETALLADO DEL USUARIO")
  console.log("================================")
  
  for (let courseId = 1; courseId <= 6; courseId++) {
    const { data: course } = await supabase
      .from("courses")
      .select("title, lessons_count")
      .eq("id", courseId)
      .single()
    
    if (course) {
      console.log(`\n📚 ${course.title}`)
      console.log(`Total lecciones: ${course.lessons_count}`)
      
      // Obtener lecciones del curso
      const { data: lessons } = await supabase
        .from("lessons")
        .select("id, title, order_index")
        .eq("course_id", courseId)
        .eq("is_active", true)
        .order("order_index")
      
      if (lessons) {
        for (const lesson of lessons) {
          const { data: progress } = await supabase
            .from("user_progress")
            .select("completed_at")
            .eq("user_id", userId)
            .eq("lesson_id", lesson.id)
            .single()
          
          const status = progress ? "✅ COMPLETADA" : "⏳ PENDIENTE"
          console.log(`  ${lesson.order_index}. ${lesson.title} - ${status}`)
        }
      }
    }
  }
}
