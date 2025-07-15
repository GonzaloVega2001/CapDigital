import { debugUserPassword } from '@/lib/supabase'

export async function testUserPassword(email: string) {
  console.log('Testing user password for:', email)
  const result = await debugUserPassword(email)
  console.log('Result:', result)
  return result
}

// Función para probar en la consola del navegador
if (typeof window !== 'undefined') {
  (window as any).testUserPassword = testUserPassword
}
