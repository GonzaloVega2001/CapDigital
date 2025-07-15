import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Smartphone,
  Laptop,
  Wifi,
  Shield,
  MessageCircle,
  Mail,
  Clock,
  Star,
  CheckCircle,
  Play,
  Award,
  Target,
  Zap,
} from "lucide-react"

export default function CoursesInfoPage() {
  const courses = [
    {
      id: 1,
      title: "Fundamentos del Celular",
      description: "Aprende lo básico para usar tu smartphone de manera efectiva y segura",
      icon: Smartphone,
      lessons: 8,
      duration: "2-3 horas",
      difficulty: "Principiante",
      students: "1,200+",
      rating: 4.9,
      topics: ["Encender y apagar", "Llamadas básicas", "Mensajes de texto", "Contactos", "Cámara", "Configuración"],
      features: ["Videos paso a paso", "Ejercicios prácticos", "Soporte personalizado"],
      color: "cyan",
    },
    {
      id: 2,
      title: "Navegación en Internet",
      description: "Descubre cómo navegar de forma segura en la web y encontrar información útil",
      icon: Wifi,
      lessons: 10,
      duration: "3-4 horas",
      difficulty: "Principiante",
      students: "980+",
      rating: 4.8,
      topics: ["Navegadores web", "Búsquedas efectivas", "Sitios web seguros", "Descargas", "Favoritos", "Historia"],
      features: ["Navegación guiada", "Sitios recomendados", "Tips de seguridad"],
      color: "blue",
    },
    {
      id: 3,
      title: "Uso de la Computadora",
      description: "Domina las funciones básicas de tu PC o laptop para el día a día",
      icon: Laptop,
      lessons: 12,
      duration: "4-5 horas",
      difficulty: "Principiante",
      students: "750+",
      rating: 4.7,
      topics: ["Escritorio", "Archivos y carpetas", "Programas básicos", "Configuración", "Mantenimiento", "Atajos"],
      features: ["Simulador virtual", "Ejercicios interactivos", "Guías descargables"],
      color: "teal",
    },
    {
      id: 4,
      title: "WhatsApp y Mensajería",
      description: "Comunícate con familia y amigos usando WhatsApp y otras apps de mensajería",
      icon: MessageCircle,
      lessons: 6,
      duration: "2 horas",
      difficulty: "Principiante",
      students: "1,500+",
      rating: 4.9,
      topics: ["Instalación", "Contactos", "Mensajes", "Grupos", "Llamadas", "Estados"],
      features: ["Práctica en vivo", "Configuración de privacidad", "Trucos útiles"],
      color: "green",
    },
    {
      id: 5,
      title: "Correo Electrónico",
      description: "Aprende a enviar y recibir emails de forma profesional y organizada",
      icon: Mail,
      lessons: 8,
      duration: "3 horas",
      difficulty: "Intermedio",
      students: "650+",
      rating: 4.6,
      topics: ["Crear cuenta", "Enviar emails", "Adjuntos", "Organización", "Filtros", "Seguridad"],
      features: ["Plantillas de email", "Organización avanzada", "Etiqueta digital"],
      color: "purple",
    },
    {
      id: 6,
      title: "Seguridad Digital",
      description: "Protégete de estafas y mantén tu información personal segura en internet",
      icon: Shield,
      lessons: 10,
      duration: "3-4 horas",
      difficulty: "Intermedio",
      students: "420+",
      rating: 4.8,
      topics: ["Contraseñas seguras", "Estafas comunes", "Privacidad", "Antivirus", "Copias de seguridad", "Phishing"],
      features: ["Casos reales", "Herramientas de seguridad", "Alertas personalizadas"],
      color: "red",
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

  const getColorClasses = (color: string) => {
    const colors = {
      cyan: "from-cyan-100 to-cyan-200 text-cyan-600",
      blue: "from-blue-100 to-blue-200 text-blue-600",
      teal: "from-teal-100 to-teal-200 text-teal-600",
      green: "from-green-100 to-green-200 text-green-600",
      purple: "from-purple-100 to-purple-200 text-purple-600",
      red: "from-red-100 to-red-200 text-red-600",
    }
    return colors[color as keyof typeof colors] || colors.cyan
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-blue-500">
      <div className="container mx-auto px-4 py-8">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-7xl mx-auto">
          {/* Header Navigation */}
          <header className="bg-white px-8 py-6 border-b border-gray-100">
            <nav className="flex justify-between items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">CapDigital</h1>
                  <p className="text-sm text-cyan-600 font-medium">Capacidad Digital</p>
                </div>
              </Link>

              <div className="flex items-center space-x-8">
                <Link href="/" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">
                  Inicio
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">
                  Acerca de
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">
                  Contacto
                </Link>
                <Link
                  href="/courses-info"
                  className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full font-medium hover:bg-cyan-200 transition-colors"
                >
                  Cursos
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 bg-transparent">
                    Iniciar Sesión
                  </Button>
                </Link>
              </div>
            </nav>
          </header>

          {/* Hero Section */}
          <section className="px-8 py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full opacity-20 -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-100 to-cyan-100 rounded-full opacity-20 translate-y-32 -translate-x-32"></div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BookOpen className="h-4 w-4" />
                <span>Catálogo Completo de Cursos</span>
              </div>

              <h1 className="text-5xl font-bold text-gray-800 mb-6">
                Nuestros{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Cursos</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Descubre todos los cursos disponibles en CapDigital. Cada uno diseñado especialmente para adultos
                mayores que quieren dominar la tecnología paso a paso.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Comenzar Ahora Gratis
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-full bg-transparent"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Ver Demo
                </Button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="px-8 py-12 bg-white border-b border-gray-100">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-cyan-600 mb-2">6</div>
                  <div className="text-gray-600">Cursos Disponibles</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">54</div>
                  <div className="text-gray-600">Lecciones Totales</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-teal-600 mb-2">5,000+</div>
                  <div className="text-gray-600">Estudiantes Activos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
                  <div className="text-gray-600">Calificación Promedio</div>
                </div>
              </div>
            </div>
          </section>

          {/* Courses Grid */}
          <section className="px-8 py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Todos Nuestros Cursos</h2>
                <p className="text-lg text-gray-600">
                  Cada curso incluye videos, ejercicios prácticos y soporte personalizado
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => {
                  const IconComponent = course.icon
                  return (
                    <Card
                      key={course.id}
                      className="border-2 border-cyan-200 hover:border-cyan-300 hover:shadow-xl transition-all duration-300 group"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-4 rounded-2xl bg-gradient-to-br ${getColorClasses(course.color)}`}>
                            <IconComponent className="h-8 w-8" />
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                            </div>
                            <div className="text-xs text-gray-500">{course.students} estudiantes</div>
                          </div>
                        </div>

                        <CardTitle className="text-xl group-hover:text-cyan-600 transition-colors">
                          {course.title}
                        </CardTitle>
                        <CardDescription className="text-base leading-relaxed">{course.description}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-6">
                          {/* Course Info */}
                          <div className="flex flex-wrap gap-2">
                            <Badge className={getDifficultyColor(course.difficulty)}>{course.difficulty}</Badge>
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{course.lessons} lecciones</span>
                            </Badge>
                            <Badge variant="outline" className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{course.duration}</span>
                            </Badge>
                          </div>

                          {/* Topics */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-3">Lo que aprenderás:</p>
                            <div className="grid grid-cols-2 gap-2">
                              {course.topics.slice(0, 4).map((topic, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                  <span className="text-xs text-gray-600">{topic}</span>
                                </div>
                              ))}
                            </div>
                            {course.topics.length > 4 && (
                              <p className="text-xs text-gray-500 mt-2">+{course.topics.length - 4} temas más</p>
                            )}
                          </div>

                          {/* Features */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-3">Incluye:</p>
                            <div className="space-y-2">
                              {course.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Zap className="h-3 w-3 text-cyan-500 flex-shrink-0" />
                                  <span className="text-xs text-gray-600">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action Button */}
                          <Link href="/register">
                            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 group-hover:shadow-lg transition-all duration-300">
                              Comenzar Curso Gratis
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Learning Path */}
          <section className="px-8 py-16 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Target className="h-4 w-4" />
                  <span>Ruta de Aprendizaje Recomendada</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">Tu Camino al Éxito Digital</h3>
                <p className="text-lg text-gray-600">
                  Sigue esta secuencia para obtener los mejores resultados en tu aprendizaje
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 p-6 rounded-full w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-bold text-cyan-600">1</span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Fundamentos</h4>
                  <p className="text-gray-600 mb-4">Comienza con celular e internet básico</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>• Fundamentos del Celular</p>
                    <p>• Navegación en Internet</p>
                  </div>
                </div>

                <div className="text-center group">
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-full w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-bold text-blue-600">2</span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Comunicación</h4>
                  <p className="text-gray-600 mb-4">Aprende a comunicarte digitalmente</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>• WhatsApp y Mensajería</p>
                    <p>• Correo Electrónico</p>
                  </div>
                </div>

                <div className="text-center group">
                  <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-6 rounded-full w-20 h-20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-bold text-teal-600">3</span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">Avanzado</h4>
                  <p className="text-gray-600 mb-4">Domina herramientas más complejas</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>• Uso de Computadora</p>
                    <p>• Seguridad Digital</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-8 py-16 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.3)_1px,_transparent_0)] bg-[length:30px_30px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Award className="h-4 w-4" />
                <span>¡Comienza Tu Transformación Digital!</span>
              </div>

              <h3 className="text-4xl font-bold mb-6">¿Listo Para Comenzar?</h3>
              <p className="text-xl mb-8 opacity-90 leading-relaxed max-w-2xl mx-auto">
                Únete a miles de adultos mayores que ya han transformado su relación con la tecnología. Es gratis, fácil
                y puedes empezar ahora mismo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-cyan-600 hover:bg-gray-50 px-10 py-4 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Registrarse Gratis Ahora
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 text-cyan-100">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>100% Gratuito</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Sin experiencia necesaria</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Soporte personalizado</span>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="px-8 py-16 bg-gray-50 border-t border-gray-200">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div className="col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl shadow-lg">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-gray-800">CapDigital</span>
                    <p className="text-sm text-cyan-600 font-medium">Capacidad Digital</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Empoderando a los adultos mayores a través de la educación digital. Aprender tecnología nunca fue tan
                  fácil y accesible.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-6">Cursos</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="hover:text-cyan-600 transition-colors cursor-pointer">Fundamentos del Celular</li>
                  <li className="hover:text-cyan-600 transition-colors cursor-pointer">Navegación en Internet</li>
                  <li className="hover:text-cyan-600 transition-colors cursor-pointer">Uso de Computadora</li>
                  <li className="hover:text-cyan-600 transition-colors cursor-pointer">Seguridad Digital</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-6">Soporte</h4>
                <ul className="space-y-3 text-gray-600">
                  <li className="hover:text-cyan-600 transition-colors cursor-pointer">Centro de Ayuda</li>
                  <li className="hover:text-cyan-600 transition-colors cursor-pointer">Contacto</li>
                  <li className="hover:text-cyan-600 transition-colors cursor-pointer">Preguntas Frecuentes</li>
                  <li className="hover:text-cyan-600 transition-colors cursor-pointer">Comunidad</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-8 text-center text-gray-600">
              <p>&copy; 2024 CapDigital. Todos los derechos reservados. Hecho con ❤️ para adultos mayores.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
