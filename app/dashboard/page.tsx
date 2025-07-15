"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Award, Users, LogOut, Smartphone, Laptop, Wifi, Trophy, Star, Clock } from "lucide-react"
import { getCourses, getUserStats, getRecentUserAchievements } from "@/lib/database"
import type { Course, User } from "@/lib/supabase"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [recentAchievements, setRecentAchievements] = useState<any[]>([])
  const [stats, setStats] = useState({
    completedLessons: 0,
    totalAchievements: 0,
    totalPoints: 0,
    courseProgress: {} as { [key: number]: number },
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const userData = localStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }

      const currentUser = JSON.parse(userData)
      setUser(currentUser)

      // Cargar cursos
      const { courses: coursesData } = await getCourses()
      setCourses(coursesData || [])

      // Cargar estadísticas del usuario
      const userStats = await getUserStats(currentUser.id)
      setStats(userStats)

      // Cargar logros recientes del usuario
      const { achievements: recentAchievementsData } = await getRecentUserAchievements(currentUser.id, 3)
      setRecentAchievements(recentAchievementsData || [])

      setIsLoading(false)
    }

    loadData()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu panel...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Smartphone,
      Wifi,
      Laptop,
    }
    return icons[iconName] || BookOpen
  }

  // Función para formatear la fecha del logro
  const formatAchievementDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Hace 1 día"
    if (diffDays <= 7) return `Hace ${diffDays} días`
    if (diffDays <= 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`
    return `Hace ${Math.ceil(diffDays / 30)} meses`
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
                <p className="text-sm text-cyan-600 font-medium">Panel de Control</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido de vuelta, {user.name}!</h2>
          <p className="text-lg text-gray-600">Continúa tu viaje de aprendizaje digital. Tienes un gran progreso.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-cyan-200">
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.completedLessons}</p>
              <p className="text-sm text-gray-600">Lecciones Completadas</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-cyan-200">
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.totalAchievements}</p>
              <p className="text-sm text-gray-600">Logros Obtenidos</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-cyan-200">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{Math.round((stats.completedLessons * 20) / 60)}h</p>
              <p className="text-sm text-gray-600">Tiempo de Estudio</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-cyan-200">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900">{stats.totalPoints}</p>
              <p className="text-sm text-gray-600">Puntos Totales</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Courses Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Mis Cursos</h3>
              <Link href="/courses">
                <Button variant="outline">Ver Todos</Button>
              </Link>
            </div>

            <div className="space-y-6">
              {courses.slice(0, 3).map((course) => {
                const IconComponent = getIconComponent(course.icon)
                const progress = stats.courseProgress[course.id] || 0
                const isUnlocked =
                  course.order_index === 1 ||
                  progress > 0 ||
                  (course.order_index > 1 && stats.courseProgress[course.order_index - 1] >= 100)

                return (
                  <Card
                    key={course.id}
                    className={`border-2 ${isUnlocked ? "border-cyan-200 hover:border-cyan-300" : "border-gray-200 opacity-60"} transition-colors`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${isUnlocked ? "bg-cyan-100" : "bg-gray-100"}`}>
                          <IconComponent className={`h-8 w-8 ${isUnlocked ? "text-cyan-600" : "text-gray-400"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xl font-semibold text-gray-900">{course.title}</h4>
                            {!isUnlocked && (
                              <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                                Bloqueado
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-4">{course.description}</p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-500">
                              {course.lessons_count} lecciones • {course.duration}
                            </span>
                            <span className="text-sm font-medium text-cyan-600">{progress}%</span>
                          </div>
                          <Progress value={progress} className="mb-4" />
                          <Link href={isUnlocked ? `/lessons/${course.id}` : "#"}>
                            <Button
                              className={
                                isUnlocked
                                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                                  : ""
                              }
                              disabled={!isUnlocked}
                            >
                              {isUnlocked ? "Continuar Curso" : "Completa el curso anterior"}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <Card className="border-2 border-cyan-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-cyan-600" />
                  <span>Logros Recientes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAchievements.length > 0 ? (
                    recentAchievements.map((userAchievement, index) => {
                      const achievement = userAchievement.achievements
                      const IconComponent = getIconComponent(achievement.icon)
                      return (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="bg-yellow-100 p-2 rounded-lg">
                            <IconComponent className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{achievement.title}</p>
                            <p className="text-sm text-gray-500">{formatAchievementDate(userAchievement.earned_at)}</p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500">No tienes logros recientes</p>
                      <p className="text-sm text-gray-400">¡Completa lecciones para obtener logros!</p>
                    </div>
                  )}
                </div>
                <Link href="/achievements">
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    Ver Todos los Logros
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-2 border-cyan-200">
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/courses">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Explorar Cursos
                  </Button>
                </Link>
                <Link href="/achievements">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Award className="h-4 w-4 mr-2" />
                    Mis Logros
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Comunidad
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
