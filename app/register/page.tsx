"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BookOpen, Eye, EyeOff } from "lucide-react"
import { signUp } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (formData.name && formData.email && formData.password) {
        const { user, error } = await signUp(
          formData.email,
          formData.password,
          formData.name,
          formData.age ? Number.parseInt(formData.age) : undefined,
        )

        if (error) {
          toast({
            variant: "destructive",
            title: "Error al registrarse",
            description: "Ya existe una cuenta con este email o hubo un problema.",
          })
          return
        }

        if (user) {
          // Guardar usuario en localStorage para la sesión
          localStorage.setItem("user", JSON.stringify(user))

          toast({
            variant: "success",
            title: "¡Bienvenido a CapDigital! 🎉",
            description: "Tu cuenta ha sido creada exitosamente. ¡Has desbloqueado tu primer logro!",
          })

          router.push("/dashboard")
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un problema al crear tu cuenta. Inténtalo de nuevo.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-blue-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">CapDigital</h1>
              <p className="text-sm text-cyan-100 font-medium">Capacidad Digital</p>
            </div>
          </Link>
        </div>

        <Card className="border-2 border-cyan-200 shadow-2xl bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Crear Cuenta</CardTitle>
            <CardDescription className="text-base text-gray-600">
              Únete a nuestra comunidad de aprendizaje digital
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-medium text-gray-700">
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tu nombre completo"
                  className="text-base py-3 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium text-gray-700">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="text-base py-3 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-base font-medium text-gray-700">
                  Edad (Opcional)
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Tu edad"
                  className="text-base py-3 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                  min="18"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-medium text-gray-700">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Crea una contraseña segura"
                    className="text-base py-3 pr-12 border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-lg py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-lg"
              >
                {isLoading ? "Creando cuenta..." : "Crear Mi Cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-base text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-cyan-600 hover:text-cyan-700 text-base">
                ← Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
