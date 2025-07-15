import { supabase, authService } from "./supabase"

// Funciones de autenticación
export async function signUp(email: string, password: string, name: string, age?: number) {
  try {
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

// Función mejorada para completar lección
export async function completeLessonByCourse(userId: string, courseId: number, localLessonId: number) {
  try {
    // Obtener el ID real de la lección
    const realLessonId = await getRealLessonId(courseId, localLessonId)
    
    if (!realLessonId) {
      throw new Error(`Lesson not found: course ${courseId}, lesson ${localLessonId}`)
    }

    // Verificar si ya está completada
    const { data: existing } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", userId)
      .eq("lesson_id", realLessonId)
      .single()
    
    if (existing) {
      return { progress: existing, error: null, alreadyCompleted: true }
    }

    // Marcar lección como completada
    const { data: progress, error: progressError } = await supabase
      .from("user_progress")
      .insert({
        user_id: userId,
        lesson_id: realLessonId,
        completed_at: new Date().toISOString()
      })
      .select()

    if (progressError) {
      if (progressError.code === "23505") {
        return { progress: null, error: null, alreadyCompleted: true }
      }
      throw progressError
    }

    // Verificar y otorgar logros
    await checkAndGrantAchievements(userId)

    return { progress, error: null }
  } catch (error) {
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
    // Silenciar errores de logros para no afectar el flujo principal
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

// Función mejorada para obtener progreso por curso
export async function getCourseProgress(userId: string, courseId: number) {
  try {
    // Obtener total de lecciones del curso
    const { data: course } = await supabase
      .from("courses")
      .select("lessons_count")
      .eq("id", courseId)
      .single()

    if (!course) return { progress: 0, error: "Course not found" }

    // Obtener lecciones completadas del curso
    const { data: completedLessons, error } = await supabase
      .from("user_progress")
      .select(`
        lessons!inner(course_id)
      `)
      .eq("user_id", userId)
      .eq("lessons.course_id", courseId)

    if (error) return { progress: 0, error }

    const completedCount = completedLessons?.length || 0
    const progress = Math.round((completedCount / course.lessons_count) * 100)

    return { progress, error: null }
  } catch (error) {
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
    return null
  }
}

// Función para obtener el próximo curso disponible
export async function getNextAvailableCourse(userId: string) {
  try {
    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .eq("is_active", true)
      .order("order_index")

    if (!courses) return null

    // Verificar progreso en cada curso
    for (const course of courses) {
      const { progress } = await getCourseProgress(userId, course.id)
      
      // Si el curso no está completado al 100%, es el próximo curso
      if (progress < 100) {
        return course
      }
    }

    // Si todos los cursos están completados, retornar null
    return null
  } catch (error) {
    return null
  }
}

// Función para obtener lecciones disponibles de un curso
export async function getAvailableLessons(userId: string, courseId: number) {
  try {
    // Obtener todas las lecciones del curso
    const { data: allLessons } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .eq("is_active", true)
      .order("order_index")

    if (!allLessons) return { lessons: [], error: "No lessons found" }

    // Obtener lecciones completadas por el usuario
    const { data: completedLessons } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", userId)

    const completedLessonIds = completedLessons?.map(p => p.lesson_id) || []

    // Marcar lecciones como completadas y determinar cuál es la próxima
    const lessonsWithStatus = allLessons.map((lesson, index) => {
      const isCompleted = completedLessonIds.includes(lesson.id)
      const isNext = !isCompleted && (index === 0 || completedLessonIds.includes(allLessons[index - 1].id))
      
      return {
        ...lesson,
        isCompleted,
        isNext,
        isLocked: !isCompleted && !isNext
      }
    })

    return { lessons: lessonsWithStatus, error: null }
  } catch (error) {
    return { lessons: [], error }
  }
}

// Función para verificar si un curso está completado
export async function isCourseCompleted(userId: string, courseId: number) {
  try {
    const { progress } = await getCourseProgress(userId, courseId)
    return progress === 100
  } catch (error) {
    return false
  }
}

// Función para obtener el progreso general del usuario
export async function getOverallProgress(userId: string) {
  try {
    const { data: courses } = await supabase
      .from("courses")
      .select("*")
      .eq("is_active", true)
      .order("order_index")

    if (!courses) return { progress: 0, error: "No courses found" }

    let totalProgress = 0
    const courseProgressData = []

    for (const course of courses) {
      const { progress } = await getCourseProgress(userId, course.id)
      totalProgress += progress
      courseProgressData.push({
        courseId: course.id,
        courseName: course.title,
        progress
      })
    }

    const overallProgress = Math.round(totalProgress / courses.length)

    return {
      progress: overallProgress,
      courseProgress: courseProgressData,
      totalCourses: courses.length,
      error: null
    }
  } catch (error) {
    return {
      progress: 0,
      courseProgress: [],
      totalCourses: 0,
      error
    }
  }
}
