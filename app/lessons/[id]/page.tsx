"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, LogOut, CheckCircle, Circle, Play, Clock, ArrowRight, ArrowLeft } from "lucide-react"
import { completeLessonByCourse, getUserProgress, getUserStats, getLessonsByCourse, getCourseById } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
}

interface Lesson {
  id: number
  title: string
  description: string
  content: string
  duration: string
  order_index: number
  course_id: number
  video_url?: string
  completed: boolean
}

interface Course {
  id: number
  title: string
  description: string
  lessons_count: number
  duration: string
  difficulty: string
}

export default function LessonsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [currentLesson, setCurrentLesson] = useState<number>(1)
  const [progress, setProgress] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const { toast } = useToast()

  useEffect(() => {
    const loadUserAndCourseData = async () => {
      const userData = localStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }
      
      const userObj = JSON.parse(userData)
      setUser(userObj)

      try {
        setIsDataLoading(true)

        // Cargar información del curso
        const { course: courseData, error: courseError } = await getCourseById(parseInt(courseId))
        if (courseError || !courseData) {
          console.error("Error loading course:", courseError)
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudo cargar la información del curso.",
          })
          router.push("/courses")
          return
        }
        setCourse(courseData)

        // Cargar lecciones del curso
        const { lessons: lessonsData, error: lessonsError } = await getLessonsByCourse(parseInt(courseId))
        if (lessonsError) {
          console.error("Error loading lessons:", lessonsError)
          toast({
            variant: "destructive",
            title: "Error",
            description: "No se pudieron cargar las lecciones del curso.",
          })
          return
        }

        // Agregar campo completed inicial
        const lessonsWithCompletion = lessonsData.map(lesson => ({
          ...lesson,
          completed: false
        }))
        setLessons(lessonsWithCompletion)

        // Cargar progreso del usuario
        if (userObj.id) {
          const { progress: progressData } = await getUserProgress(userObj.id)
          if (progressData) {
            // Obtener IDs de lecciones completadas de este curso
            const completedLessonIds = progressData
              .filter((p: any) => p.lessons && p.lessons.course_id === parseInt(courseId))
              .map((p: any) => p.lesson_id)
            
            setProgress(completedLessonIds)
          }
        }

      } catch (error) {
        console.error("Error loading course data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Hubo un problema al cargar los datos del curso.",
        })
      } finally {
        setIsDataLoading(false)
      }
    }

    loadUserAndCourseData()
  }, [router, courseId, toast])

  // Actualizar estado de completado de lecciones cuando cambie el progreso
  useEffect(() => {
    if (progress.length > 0 && lessons.length > 0) {
      setLessons(prevLessons => 
        prevLessons.map(lesson => ({
          ...lesson,
          completed: progress.includes(lesson.id)
        }))
      )
    }
  }, [progress, lessons.length])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const markLessonComplete = async (lessonOrderIndex: number) => {
    if (!user?.id) return
    
    setIsLoading(true)
    
    try {
      // Encontrar la lección por order_index
      const lesson = lessons.find(l => l.order_index === lessonOrderIndex)
      if (!lesson) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se encontró la lección.",
        })
        return
      }

      console.log(`Attempting to complete lesson: courseId=${courseId}, lessonId=${lesson.id}, order_index=${lessonOrderIndex}`)
      
      // Completar lección en la base de datos usando el ID real de la lección
      const result = await completeLessonByCourse(user.id, parseInt(courseId), lessonOrderIndex)
      
      console.log("Complete lesson result:", result)
      
      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo completar la lección. Por favor, intenta de nuevo.",
        })
        return
      }

      // Actualizar el progreso local inmediatamente
      setProgress(prev => [...prev, lesson.id])
      
      // Mostrar notificación de lección completada
      toast({
        variant: "default",
        title: "¡Felicitaciones! 🎉",
        description: `Has completado la lección "${lesson.title}". ¡Excelente trabajo!`,
      })

      // Verificar si es la última lección del curso
      const totalLessons = lessons.length
      
      if (lessonOrderIndex === totalLessons) {
        // Curso completado - redirigir a los cursos
        setTimeout(() => {
          toast({
            variant: "default",
            title: "¡Curso Completado! 🎊",
            description: "Has terminado exitosamente el curso. ¡Excelente trabajo!",
          })
          
          // Redirigir a los cursos después del toast
          setTimeout(() => {
            router.push("/courses")
          }, 1500)
        }, 1000)
      } else {
        // No es la última lección, avanzar automáticamente a la siguiente
        setTimeout(() => {
          setCurrentLesson(lessonOrderIndex + 1)
        }, 1000)
      }

    } catch (error) {
      console.error('Error completing lesson:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al completar la lección.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const courseTitle = course?.title || "Curso Desconocido"
  const completedLessons = lessons.filter((lesson) => lesson.completed).length
  const progressValue = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0

  const currentLessonData = lessons.find((lesson) => lesson.order_index === currentLesson)
  const canProceed = currentLessonData?.completed || false

  if (!user || isDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando lecciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-cyan-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CapDigital</h1>
                <p className="text-sm text-cyan-600 font-medium">{courseTitle}</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/courses">
                <Button variant="outline">Todos los Cursos</Button>
              </Link>
              <span className="text-lg font-medium text-gray-700">Hola, {user.name}</span>
              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900">{courseTitle}</h2>
            <Badge className="bg-cyan-100 text-cyan-800 text-base px-4 py-2">
              {completedLessons} de {lessons.length} completadas
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Progress value={progressValue} className="flex-1" />
            <span className="text-lg font-medium text-cyan-600">{Math.round(progressValue)}%</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Lesson List */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-cyan-200">
              <CardHeader>
                <CardTitle>Lecciones del Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson.order_index)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                        currentLesson === lesson.order_index
                          ? "border-cyan-300 bg-cyan-50"
                          : "border-gray-200 hover:border-cyan-200"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        {lesson.completed ? (
                          <CheckCircle className="h-5 w-5 text-cyan-600 mt-0.5" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{lesson.title}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lesson Content */}
          <div className="lg:col-span-3">
            {currentLessonData && (
              <Card className="border-2 border-cyan-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{currentLessonData.title}</CardTitle>
                      <CardDescription className="text-base mt-2">{currentLessonData.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-500">{currentLessonData.duration}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Video Placeholder */}
                  <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
                    <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Video de la lección: {currentLessonData.title}</p>
                    {currentLessonData.video_url ? (
                      <Button 
                        className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        onClick={() => window.open(currentLessonData.video_url, '_blank')}
                      >
                        Reproducir Video
                      </Button>
                    ) : (
                      <Button className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
                        Reproducir Video
                      </Button>
                    )}
                  </div>

                  {/* Lesson Content */}
                  <div className="prose max-w-none">
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">{currentLessonData.content}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentLesson(Math.max(1, currentLesson - 1))}
                      disabled={currentLesson === 1}
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Lección Anterior</span>
                    </Button>

                    <div className="flex space-x-4">
                      {/* Botón para completar lección */}
                      {!currentLessonData?.completed && (
                        <Button
                          onClick={() => markLessonComplete(currentLesson)}
                          disabled={isLoading}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        >
                          {isLoading ? "Completando..." : 
                           currentLesson === lessons.length ? "Terminar Curso" : "Terminar Lección"}
                        </Button>
                      )}

                      {/* Botón siguiente lección - solo si no es la última */}
                      {currentLesson < lessons.length && (
                        <Button
                          onClick={() => setCurrentLesson(Math.min(lessons.length, currentLesson + 1))}
                          disabled={!canProceed}
                          className="flex items-center space-x-2"
                        >
                          <span>Siguiente Lección</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {!canProceed && currentLesson < lessons.length && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800">Completa esta lección para continuar con la siguiente.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
