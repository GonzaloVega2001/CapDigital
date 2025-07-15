"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, LogOut, Smartphone, Laptop, Wifi, Shield, MessageCircle, Mail, Lock, Menu, X } from "lucide-react"
import { getUserProgress, getUserStats, getCourseProgress, getCourseProgressRobust, getOverallProgress } from "@/lib/database"
import { debugUserProgress, checkDatabaseStructure } from "@/lib/debug-progress"
import { debugUserProgressDetailed, checkAndFixProgressData } from "@/lib/debug-detailed"
import { forceUpdateAllProgress, showDetailedProgress } from "@/lib/force-update"

interface User {
  id: string
  name: string
  email: string
}

export default function CoursesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [courseProgress, setCourseProgress] = useState<{[key: number]: number}>({})
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      const userData = localStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }
      
      const userObj = JSON.parse(userData)
      setUser(userObj)
      
      if (userObj.id) {
        // Cargar progreso del usuario
        const { progress } = await getUserProgress(userObj.id)
        if (progress) {
          const completedLessonIds = progress.map((p: any) => p.lesson_id)
          setCompletedLessons(completedLessonIds)
        }
        
        // Verificar progreso individual por curso
        const courseProgressIndividual: { [key: number]: number } = {}
        for (let i = 1; i <= 6; i++) {
          const { progress, details } = await getCourseProgressRobust(userObj.id, i)
          courseProgressIndividual[i] = progress
          console.log(`Course ${i} progress: ${progress}%`, details)
        }
        
        // Usar progreso individual actualizado
        setCourseProgress(courseProgressIndividual)
      }
      
      setIsLoading(false)
    }

    loadUserData()
  }, [router])

  // Función para recargar el progreso del usuario
  const reloadUserProgress = async () => {
    const userData = localStorage.getItem("user")
    if (!userData) return
    
    const userObj = JSON.parse(userData)
    if (userObj.id) {
      const { progress } = await getUserProgress(userObj.id)
      if (progress) {
        const completedLessonIds = progress.map((p: any) => p.lesson_id)
        setCompletedLessons(completedLessonIds)
      }
      
      // Verificar progreso individual por curso
      const courseProgressIndividual: { [key: number]: number } = {}
      for (let i = 1; i <= 6; i++) {
        const { progress, details } = await getCourseProgressRobust(userObj.id, i)
        courseProgressIndividual[i] = progress
        console.log(`Course ${i} progress: ${progress}%`, details)
      }
      
      setCourseProgress(courseProgressIndividual)
    }
  }

  // Función temporal de debug
  const debugProgress = async () => {
    const userData = localStorage.getItem("user")
    if (!userData) return
    
    const userObj = JSON.parse(userData)
    if (userObj.id) {
      console.log("=== STARTING PROGRESS DEBUG ===")
      console.log("User ID:", userObj.id)
      
      await debugUserProgressDetailed(userObj.id)
      await checkAndFixProgressData(userObj.id)
      
      console.log("=== TESTING ROBUST PROGRESS ===")
      for (let i = 1; i <= 6; i++) {
        const result = await getCourseProgressRobust(userObj.id, i)
        console.log(`Course ${i} robust progress:`, result)
      }
      
      console.log("=== CURRENT STATE ===")
      console.log("courseProgress:", courseProgress)
      console.log("completedLessons:", completedLessons)
    }
  }

  // Función para actualizar progreso forzadamente
  const forceUpdateProgress = async () => {
    const userData = localStorage.getItem("user")
    if (!userData) return
    
    const userObj = JSON.parse(userData)
    if (userObj.id) {
      console.log("🔄 Forzando actualización del progreso...")
      setIsLoading(true)
      
      const updatedProgress = await forceUpdateAllProgress(userObj.id)
      setCourseProgress(updatedProgress)
      
      await showDetailedProgress(userObj.id)
      
      setIsLoading(false)
      console.log("✅ Progreso actualizado!")
    }
  }

  // Recargar datos cuando la página se enfoque (cuando regreses de una lección)
  useEffect(() => {
    const handleFocus = () => {
      reloadUserProgress()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando tu progreso...</p>
        </div>
      </div>
    )
  }

  const courses = [
    {
      id: 1,
      title: "Fundamentos del Celular",
      description: "Aprende lo básico para usar tu smartphone de manera efectiva",
      icon: Smartphone,
      progress: courseProgress[1] || 0,
      lessons: 8,
      completedLessons: Math.round(((courseProgress[1] || 0) / 100) * 8),
      duration: "2-3 horas",
      difficulty: "Principiante",
      unlocked: true,
      topics: ["Encender y apagar", "Llamadas", "Mensajes", "Contactos"],
    },
    {
      id: 2,
      title: "Navegación en Internet",
      description: "Descubre cómo navegar de forma segura en la web",
      icon: Wifi,
      progress: courseProgress[2] || 0,
      lessons: 10,
      completedLessons: Math.round(((courseProgress[2] || 0) / 100) * 10),
      duration: "3-4 horas",
      difficulty: "Principiante",
      unlocked: courseProgress[1] >= 100, // Desbloqueado si completó el curso 1
      topics: ["Navegadores", "Búsquedas", "Sitios web", "Seguridad"],
    },
    {
      id: 3,
      title: "Uso de la Computadora",
      description: "Domina las funciones básicas de tu PC o laptop",
      icon: Laptop,
      progress: courseProgress[3] || 0,
      lessons: 12,
      completedLessons: Math.round(((courseProgress[3] || 0) / 100) * 12),
      duration: "4-5 horas",
      difficulty: "Principiante",
      unlocked: (courseProgress[2] || 0) >= 100, // Desbloqueado si completó el curso 2
      topics: ["Escritorio", "Archivos", "Programas", "Configuración"],
    },
    {
      id: 4,
      title: "WhatsApp y Mensajería",
      description: "Comunícate con familia y amigos usando WhatsApp",
      icon: MessageCircle,
      progress: courseProgress[4] || 0,
      lessons: 6,
      completedLessons: Math.round(((courseProgress[4] || 0) / 100) * 6),
      duration: "2 horas",
      difficulty: "Principiante",
      unlocked: (courseProgress[3] || 0) >= 100, // Desbloqueado si completó el curso 3
      topics: ["Instalación", "Contactos", "Mensajes", "Grupos"],
    },
    {
      id: 5,
      title: "Correo Electrónico",
      description: "Aprende a enviar y recibir emails de forma profesional",
      icon: Mail,
      progress: courseProgress[5] || 0,
      lessons: 8,
      completedLessons: Math.round(((courseProgress[5] || 0) / 100) * 8),
      duration: "3 horas",
      difficulty: "Intermedio",
      unlocked: (courseProgress[4] || 0) >= 100, // Desbloqueado si completó el curso 4
      topics: ["Crear cuenta", "Enviar emails", "Adjuntos", "Organización"],
    },
    {
      id: 6,
      title: "Seguridad Digital",
      description: "Protégete de estafas y mantén tu información segura",
      icon: Shield,
      progress: courseProgress[6] || 0,
      lessons: 10,
      completedLessons: Math.round(((courseProgress[6] || 0) / 100) * 10),
      duration: "3-4 horas",
      difficulty: "Intermedio",
      unlocked: (courseProgress[5] || 0) >= 100, // Desbloqueado si completó el curso 5
      topics: ["Contraseñas", "Estafas", "Privacidad", "Antivirus"],
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante":
        return "bg-green-100 text-green-800"
      case "Intermedio":
        return "bg-yellow-100 text-yellow-800"
      case "Avanzado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-cyan-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">CapDigital</h1>
                <p className="text-sm text-cyan-600 font-medium">Todos los Cursos</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Panel de Control</Button>
              </Link>
              <span className="text-lg font-medium text-gray-700">Hola, {user.name}</span>
              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                <span>Salir</span>
              </Button>
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden relative">
              <input type="checkbox" id="mobile-menu-toggle" className="hidden peer" />
              <label 
                htmlFor="mobile-menu-toggle" 
                className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <Menu className="h-6 w-6 text-gray-700 block peer-checked:hidden" />
                <X className="h-6 w-6 text-gray-700 hidden peer-checked:block" />
              </label>

              {/* Mobile Menu Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 transform scale-95 opacity-0 origin-top-right peer-checked:scale-100 peer-checked:opacity-100 transition-all duration-200">
                <div className="p-4 space-y-3">
                  {/* User Info */}
                  <div className="border-b border-gray-200 pb-3">
                    <span className="text-base font-medium text-gray-700">Hola, {user.name}</span>
                  </div>
                  
                  {/* Navigation Links */}
                  <Link href="/dashboard" className="block w-full">
                    <Button variant="outline" className="w-full justify-start">
                      Panel de Control
                    </Button>
                  </Link>
                  
                  {/* Logout */}
                  <div className="pt-3 border-t border-gray-200">
                    <Button 
                      variant="outline" 
                      onClick={handleLogout} 
                      className="w-full justify-start bg-red-50 hover:bg-red-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Salir
                    </Button>
                  </div>
                </div>
              </div>

              {/* Overlay para cerrar el menú */}
              <label 
                htmlFor="mobile-menu-toggle"
                className="fixed inset-0 bg-black bg-opacity-25 z-40 hidden peer-checked:block cursor-pointer"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Catálogo de Cursos</h2>
          <p className="text-base sm:text-lg text-gray-600">
            Explora todos nuestros cursos diseñados especialmente para adultos mayores
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const IconComponent = course.icon
            return (
              <Card
                key={course.id}
                className={`border-2 ${course.unlocked ? "border-cyan-200 hover:border-cyan-300" : "border-gray-200 opacity-75"} transition-all hover:shadow-lg`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${course.unlocked ? "bg-cyan-100" : "bg-gray-100"}`}>
                      <IconComponent className={`h-6 w-6 sm:h-8 sm:w-8 ${course.unlocked ? "text-cyan-600" : "text-gray-400"}`} />
                    </div>
                    {!course.unlocked && <Lock className="h-5 w-5 text-gray-400" />}
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{course.title}</CardTitle>
                  <CardDescription className="text-sm sm:text-base">{course.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Course Info */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getDifficultyColor(course.difficulty)}>{course.difficulty}</Badge>
                      <Badge variant="outline">{course.lessons} lecciones</Badge>
                      <Badge variant="outline">{course.duration}</Badge>
                    </div>

                    {/* Progress */}
                    {course.unlocked && course.progress > 0 && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Progreso</span>
                          <span className="text-sm font-medium text-cyan-600">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                        <p className="text-sm text-gray-500 mt-1">
                          {course.completedLessons} de {course.lessons} lecciones completadas
                        </p>
                      </div>
                    )}

                    {/* Topics */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Temas que aprenderás:</p>
                      <div className="flex flex-wrap gap-1">
                        {course.topics.map((topic, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link href={course.unlocked ? `/lessons/${course.id}` : "#"}>
                      <Button
                        className={`w-full text-sm sm:text-base ${course.unlocked ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600" : ""}`}
                        disabled={!course.unlocked}
                      >
                        {course.unlocked
                          ? course.progress > 0
                            ? "Continuar Curso"
                            : "Comenzar Curso"
                          : "Completa el curso anterior"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Learning Path Info */}
        <div className="mt-12 bg-white rounded-xl border-2 border-cyan-200 p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Tu Ruta de Aprendizaje</h3>
          <p className="text-base sm:text-lg text-gray-600 mb-6">
            Los cursos están organizados en una secuencia lógica. Completa cada curso para desbloquear el siguiente y
            construir tus habilidades digitales paso a paso.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-cyan-100 p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-cyan-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Fundamentos</h4>
              <p className="text-xs sm:text-sm text-gray-600">Celular e Internet básico</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-100 p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-cyan-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Comunicación</h4>
              <p className="text-xs sm:text-sm text-gray-600">WhatsApp y Email</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-100 p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-cyan-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Seguridad</h4>
              <p className="text-xs sm:text-sm text-gray-600">Protección digital</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}