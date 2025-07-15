"use client"

export interface UserProgress {
  completedLessons: number[]
  courseProgress: { [courseId: number]: number }
  achievements: number[]
  totalPoints: number
  studyTime: number
  loginStreak: number
  lastLoginDate: string
}

export const defaultProgress: UserProgress = {
  completedLessons: [],
  courseProgress: {},
  achievements: [],
  totalPoints: 0,
  studyTime: 0,
  loginStreak: 0,
  lastLoginDate: "",
}

export const getProgress = (): UserProgress => {
  if (typeof window === "undefined") return defaultProgress

  const saved = localStorage.getItem("userProgress")
  return saved ? JSON.parse(saved) : defaultProgress
}

export const saveProgress = (progress: UserProgress) => {
  if (typeof window === "undefined") return
  localStorage.setItem("userProgress", JSON.stringify(progress))
}

export const completeLesson = (courseId: number, lessonId: number): UserProgress => {
  const progress = getProgress()
  const lessonKey = Number.parseInt(`${courseId}${lessonId.toString().padStart(2, "0")}`)

  if (!progress.completedLessons.includes(lessonKey)) {
    progress.completedLessons.push(lessonKey)
    progress.totalPoints += 25
    progress.studyTime += 20 // 20 minutes per lesson

    // Update course progress
    const courseLessons = getCourseInfo(courseId).lessons
    const completedInCourse = progress.completedLessons.filter((l) => Math.floor(l / 100) === courseId).length
    progress.courseProgress[courseId] = Math.round((completedInCourse / courseLessons) * 100)

    saveProgress(progress)
  }

  return progress
}

export const unlockAchievement = (achievementId: number): UserProgress => {
  const progress = getProgress()

  if (!progress.achievements.includes(achievementId)) {
    progress.achievements.push(achievementId)
    const achievement = getAchievementById(achievementId)
    if (achievement) {
      progress.totalPoints += achievement.points
    }
    saveProgress(progress)
  }

  return progress
}

export const getCourseInfo = (courseId: number) => {
  const courses = {
    1: { lessons: 8, title: "Fundamentos del Celular" },
    2: { lessons: 10, title: "Navegación en Internet" },
    3: { lessons: 12, title: "Uso de la Computadora" },
    4: { lessons: 6, title: "WhatsApp y Mensajería" },
    5: { lessons: 8, title: "Correo Electrónico" },
    6: { lessons: 10, title: "Seguridad Digital" },
  }
  return courses[courseId as keyof typeof courses] || { lessons: 0, title: "Curso Desconocido" }
}

export const getAchievementById = (id: number) => {
  const achievements = [
    { id: 1, title: "¡Bienvenido a CapDigital!", points: 10 },
    { id: 2, title: "Primera Lección", points: 25 },
    { id: 3, title: "Curso Iniciado", points: 15 },
    { id: 4, title: "Estudiante Dedicado", points: 50 },
    { id: 5, title: "Experto en Celular", points: 100 },
    { id: 6, title: "Navegador Web", points: 100 },
    { id: 7, title: "Maestro Digital", points: 500 },
    { id: 8, title: "Racha de 7 Días", points: 75 },
    { id: 9, title: "Tiempo de Calidad", points: 80 },
    { id: 10, title: "Miembro de la Comunidad", points: 30 },
  ]
  return achievements.find((a) => a.id === id)
}

export const checkAchievements = (progress: UserProgress): number[] => {
  const newAchievements: number[] = []

  // Primera lección completada
  if (progress.completedLessons.length >= 1 && !progress.achievements.includes(2)) {
    newAchievements.push(2)
  }

  // Estudiante dedicado (5 lecciones)
  if (progress.completedLessons.length >= 5 && !progress.achievements.includes(4)) {
    newAchievements.push(4)
  }

  // Experto en celular (completar curso 1)
  if (progress.courseProgress[1] === 100 && !progress.achievements.includes(5)) {
    newAchievements.push(5)
  }

  // Navegador web (completar curso 2)
  if (progress.courseProgress[2] === 100 && !progress.achievements.includes(6)) {
    newAchievements.push(6)
  }

  // Tiempo de calidad (10+ horas)
  if (progress.studyTime >= 600 && !progress.achievements.includes(9)) {
    newAchievements.push(9)
  }

  // Maestro digital (todos los cursos)
  const allCoursesComplete = [1, 2, 3, 4, 5, 6].every((courseId) => progress.courseProgress[courseId] === 100)
  if (allCoursesComplete && !progress.achievements.includes(7)) {
    newAchievements.push(7)
  }

  return newAchievements
}
