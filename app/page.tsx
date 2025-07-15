import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Award,
  Smartphone,
  Heart,
  Users,
  Star,
  CheckCircle,
  Play,
  Shield,
  Laptop,
  Trophy,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-blue-500">
      <div className="container mx-auto px-4 py-8">
        {/* Main Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-7xl mx-auto">
          {/* Header Navigation */}
          <header className="bg-white px-8 py-6 border-b border-gray-100">
            <nav className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">CapDigital</h1>
                  <p className="text-sm text-cyan-600 font-medium">Capacidad Digital</p>
                </div>
              </div>

              <div className="flex items-center space-x-8">
                <Link
                  href="/"
                  className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full font-medium hover:bg-cyan-200 transition-colors"
                >
                  Inicio
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">
                  Contacto
                </Link>
                <Link href="/courses-info" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors">
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
          <section className="px-8 py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full opacity-20 -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-100 to-cyan-100 rounded-full opacity-20 translate-y-32 -translate-x-32"></div>

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium">
                    <Star className="h-4 w-4" />
                    <span>Plataforma #1 para Adultos Mayores</span>
                  </div>

                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                    Aplicaciones
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                      Educativas
                    </span>
                  </h1>

                  <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                    Aprende tecnología de manera fácil y divertida. Diseñado especialmente para adultos mayores que
                    quieren dominar el mundo digital paso a paso.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Comenzar Ahora
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

                {/* Stats */}
                <div className="flex items-center space-x-8 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">5,000+</div>
                    <div className="text-sm text-gray-600">Estudiantes Activos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">98%</div>
                    <div className="text-sm text-gray-600">Satisfacción</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-800">24/7</div>
                    <div className="text-sm text-gray-600">Soporte</div>
                  </div>
                </div>
              </div>

              {/* Right Illustration */}
              <div className="relative">
                <div className="relative z-10">
                  {/* Main Illustration Container */}
                  <div className="relative">
                    {/* Background Circle */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full w-80 h-80 mx-auto opacity-30"></div>

                    {/* Books Stack */}
                    <div className="relative z-20 flex justify-center items-end space-x-4 pt-16">
                      {/* Stack of Books */}
                      <div className="space-y-2">
                        <div className="w-32 h-8 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-lg shadow-lg"></div>
                        <div className="w-36 h-8 bg-gradient-to-r from-blue-400 to-blue-500 rounded-lg shadow-lg"></div>
                        <div className="w-28 h-8 bg-gradient-to-r from-teal-400 to-teal-500 rounded-lg shadow-lg"></div>
                        <div className="w-40 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-xl"></div>
                      </div>
                    </div>

                    {/* People Illustrations */}
                    <div className="absolute top-8 left-8 z-30">
                      {/* Standing Person */}
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full"></div>
                        <div className="w-12 h-20 bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg mt-2 mx-auto"></div>
                        <div className="w-8 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg mt-1 mx-auto"></div>
                        {/* Laptop */}
                        <div className="absolute -right-4 top-12 w-8 h-6 bg-gray-300 rounded-sm shadow-md"></div>
                      </div>
                    </div>

                    <div className="absolute top-4 right-12 z-30">
                      {/* Sitting Person */}
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full"></div>
                        <div className="w-10 h-16 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-lg mt-2 mx-auto"></div>
                        <div className="w-12 h-8 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg mt-1 mx-auto"></div>
                        {/* Laptop */}
                        <div className="absolute -left-2 top-10 w-8 h-6 bg-gray-300 rounded-sm shadow-md"></div>
                      </div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-16 right-4 w-4 h-4 bg-cyan-400 rounded-full opacity-60"></div>
                    <div className="absolute bottom-16 left-4 w-6 h-6 bg-blue-400 rounded-full opacity-60"></div>
                    <div className="absolute top-32 left-16 w-3 h-3 bg-teal-400 rounded-full opacity-60"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Separator Wave */}
          <div className="h-16 bg-gradient-to-r from-cyan-50 to-blue-50 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-100/50 to-blue-100/50"></div>
            <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path
                d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
                opacity=".25"
                fill="currentColor"
                className="text-white"
              ></path>
              <path
                d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
                opacity=".5"
                fill="currentColor"
                className="text-white"
              ></path>
              <path
                d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
                fill="currentColor"
                className="text-white"
              ></path>
            </svg>
          </div>

          {/* Features Section */}
          <section className="px-8 py-20 bg-white">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Award className="h-4 w-4" />
                <span>Características Principales</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">¿Por Qué Elegir CapDigital?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hemos diseñado cada detalle pensando en ti. Aprendizaje fácil, seguro y a tu propio ritmo.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-xl transition-all duration-300 border border-cyan-100">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Fácil de Usar</h3>
                <p className="text-gray-600 leading-relaxed">
                  Interfaz simple y clara, diseñada pensando en la comodidad de los adultos mayores.
                </p>
              </div>

              <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 hover:shadow-xl transition-all duration-300 border border-teal-100">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Sistema de Logros</h3>
                <p className="text-gray-600 leading-relaxed">
                  Celebra cada avance con medallas y certificados que reconocen tu progreso.
                </p>
              </div>

              <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-all duration-300 border border-blue-100">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Apoyo Constante</h3>
                <p className="text-gray-600 leading-relaxed">
                  Comunidad cálida y soporte técnico siempre disponible para ayudarte.
                </p>
              </div>
            </div>
          </section>

          {/* Separator */}
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent"></div>

          {/* Course Topics Section */}
          <section className="px-8 py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <BookOpen className="h-4 w-4" />
                <span>Nuestros Cursos</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-4">¿Qué Vas a Aprender?</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Todo lo que necesitas para ser independiente en el mundo digital
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-white p-8 rounded-2xl shadow-lg border border-cyan-100 hover:shadow-2xl transition-all duration-300 hover:border-cyan-200">
                <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 p-4 rounded-2xl w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="h-8 w-8 text-cyan-600" />
                </div>
                <h4 className="text-2xl font-semibold mb-4 text-gray-800">Domina tu Celular</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Aprende a usar WhatsApp, hacer llamadas, enviar mensajes y tomar fotos como un experto.
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-cyan-500 mr-3 flex-shrink-0" />
                    <span>Llamadas y mensajes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-cyan-500 mr-3 flex-shrink-0" />
                    <span>WhatsApp paso a paso</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-cyan-500 mr-3 flex-shrink-0" />
                    <span>Fotos y videos</span>
                  </li>
                </ul>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:border-blue-200">
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Laptop className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-2xl font-semibold mb-4 text-gray-800">Usa tu Computadora</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Navega en internet, envía emails y maneja archivos con total confianza y seguridad.
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                    <span>Navegación web</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                    <span>Correo electrónico</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                    <span>Archivos y documentos</span>
                  </li>
                </ul>
              </div>

              <div className="group bg-white p-8 rounded-2xl shadow-lg border border-teal-100 hover:shadow-2xl transition-all duration-300 hover:border-teal-200">
                <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-4 rounded-2xl w-16 h-16 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-teal-600" />
                </div>
                <h4 className="text-2xl font-semibold mb-4 text-gray-800">Mantente Seguro</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Protégete de estafas y navega con tranquilidad. Tu seguridad es nuestra prioridad.
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Contraseñas seguras</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Evitar estafas</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-teal-500 mr-3 flex-shrink-0" />
                    <span>Privacidad online</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="px-8 py-20 bg-gradient-to-br from-cyan-50 to-blue-50">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Star className="h-4 w-4" />
                <span>Testimonios</span>
              </div>
              <h3 className="text-4xl font-bold text-gray-800 mb-4">Lo Que Dicen Nuestros Estudiantes</h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Miles de adultos mayores ya han transformado su vida digital
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-cyan-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed text-lg">
                  "Nunca pensé que podría aprender a usar WhatsApp a los 72 años. Ahora hablo con mis nietos todos los
                  días. ¡Es maravilloso!"
                </p>
                <div className="flex items-center">
                  <div className="bg-cyan-100 p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Carmen Rodríguez</div>
                    <div className="text-sm text-gray-600">72 años, Jubilada</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed text-lg">
                  "Las explicaciones son tan claras que hasta yo pude entender. Ahora manejo mi email como un
                  profesional."
                </p>
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">José Martínez</div>
                    <div className="text-sm text-gray-600">68 años, Pensionado</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border border-teal-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed text-lg">
                  "Me siento más conectada con el mundo. Puedo ver fotos de mi familia y hasta hacer videollamadas."
                </p>
                <div className="flex items-center">
                  <div className="bg-teal-100 p-3 rounded-full mr-4">
                    <Users className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Ana García</div>
                    <div className="text-sm text-gray-600">75 años, Abuela</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-8 py-20 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.3)_1px,_transparent_0)] bg-[length:30px_30px]"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Trophy className="h-4 w-4" />
                <span>¡Tu Momento es Ahora!</span>
              </div>

              <h3 className="text-5xl font-bold mb-6">¡Comienza Tu Viaje Digital Hoy!</h3>
              <p className="text-xl mb-8 opacity-90 leading-relaxed max-w-2xl mx-auto">
                Únete a miles de adultos mayores que ya están disfrutando de la tecnología. Es gratis, es fácil y puedes
                empezar hoy mismo.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-cyan-600 hover:bg-gray-50 px-10 py-4 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Comenzar Mi Aprendizaje Gratis
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 text-cyan-100">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Sin costo oculto</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Cancela cuando quieras</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span>Soporte 24/7</span>
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
                <div className="flex space-x-4">
                  <div className="bg-cyan-100 p-3 rounded-lg hover:bg-cyan-200 transition-colors cursor-pointer">
                    <Users className="h-5 w-5 text-cyan-600" />
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg hover:bg-blue-200 transition-colors cursor-pointer">
                    <Heart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="bg-teal-100 p-3 rounded-lg hover:bg-teal-200 transition-colors cursor-pointer">
                    <Star className="h-5 w-5 text-teal-600" />
                  </div>
                </div>
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
