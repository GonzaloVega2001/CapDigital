import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Mail, Phone, MapPin, Clock, MessageCircle, HeadphonesIcon, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
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
                <Link
                  href="/contact"
                  className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full font-medium hover:bg-cyan-200 transition-colors"
                >
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
          <section className="px-8 py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full opacity-20 -translate-y-48 translate-x-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-100 to-cyan-100 rounded-full opacity-20 translate-y-32 -translate-x-32"></div>

            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center space-x-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <MessageCircle className="h-4 w-4" />
                <span>Estamos Aquí Para Ayudarte</span>
              </div>

              <h1 className="text-5xl font-bold text-gray-800 mb-6">
                ¿Necesitas{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Ayuda?</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Nuestro equipo está dedicado a apoyarte en tu viaje de aprendizaje digital. No dudes en contactarnos,
                estamos aquí para ti.
              </p>
            </div>
          </section>

          {/* Contact Methods */}
          <section className="px-8 py-16 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Múltiples Formas de Contactarnos</h2>
                <p className="text-lg text-gray-600">Elige la opción que más te convenga</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="border-2 border-cyan-200 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-to-br from-cyan-100 to-cyan-200 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Phone className="h-8 w-8 text-cyan-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Teléfono</h3>
                    <p className="text-gray-600 mb-4">Llámanos directamente para soporte inmediato</p>
                    <div className="space-y-2">
                      <p className="font-semibold text-cyan-600 text-lg">+1 (555) 123-4567</p>
                      <p className="text-sm text-gray-500">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-blue-200 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Email</h3>
                    <p className="text-gray-600 mb-4">Envíanos un mensaje detallado</p>
                    <div className="space-y-2">
                      <p className="font-semibold text-blue-600 text-lg">soporte@capdigital.com</p>
                      <p className="text-sm text-gray-500">Respuesta en 24 horas</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-teal-200 hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8 text-center">
                    <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-4 rounded-2xl w-16 h-16 mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <HeadphonesIcon className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Chat en Vivo</h3>
                    <p className="text-gray-600 mb-4">Soporte instantáneo online</p>
                    <div className="space-y-2">
                      <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600">
                        Iniciar Chat
                      </Button>
                      <p className="text-sm text-gray-500">Disponible 24/7</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Contact Form & Info */}
          <section className="px-8 py-16 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div>
                  <div className="mb-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">Envíanos un Mensaje</h3>
                    <p className="text-lg text-gray-600">
                      Completa el formulario y nos pondremos en contacto contigo lo antes posible.
                    </p>
                  </div>

                  <Card className="border-2 border-cyan-200 shadow-lg">
                    <CardContent className="p-8">
                      <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName" className="text-base font-medium text-gray-700">
                              Nombre
                            </Label>
                            <Input
                              id="firstName"
                              placeholder="Tu nombre"
                              className="mt-2 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName" className="text-base font-medium text-gray-700">
                              Apellido
                            </Label>
                            <Input
                              id="lastName"
                              placeholder="Tu apellido"
                              className="mt-2 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-base font-medium text-gray-700">
                            Correo Electrónico
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="tu@email.com"
                            className="mt-2 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone" className="text-base font-medium text-gray-700">
                            Teléfono (Opcional)
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Tu número de teléfono"
                            className="mt-2 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                          />
                        </div>

                        <div>
                          <Label htmlFor="subject" className="text-base font-medium text-gray-700">
                            Asunto
                          </Label>
                          <Input
                            id="subject"
                            placeholder="¿En qué podemos ayudarte?"
                            className="mt-2 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                          />
                        </div>

                        <div>
                          <Label htmlFor="message" className="text-base font-medium text-gray-700">
                            Mensaje
                          </Label>
                          <Textarea
                            id="message"
                            rows={5}
                            placeholder="Cuéntanos más detalles sobre tu consulta..."
                            className="mt-2 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-lg py-3"
                        >
                          <Send className="h-5 w-5 mr-2" />
                          Enviar Mensaje
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Info & FAQ */}
                <div className="space-y-8">
                  {/* Office Info */}
                  <Card className="border-2 border-blue-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <span>Nuestra Oficina</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-gray-800">Dirección:</p>
                          <p className="text-gray-600">Av. Tecnología 123, Piso 5</p>
                          <p className="text-gray-600">Ciudad Digital, CD 12345</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-semibold text-gray-800">Horarios de Atención:</p>
                            <p className="text-gray-600">Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                            <p className="text-gray-600">Sábados: 9:00 AM - 2:00 PM</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* FAQ */}
                  <Card className="border-2 border-teal-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageCircle className="h-5 w-5 text-teal-600" />
                        <span>Preguntas Frecuentes</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="font-semibold text-gray-800 mb-2">¿Los cursos son gratuitos?</p>
                          <p className="text-gray-600 text-sm">
                            Sí, todos nuestros cursos básicos son completamente gratuitos para adultos mayores.
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 mb-2">¿Necesito experiencia previa?</p>
                          <p className="text-gray-600 text-sm">
                            No, nuestros cursos están diseñados para principiantes absolutos.
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 mb-2">¿Hay soporte técnico?</p>
                          <p className="text-gray-600 text-sm">
                            Sí, ofrecemos soporte técnico completo durante tu aprendizaje.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Support Features */}
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-6 text-white">
                    <h4 className="text-xl font-bold mb-4">¿Por Qué Contactarnos?</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-cyan-200" />
                        <span>Soporte personalizado para adultos mayores</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-cyan-200" />
                        <span>Respuestas rápidas y comprensibles</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-cyan-200" />
                        <span>Equipo especializado en educación digital</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-cyan-200" />
                        <span>Disponible en múltiples canales</span>
                      </div>
                    </div>
                  </div>
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
