import { supabase, authService } from "./supabase"

// Importar funciones de configuración de base de datos
import { linkLessonsAndCourses, createMissingLessons, repairBrokenLinks, setupDatabaseLinks } from "./database-setup"

// Exportar funciones de configuración
export { linkLessonsAndCourses, createMissingLessons, repairBrokenLinks, setupDatabaseLinks }

// Funciones de autenticación
export async function signUp(email: string, password: string, name: string, age?: number) {
  try {
    // Usar el servicio de autenticación con contraseña
    const result = await authService.register(email, password, name, age)
    
    if (!result.success) {
      throw new Error(result.error)
    }

    // Otorgar logro de bienvenida
    await grantAchievement(result.user.id, 1)

    return { user: result.user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

export async function signIn(email: string, password: string) {
  try {
    // Usar el servicio de autenticación con contraseña
    const result = await authService.login(email, password)
    
    if (!result.success) {
      throw new Error(result.error)
    }

    return { user: result.user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

// Funciones de cursos
export async function getCourses() {
  try {
    const { data: courses, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_active", true)
      .order("order_index")

    if (error) throw error
    return { courses, error: null }
  } catch (error) {
    return { courses: [], error }
  }
}

export async function getLessonsByCourse(courseId: number) {
  try {
    const { data: lessons, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .eq("is_active", true)
      .order("order_index")

    if (error) throw error
    return { lessons, error: null }
  } catch (error) {
    return { lessons: [], error }
  }
}

// Funciones de progreso
export async function getUserProgress(userId: string) {
  try {
    const { data: progress, error } = await supabase
      .from("user_progress")
      .select(`
        *,
        lessons (
          id,
          course_id,
          title
        )
      `)
      .eq("user_id", userId)

    if (error) throw error
    return { progress, error: null }
  } catch (error) {
    return { progress: [], error }
  }
}

export async function completeLesson(userId: string, lessonId: number) {
  try {
    // Marcar lección como completada
    const { data: progress, error: progressError } = await supabase
      .from("user_progress")
      .upsert([{ user_id: userId, lesson_id: lessonId }])
      .select()

    if (progressError) throw progressError

    // Verificar y otorgar logros
    await checkAndGrantAchievements(userId)

    return { progress, error: null }
  } catch (error) {
    return { progress: null, error }
  }
}

// Nueva función para completar lección usando courseId y localLessonId
export async function completeLessonByCourse(userId: string, courseId: number, localLessonId: number) {
  try {
    // Obtener el ID real de la lección
    const realLessonId = await getRealLessonId(courseId, localLessonId)
    
    if (!realLessonId) {
      throw new Error(`Lesson not found: course ${courseId}, lesson ${localLessonId}`)
    }

    console.log(`Completing lesson: courseId=${courseId}, localId=${localLessonId}, realId=${realLessonId}`)

    // Primero verificar si ya está completada
    const { data: existing } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("lesson_id", realLessonId)
      .single()
    
    if (existing) {
      console.log(`✓ Lesson ${realLessonId} already completed, skipping`)
      return { progress: existing, error: null, alreadyCompleted: true }
    }

    // Marcar lección como completada solo si no existe
    const { data: progress, error: progressError } = await supabase
      .from("user_progress")
      .insert({
        user_id: userId,
        lesson_id: realLessonId,
        completed_at: new Date().toISOString()
      })
      .select()

    if (progressError) {
      // Si aún hay error de duplicado, significa que se completó entre las verificaciones
      if (progressError.code === "23505") {
        console.log(`Lesson ${realLessonId} was completed concurrently, that's OK`)
        return { progress: null, error: null, alreadyCompleted: true }
      }
      throw progressError
    }

    // Verificar y otorgar logros
    await checkAndGrantAchievements(userId)

    console.log(`✓ Lesson ${realLessonId} completed successfully`)
    return { progress, error: null }
  } catch (error) {
    console.error("Error completing lesson by course:", error)
    return { progress: null, error }
  }
}

// Funciones de logros
export async function getUserAchievements(userId: string) {
  try {
    const { data: achievements, error } = await supabase
      .from("user_achievements")
      .select(`
        *,
        achievements (
          id,
          title,
          description,
          points,
          icon,
          rarity
        )
      `)
      .eq("user_id", userId)

    if (error) throw error
    return { achievements, error: null }
  } catch (error) {
    return { achievements: [], error }
  }
}

export async function grantAchievement(userId: string, achievementId: number) {
  try {
    // Verificar si el usuario ya tiene este logro
    const { data: existingAchievement } = await supabase
      .from("user_achievements")
      .select("id")
      .eq("user_id", userId)
      .eq("achievement_id", achievementId)
      .single()

    if (existingAchievement) {
      // El usuario ya tiene este logro, no hacer nada
      return { achievement: existingAchievement, error: null }
    }

    // Otorgar el logro por primera vez
    const { data: achievement, error } = await supabase
      .from("user_achievements")
      .insert([{ 
        user_id: userId, 
        achievement_id: achievementId,
        earned_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return { achievement, error: null }
  } catch (error) {
    return { achievement: null, error }
  }
}

// Verificar y otorgar logros automáticamente
export async function checkAndGrantAchievements(userId: string) {
  try {
    // Obtener progreso del usuario
    const { data: userProgress } = await supabase.from("user_progress").select("*").eq("user_id", userId)

    if (!userProgress) return

    const completedLessons = userProgress.length

    // Logro: Primera lección (ID: 2)
    if (completedLessons >= 1) {
      await grantAchievement(userId, 2)
    }

    // Logro: Estudiante dedicado (ID: 4)
    if (completedLessons >= 5) {
      await grantAchievement(userId, 4)
    }

    // Verificar cursos completados
    const { data: courses } = await supabase.from("courses").select("id, lessons_count")

    if (courses) {
      for (const course of courses) {
        const { data: courseProgress } = await supabase
          .from("user_progress")
          .select("lessons!inner(course_id)")
          .eq("user_id", userId)
          .eq("lessons.course_id", course.id)

        if (courseProgress && courseProgress.length === course.lessons_count) {
          // Curso completado
          if (course.id === 1) await grantAchievement(userId, 5) // Experto en Celular
          if (course.id === 2) await grantAchievement(userId, 6) // Navegador Web
        }
      }
    }
  } catch (error) {
    console.error("Error checking achievements:", error)
  }
}

// Obtener estadísticas del usuario
export async function getUserStats(userId: string) {
  try {
    // Lecciones completadas
    const { data: completedLessons } = await supabase.from("user_progress").select("id").eq("user_id", userId)

    // Logros obtenidos
    const { data: achievements } = await supabase
      .from("user_achievements")
      .select(`
        achievements (points)
      `)
      .eq("user_id", userId)

    // Calcular puntos totales
    const totalPoints =
      achievements?.reduce((sum, item) => {
        const achievementData = item.achievements as any
        return sum + (achievementData?.points || 0)
      }, 0) || 0

    // Progreso por curso
    const { data: courseProgress } = await supabase
      .from("user_progress")
      .select(`
        lessons (
          course_id,
          courses (
            id,
            title,
            lessons_count
          )
        )
      `)
      .eq("user_id", userId)

    const progressByCourse: { [key: number]: number } = {}

    if (courseProgress) {
      // Agrupar por curso
      const courseGroups: { [key: number]: number } = {}
      courseProgress.forEach((item) => {
        const lessonData = item.lessons as any
        const courseId = lessonData?.course_id
        if (courseId) {
          courseGroups[courseId] = (courseGroups[courseId] || 0) + 1
        }
      })

      // Calcular porcentaje por curso
      Object.entries(courseGroups).forEach(([courseId, completedCount]) => {
        const courseItem = courseProgress.find((item) => {
          const lessonData = item.lessons as any
          return lessonData?.course_id === Number.parseInt(courseId)
        })
        
        const lessonData = courseItem?.lessons as any
        const course = lessonData?.courses

        if (course) {
          progressByCourse[Number.parseInt(courseId)] = Math.round((completedCount / course.lessons_count) * 100)
        }
      })
    }

    return {
      completedLessons: completedLessons?.length || 0,
      totalAchievements: achievements?.length || 0,
      totalPoints,
      courseProgress: progressByCourse,
      error: null,
    }
  } catch (error) {
    return {
      completedLessons: 0,
      totalAchievements: 0,
      totalPoints: 0,
      courseProgress: {},
      error,
    }
  }
}

// Función para obtener logros recientes del usuario
export async function getRecentUserAchievements(userId: string, limit: number = 3) {
  try {
    const { data: achievements, error } = await supabase
      .from("user_achievements")
      .select(`
        earned_at,
        achievements (
          id,
          title,
          description,
          points,
          icon,
          rarity
        )
      `)
      .eq("user_id", userId)
      .order("earned_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return { achievements, error: null }
  } catch (error) {
    return { achievements: [], error }
  }
}

// Función para obtener todos los logros con el estado del usuario
export async function getAllAchievementsWithUserStatus(userId: string) {
  try {
    // Obtener todos los logros disponibles
    const { data: allAchievements, error: achievementsError } = await supabase
      .from("achievements")
      .select("*")
      .eq("is_active", true)
      .order("id")

    if (achievementsError) throw achievementsError

    // Obtener los logros del usuario
    const { data: userAchievements, error: userAchievementsError } = await supabase
      .from("user_achievements")
      .select("achievement_id, earned_at")
      .eq("user_id", userId)

    if (userAchievementsError) throw userAchievementsError

    // Crear un map de logros del usuario para búsqueda rápida
    const userAchievementMap = new Map()
    userAchievements?.forEach(ua => {
      userAchievementMap.set(ua.achievement_id, ua.earned_at)
    })

    // Combinar los datos
    const achievementsWithStatus = allAchievements?.map(achievement => ({
      ...achievement,
      earned: userAchievementMap.has(achievement.id),
      earnedDate: userAchievementMap.get(achievement.id) || null
    })) || []

    return { achievements: achievementsWithStatus, error: null }
  } catch (error) {
    return { achievements: [], error }
  }
}

// Función más simple para obtener progreso por curso
export async function getCourseProgress(userId: string, courseId: number) {
  try {
    console.log(`Getting progress for user ${userId}, course ${courseId}`)
    
    // Obtener total de lecciones del curso
    const { data: course } = await supabase
      .from("courses")
      .select("lessons_count")
      .eq("id", courseId)
      .single()

    console.log(`Course ${courseId} has ${course?.lessons_count} lessons`)

    if (!course) return { progress: 0, error: "Course not found" }

    // Obtener lecciones completadas del curso
    const { data: completedLessons, error } = await supabase
      .from("user_progress")
      .select(`
        lessons!inner(course_id)
      `)
      .eq("user_id", userId)
      .eq("lessons.course_id", courseId)

    console.log(`Course ${courseId} completed lessons:`, completedLessons)
    console.log(`Query error:`, error)

    const completedCount = completedLessons?.length || 0
    const progress = Math.round((completedCount / course.lessons_count) * 100)

    console.log(`Course ${courseId} progress: ${completedCount}/${course.lessons_count} = ${progress}%`)

    return { progress, error: null }
  } catch (error) {
    console.error(`Error getting course progress for course ${courseId}:`, error)
    return { progress: 0, error }
  }
}

// Función para obtener el ID real de la lección en la base de datos
export async function getRealLessonId(courseId: number, localLessonId: number) {
  try {
    const { data: lesson } = await supabase
      .from("lessons")
      .select("id")
      .eq("course_id", courseId)
      .eq("order_index", localLessonId)
      .single()

    return lesson?.id || null
  } catch (error) {
    console.error("Error getting real lesson ID:", error)
    return null
  }
}

// Función para verificar el progreso actual y migrar si es necesario
export async function debugUserProgress(userId: string) {
  try {
    console.log("=== DEBUG USER PROGRESS ===")
    
    // Verificar todas las lecciones completadas
    const { data: allProgress } = await supabase
      .from("user_progress")
      .select(`
        lesson_id,
        lessons (
          id,
          course_id,
          title,
          order_index
        )
      `)
      .eq("user_id", userId)
    
    console.log("All completed lessons:", allProgress)
    
    // Verificar progreso por curso
    for (let courseId = 1; courseId <= 6; courseId++) {
      const { progress } = await getCourseProgress(userId, courseId)
      console.log(`Course ${courseId} progress: ${progress}%`)
    }
    
    // Verificar lecciones del curso 2 específicamente
    const { data: course2Lessons } = await supabase
      .from("lessons")
      .select("id, title, order_index")
      .eq("course_id", 2)
      .order("order_index")
    
    console.log("Course 2 lessons in DB:", course2Lessons)
    
    const { data: course2Progress } = await supabase
      .from("user_progress")
      .select(`
        lesson_id,
        lessons!inner (
          id,
          course_id,
          title,
          order_index
        )
      `)
      .eq("user_id", userId)
      .eq("lessons.course_id", 2)
    
    console.log("Course 2 completed lessons:", course2Progress)
    
    console.log("=== END DEBUG ===")
    
    return { allProgress, course2Lessons, course2Progress }
  } catch (error) {
    console.error("Error debugging user progress:", error)
    return null
  }
}

// Función para migrar progreso del sistema anterior
export async function migrateUserProgress(userId: string) {
  try {
    console.log("=== MIGRATING USER PROGRESS ===")
    
    // Obtener todas las lecciones completadas actualmente
    const { data: currentProgress } = await supabase
      .from("user_progress")
      .select(`
        lesson_id,
        lessons (
          id,
          course_id,
          title,
          order_index
        )
      `)
      .eq("user_id", userId)
    
    if (!currentProgress) {
      console.log("No progress found to migrate")
      return
    }
    
    console.log("Current progress:", currentProgress)
    
    // Separar lecciones por curso
    const lessonsByCourse = currentProgress.reduce((acc: any, progress: any) => {
      const courseId = progress.lessons.course_id
      if (!acc[courseId]) acc[courseId] = []
      acc[courseId].push(progress)
      return acc
    }, {})
    
    console.log("Lessons by course:", lessonsByCourse)
    
    // Para cada curso, verificar si hay lecciones con IDs incorrectos
    for (const courseId in lessonsByCourse) {
      const courseProgress = lessonsByCourse[courseId]
      console.log(`\nChecking course ${courseId}:`)
      
      // Obtener el rango correcto de IDs para este curso
      const { data: courseLessons } = await supabase
        .from("lessons")
        .select("id, order_index")
        .eq("course_id", courseId)
        .order("order_index")
      
      if (!courseLessons) continue
      
      console.log(`Course ${courseId} should have lesson IDs:`, courseLessons.map(l => l.id))
      console.log(`Course ${courseId} currently has:`, courseProgress.map((p: any) => p.lesson_id))
      
      // Verificar si hay IDs fuera del rango esperado
      const minExpectedId = Math.min(...courseLessons.map(l => l.id))
      const maxExpectedId = Math.max(...courseLessons.map(l => l.id))
      
      const problemLessons = courseProgress.filter((p: any) => 
        p.lesson_id < minExpectedId || p.lesson_id > maxExpectedId
      )
      
      if (problemLessons.length > 0) {
        console.log(`Found ${problemLessons.length} lessons with incorrect IDs in course ${courseId}`)
        
        // Eliminar entradas incorrectas
        for (const problemLesson of problemLessons) {
          await supabase
            .from("user_progress")
            .delete()
            .eq("user_id", userId)
            .eq("lesson_id", problemLesson.lesson_id)
          
          console.log(`Deleted incorrect lesson ${problemLesson.lesson_id}`)
        }
      }
    }
    
    console.log("=== MIGRATION COMPLETE ===")
    
  } catch (error) {
    console.error("Error migrating user progress:", error)
  }
}

// Función específica para diagnosticar el curso 2
export async function diagnoseCourse2(userId: string) {
  try {
    console.log("=== DIAGNÓSTICO ESPECÍFICO CURSO 2 ===")
    
    // 1. Verificar todas las lecciones del curso 2 en la base de datos
    const { data: allCourse2Lessons } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", 2)
      .order("order_index")
    
    console.log("Todas las lecciones del curso 2 en DB:", allCourse2Lessons)
    
    // 2. Verificar qué lecciones del curso 2 ha completado el usuario
    const { data: userCourse2Progress } = await supabase
      .from("user_progress")
      .select(`
        lesson_id,
        completed_at,
        lessons (
          id,
          title,
          course_id,
          order_index
        )
      `)
      .eq("user_id", userId)
      .eq("lessons.course_id", 2)
    
    console.log("Lecciones completadas del curso 2:", userCourse2Progress)
    
    // 3. Verificar TODAS las lecciones completadas por el usuario (cualquier curso)
    const { data: allUserProgress } = await supabase
      .from("user_progress")
      .select(`
        lesson_id,
        completed_at,
        lessons (
          id,
          title,
          course_id,
          order_index
        )
      `)
      .eq("user_id", userId)
      .order("lesson_id")
    
    console.log("TODAS las lecciones completadas por el usuario:", allUserProgress)
    
    // 4. Buscar lecciones "huérfanas" que podrían ser del curso 2
    const course2LessonIds = allCourse2Lessons?.map(l => l.id) || []
    const orphanLessons = allUserProgress?.filter(p => 
      !course2LessonIds.includes(p.lesson_id) && 
      p.lesson_id >= 1 && p.lesson_id <= 20 // Buscar en un rango razonable
    )
    
    console.log("Lecciones huérfanas (posiblemente del curso 2):", orphanLessons)
    
    // 5. Análisis de patrones
    console.log("\n=== ANÁLISIS ===")
    console.log(`Curso 2 tiene ${allCourse2Lessons?.length || 0} lecciones en total`)
    console.log(`Usuario completó ${userCourse2Progress?.length || 0} lecciones del curso 2`)
    console.log(`Usuario tiene ${allUserProgress?.length || 0} lecciones completadas en total`)
    
    if (orphanLessons && orphanLessons.length > 0) {
      console.log(`Se encontraron ${orphanLessons.length} lecciones huérfanas que podrían ser del curso 2`)
    }
    
    return {
      allCourse2Lessons,
      userCourse2Progress,
      allUserProgress,
      orphanLessons
    }
    
  } catch (error) {
    console.error("Error en diagnóstico del curso 2:", error)
    return null
  }
}

// Función para corregir manualmente el progreso del curso 2
export async function fixCourse2Progress(userId: string) {
  try {
    console.log("=== CORRIGIENDO PROGRESO DEL CURSO 2 ===")
    
    // 1. Obtener diagnóstico
    const diagnosis = await diagnoseCourse2(userId)
    if (!diagnosis) return
    
    const { allCourse2Lessons, userCourse2Progress, allUserProgress, orphanLessons } = diagnosis
    
    // 2. Si tienes lecciones huérfanas, vamos a reasignarlas al curso 2
    if (orphanLessons && orphanLessons.length > 0) {
      console.log("Encontramos lecciones huérfanas, vamos a reasignarlas...")
      
      // Eliminar lecciones huérfanas
      for (const orphan of orphanLessons) {
        await supabase
          .from("user_progress")
          .delete()
          .eq("user_id", userId)
          .eq("lesson_id", orphan.lesson_id)
        
        console.log(`Eliminada lección huérfana ${orphan.lesson_id}`)
      }
    }
    
    // 3. Verificar cuántas lecciones del curso 2 realmente necesitas
    const totalCourse2Lessons = allCourse2Lessons?.length || 10
    const currentCompleted = userCourse2Progress?.length || 0
    const shouldBeCompleted = 8 // Asumiendo que completaste 8 lecciones
    
    console.log(`Curso 2: ${currentCompleted}/${totalCourse2Lessons} completadas`)
    console.log(`Deberían ser: ${shouldBeCompleted}/${totalCourse2Lessons}`)
    
    // 4. Si faltan lecciones, marcar como completadas
    if (currentCompleted < shouldBeCompleted && allCourse2Lessons) {
      const missingCount = shouldBeCompleted - currentCompleted
      console.log(`Faltan ${missingCount} lecciones por marcar como completadas`)
      
      // Obtener las primeras lecciones no completadas del curso 2
      const completedLessonIds = userCourse2Progress?.map(p => p.lesson_id) || []
      const uncompletedLessons = allCourse2Lessons
        .filter(lesson => !completedLessonIds.includes(lesson.id))
        .slice(0, missingCount)
      
      // Marcar como completadas
      for (const lesson of uncompletedLessons) {
        const { error } = await supabase
          .from("user_progress")
          .insert({
            user_id: userId,
            lesson_id: lesson.id,
            completed_at: new Date().toISOString()
          })
        
        if (error) {
          console.error(`Error marcando lección ${lesson.id} como completada:`, error)
        } else {
          console.log(`✓ Lección ${lesson.id} (${lesson.title}) marcada como completada`)
        }
      }
    }
    
    // 5. Verificar el progreso final
    const finalProgress = await getCourseProgress(userId, 2)
    console.log(`Progreso final del curso 2: ${finalProgress.progress}%`)
    
    return finalProgress
    
  } catch (error) {
    console.error("Error corrigiendo progreso del curso 2:", error)
    return null
  }
}

// Función para limpiar progreso duplicado del curso 2
export async function cleanCourse2Duplicates(userId: string) {
  try {
    console.log("=== LIMPIANDO DUPLICADOS DEL CURSO 2 ===")
    
    // 1. Obtener todas las lecciones del curso 2
    const { data: course2Lessons } = await supabase
      .from("lessons")
      .select("id, order_index, title")
      .eq("course_id", 2)
      .order("order_index")
    
    if (!course2Lessons) {
      console.log("No se encontraron lecciones del curso 2")
      return
    }
    
    console.log("Lecciones del curso 2:", course2Lessons)
    
    // 2. Obtener el progreso actual del usuario para el curso 2
    const { data: userProgress } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .in("lesson_id", course2Lessons.map(l => l.id))
    
    console.log("Progreso actual del curso 2:", userProgress)
    
    // 3. Verificar si hay lecciones completadas fuera del rango esperado
    const validLessonIds = course2Lessons.map(l => l.id)
    const { data: allUserProgress } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", userId)
    
    if (allUserProgress) {
      const invalidLessons = allUserProgress.filter(p => 
        !validLessonIds.includes(p.lesson_id) && 
        p.lesson_id >= 9 && p.lesson_id <= 20 // Rango aproximado del curso 2
      )
      
      if (invalidLessons.length > 0) {
        console.log("Lecciones inválidas encontradas:", invalidLessons)
        
        // Eliminar lecciones inválidas
        for (const invalid of invalidLessons) {
          await supabase
            .from("user_progress")
            .delete()
            .eq("user_id", userId)
            .eq("lesson_id", invalid.lesson_id)
          
          console.log(`Eliminada lección inválida: ${invalid.lesson_id}`)
        }
      }
    }
    
    // 4. Verificar progreso final
    const { progress } = await getCourseProgress(userId, 2)
    console.log(`Progreso del curso 2 después de limpiar: ${progress}%`)
    
    console.log("=== LIMPIEZA COMPLETADA ===")
    return { success: true, progress }
    
  } catch (error) {
    console.error("Error limpiando duplicados del curso 2:", error)
    return { success: false, error }
  }
}

// Función general para diagnosticar cualquier curso
export async function diagnoseAnyCourse(userId: string, courseId: number) {
  try {
    console.log(`=== DIAGNÓSTICO CURSO ${courseId} ===`)
    
    // 1. Obtener todas las lecciones del curso
    const { data: courseLessons } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index")
    
    console.log(`Lecciones del curso ${courseId}:`, courseLessons)
    
    // 2. Obtener progreso del usuario para este curso
    const { data: userCourseProgress } = await supabase
      .from("user_progress")
      .select(`
        lesson_id,
        completed_at,
        lessons (
          id,
          title,
          course_id,
          order_index
        )
      `)
      .eq("user_id", userId)
      .eq("lessons.course_id", courseId)
    
    console.log(`Progreso del usuario en curso ${courseId}:`, userCourseProgress)
    
    // 3. Calcular progreso actual
    const totalLessons = courseLessons?.length || 0
    const completedLessons = userCourseProgress?.length || 0
    const currentProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0
    
    console.log(`Curso ${courseId}: ${completedLessons}/${totalLessons} lecciones (${currentProgress.toFixed(1)}%)`)
    
    // 4. Verificar lecciones huérfanas
    const validLessonIds = courseLessons?.map(l => l.id) || []
    const { data: allUserProgress } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", userId)
    
    const orphanLessons = allUserProgress?.filter(p => 
      !validLessonIds.includes(p.lesson_id) && 
      p.lesson_id >= (courseId - 1) * 10 && 
      p.lesson_id <= courseId * 15 // Rango aproximado
    ) || []
    
    if (orphanLessons.length > 0) {
      console.log(`Lecciones huérfanas encontradas para curso ${courseId}:`, orphanLessons)
    }
    
    return {
      courseLessons,
      userCourseProgress,
      totalLessons,
      completedLessons,
      currentProgress,
      orphanLessons
    }
    
  } catch (error) {
    console.error(`Error diagnosticando curso ${courseId}:`, error)
    return null
  }
}

// Función general para corregir cualquier curso
export async function fixAnyCourse(userId: string, courseId: number, expectedCompletedLessons: number) {
  try {
    console.log(`=== CORRIGIENDO CURSO ${courseId} ===`)
    
    // 1. Obtener diagnóstico
    const diagnosis = await diagnoseAnyCourse(userId, courseId)
    if (!diagnosis) return null
    
    const { courseLessons, userCourseProgress, totalLessons, completedLessons, orphanLessons } = diagnosis
    
    // 2. Limpiar lecciones huérfanas
    if (orphanLessons.length > 0) {
      console.log(`Limpiando ${orphanLessons.length} lecciones huérfanas...`)
      for (const orphan of orphanLessons) {
        await supabase
          .from("user_progress")
          .delete()
          .eq("user_id", userId)
          .eq("lesson_id", orphan.lesson_id)
        
        console.log(`Eliminada lección huérfana ${orphan.lesson_id}`)
      }
    }
    
    // 3. Corregir progreso si es necesario
    if (completedLessons < expectedCompletedLessons && courseLessons) {
      const missingCount = expectedCompletedLessons - completedLessons
      console.log(`Faltan ${missingCount} lecciones por marcar en curso ${courseId}`)
      
      // Obtener las primeras lecciones no completadas
      const completedLessonIds = userCourseProgress?.map(p => p.lesson_id) || []
      const uncompletedLessons = courseLessons
        .filter(lesson => !completedLessonIds.includes(lesson.id))
        .slice(0, missingCount)
      
      // Marcar como completadas
      for (const lesson of uncompletedLessons) {
        // Verificar si ya existe para evitar duplicados
        const { data: existing } = await supabase
          .from("user_progress")
          .select("lesson_id")
          .eq("user_id", userId)
          .eq("lesson_id", lesson.id)
          .single()
        
        if (!existing) {
          const { error } = await supabase
            .from("user_progress")
            .insert({
              user_id: userId,
              lesson_id: lesson.id,
              completed_at: new Date().toISOString()
            })
          
          if (error) {
            console.error(`Error marcando lección ${lesson.id}:`, error)
          } else {
            console.log(`✓ Lección ${lesson.id} (${lesson.title}) marcada como completada`)
          }
        } else {
          console.log(`✓ Lección ${lesson.id} ya estaba completada`)
        }
      }
    }
    
    // 4. Verificar progreso final
    const finalProgress = await getCourseProgress(userId, courseId)
    console.log(`Progreso final del curso ${courseId}: ${finalProgress.progress}%`)
    
    return finalProgress
    
  } catch (error) {
    console.error(`Error corrigiendo curso ${courseId}:`, error)
    return null
  }
}

// Función para corregir todos los cursos automáticamente
export async function fixAllCourses(userId: string) {
  try {
    console.log("=== CORRIGIENDO TODOS LOS CURSOS ===")
    
    // Configuración de cursos con lecciones esperadas completadas
    const courseConfig = [
      { id: 1, name: "Fundamentos del Celular", expectedCompleted: 8 },
      { id: 2, name: "Navegación en Internet", expectedCompleted: 8 }, // Completaste 8/10
      { id: 3, name: "Uso de la Computadora", expectedCompleted: 4 }, // Completaste 4/12 (según imagen)
      { id: 4, name: "WhatsApp y Mensajería", expectedCompleted: 0 },
      { id: 5, name: "Correo Electrónico", expectedCompleted: 0 },
      { id: 6, name: "Seguridad Digital", expectedCompleted: 0 }
    ]
    
    const results: { [key: number]: number } = {}
    
    for (const course of courseConfig) {
      if (course.expectedCompleted > 0) {
        console.log(`\n--- Procesando ${course.name} ---`)
        
        // 1. Diagnosticar
        const diagnosis = await diagnoseAnyCourse(userId, course.id)
        
        // 2. Corregir si es necesario
        const result = await fixAnyCourse(userId, course.id, course.expectedCompleted)
        
        if (result) {
          results[course.id] = result.progress
          console.log(`✓ ${course.name}: ${result.progress}%`)
        }
      }
    }
    
    console.log("\n=== RESUMEN DE CORRECCIONES ===")
    for (const [courseId, progress] of Object.entries(results)) {
      const course = courseConfig.find(c => c.id === parseInt(courseId))
      console.log(`Curso ${courseId} (${course?.name}): ${progress}%`)
    }
    
    console.log("=== CORRECCIÓN COMPLETA ===")
    return results
    
  } catch (error) {
    console.error("Error corrigiendo todos los cursos:", error)
    return null
  }
}

// Función específica para diagnosticar y corregir el curso 3
export async function diagnoseCourse3Specific(userId: string) {
  try {
    console.log("=== DIAGNÓSTICO ESPECÍFICO CURSO 3 ===")
    
    // 1. Obtener todas las lecciones del curso 3 ordenadas correctamente
    const { data: course3Lessons } = await supabase
      .from("lessons")
      .select("id, title, order_index, course_id")
      .eq("course_id", 3)
      .order("order_index")
    
    console.log("Lecciones del curso 3 (ordenadas por order_index):", course3Lessons)
    
    // 2. Obtener progreso actual del usuario para curso 3
    const { data: userProgress } = await supabase
      .from("user_progress")
      .select(`
        lesson_id,
        completed_at,
        lessons (
          id,
          title,
          order_index,
          course_id
        )
      `)
      .eq("user_id", userId)
      .eq("lessons.course_id", 3)
      .order("lessons.order_index")
    
    console.log("Progreso actual del usuario en curso 3:", userProgress)
    
    // 3. Mostrar qué lecciones están completadas
    if (userProgress && userProgress.length > 0) {
      console.log("\n=== LECCIONES COMPLETADAS ===")
      userProgress.forEach((progress, index) => {
        const lesson = progress.lessons as any
        console.log(`${index + 1}. ${lesson.title} (ID: ${lesson.id}, Order: ${lesson.order_index})`)
      })
    }
    
    // 4. Identificar si están completadas las correctas
    const completedLessonIds = userProgress?.map(p => p.lesson_id) || []
    const shouldBeCompletedIds = course3Lessons?.slice(0, 4).map(l => l.id) || [] // Primeras 4
    const actuallyCompletedIds = course3Lessons?.filter(l => completedLessonIds.includes(l.id)).map(l => l.id) || []
    
    console.log("\n=== ANÁLISIS DE ORDEN ===")
    console.log("IDs que DEBERÍAN estar completados (primeras 4):", shouldBeCompletedIds)
    console.log("IDs que ESTÁN completados:", actuallyCompletedIds)
    
    // 5. Verificar si son las últimas 4 en lugar de las primeras 4
    const lastFourIds = course3Lessons?.slice(-4).map(l => l.id) || []
    console.log("IDs de las últimas 4 lecciones:", lastFourIds)
    
    const isLastFourCompleted = lastFourIds.every(id => completedLessonIds.includes(id))
    console.log("¿Están completadas las últimas 4?", isLastFourCompleted)
    
    return {
      course3Lessons,
      userProgress,
      completedLessonIds,
      shouldBeCompletedIds,
      actuallyCompletedIds,
      lastFourIds,
      isLastFourCompleted
    }
    
  } catch (error) {
    console.error("Error diagnosticando curso 3:", error)
    return null
  }
}

// Función para corregir el orden de las lecciones del curso 3
export async function fixCourse3Order(userId: string) {
  try {
    console.log("=== CORRIGIENDO ORDEN DEL CURSO 3 ===")
    
    // 1. Obtener diagnóstico
    const diagnosis = await diagnoseCourse3Specific(userId)
    if (!diagnosis) return null
    
    const { course3Lessons, completedLessonIds, shouldBeCompletedIds, isLastFourCompleted } = diagnosis
    
    // 2. Si están completadas las últimas 4, corregir
    if (isLastFourCompleted && course3Lessons) {
      console.log("Detectado: están completadas las últimas 4 lecciones")
      console.log("Corrigiendo: marcando las primeras 4 como completadas")
      
      // Eliminar las últimas 4 completadas
      const lastFourIds = course3Lessons.slice(-4).map(l => l.id)
      for (const lessonId of lastFourIds) {
        await supabase
          .from("user_progress")
          .delete()
          .eq("user_id", userId)
          .eq("lesson_id", lessonId)
        
        console.log(`Eliminada lección ${lessonId} (de las últimas 4)`)
      }
      
      // Marcar las primeras 4 como completadas
      const firstFourLessons = course3Lessons.slice(0, 4)
      for (const lesson of firstFourLessons) {
        // Verificar si ya existe
        const { data: existing } = await supabase
          .from("user_progress")
          .select("lesson_id")
          .eq("user_id", userId)
          .eq("lesson_id", lesson.id)
          .single()
        
        if (!existing) {
          const { error } = await supabase
            .from("user_progress")
            .insert({
              user_id: userId,
              lesson_id: lesson.id,
              completed_at: new Date().toISOString()
            })
          
          if (error) {
            console.error(`Error marcando lección ${lesson.id}:`, error)
          } else {
            console.log(`✓ Lección ${lesson.id} (${lesson.title}) marcada como completada`)
          }
        }
      }
    }
    
    // 3. Verificar progreso final
    const finalProgress = await getCourseProgress(userId, 3)
    console.log(`Progreso final del curso 3: ${finalProgress.progress}%`)
    
    return finalProgress
    
  } catch (error) {
    console.error("Error corrigiendo orden del curso 3:", error)
    return null
  }
}
