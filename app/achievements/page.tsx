"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, LogOut, Trophy, Star, Award, Medal, Crown, Target, Zap, Heart, Users, Clock, Lock } from "lucide-react"
import { getAllAchievementsWithUserStatus } from "@/lib/database"
import type { User } from "@/lib/supabase"

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
  points: number
  rarity: "common" | "rare" | "epic" | "legendary"
  requirements?: any
}

export default function AchievementsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const categories = [
    "Todos",
    "Inicio",
    "Aprendizaje", 
    "Progreso",
    "Cursos",
    "Maestría",
    "Constancia",
    "Tiempo",
    "Social",
  ]

  useEffect(() => {
    const loadData = async () => {
      const userData = localStorage.getItem("user")
      if (!userData) {
        router.push("/login")
        return
      }

      const currentUser = JSON.parse(userData)
      setUser(currentUser)

      // Cargar logros del usuario
      const { achievements: userAchievements } = await getAllAchievementsWithUserStatus(currentUser.id)
      setAchievements(userAchievements || [])

      setIsLoading(false)
    }

    loadData()
  }, [router])

  // Función para obtener el componente de ícono
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Heart,
      Star,
      BookOpen,
      Target,
      Medal,
      Trophy,
      Crown,
      Zap,
      Clock,
      Users,
      Award,
    }
    return icons[iconName] || Trophy
  }

  // Función para formatear la fecha del logro
  const formatEarnedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "Hace 1 día"
    if (diffDays <= 7) return `Hace ${diffDays} días`
    if (diffDays <= 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`
    return `Hace ${Math.ceil(diffDays / 30)} meses`
  }

  // Mapear las categorías basándose en el ID del logro (temporal)
  const getCategoryForAchievement = (id: number) => {
    if (id === 1) return "Inicio"
    if (id === 2 || id === 3) return "Aprendizaje"
    if (id === 4) return "Progreso"
    if (id === 5 || id === 6) return "Cursos"
    return "Maestría"
  }

  // Filtrar logros por categoría
  const filteredAchievements = selectedCategory === "Todos" 
    ? achievements 
    : achievements.filter((a) => getCategoryForAchievement(a.id) === selectedCategory)

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando logros...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <div>Cargando...</div>
  }

  const earnedAchievements = achievements.filter((a) => a.earned)
  const totalPoints = earnedAchievements.reduce((sum, a) => sum + a.points, 0)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
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
                <p className="text-sm text-cyan-600 font-medium">Mis Logros</p>
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
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Mis Logros</h2>
          <p className="text-lg text-gray-600">Explora todos tus logros y descubre qué puedes desbloquear a continuación.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-cyan-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Logros Desbloqueados</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600">{earnedAchievements.length}</div>
              <p className="text-sm text-gray-500">de {achievements.length} totales</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-cyan-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-cyan-600" />
                <span>Puntos Totales</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600">{totalPoints}</div>
              <p className="text-sm text-gray-500">puntos ganados</p>
            </CardContent>
          </Card>

          <Card className="border-2 border-cyan-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span>Progreso</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-600">
                {Math.round((earnedAchievements.length / achievements.length) * 100)}%
              </div>
              <p className="text-sm text-gray-500">completado</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Categoría</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`${
                  selectedCategory === category
                    ? "bg-cyan-600 hover:bg-cyan-700"
                    : "bg-transparent hover:bg-cyan-50"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => {
            const IconComponent = getIconComponent(achievement.icon)
            return (
              <Card
                key={achievement.id}
                className={`border-2 transition-all duration-300 hover:shadow-lg ${
                  achievement.earned
                    ? "border-cyan-200 bg-white hover:border-cyan-300"
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-lg ${
                        achievement.earned
                          ? "bg-cyan-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {achievement.earned ? (
                        <IconComponent className="h-6 w-6 text-cyan-600" />
                      ) : (
                        <Lock className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className={`text-lg ${achievement.earned ? "text-gray-900" : "text-gray-500"}`}>
                        {achievement.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`mt-1 ${getRarityColor(achievement.rarity)}`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm mb-3 ${achievement.earned ? "text-gray-600" : "text-gray-400"}`}>
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${achievement.earned ? "text-cyan-600" : "text-gray-400"}`}>
                      {achievement.points} puntos
                    </span>
                    {achievement.earned && achievement.earnedDate && (
                      <span className="text-xs text-gray-500">
                        {formatEarnedDate(achievement.earnedDate)}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600">
              ← Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
