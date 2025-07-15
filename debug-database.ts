// Debug para probar la vinculación de lecciones y cursos
import { linkLessonsAndCourses } from './lib/database-setup'

// Función para ejecutar debug
async function debugDatabase() {
  console.log('🔍 Ejecutando debug de la base de datos...')
  
  try {
    const result = await linkLessonsAndCourses()
    
    if (result.success) {
      console.log('\n✅ Debug completado exitosamente')
      console.log(`📊 Resumen:`)
      console.log(`   - Cursos: ${result.courses}`)
      console.log(`   - Lecciones: ${result.lessons}`)
      console.log(`   - Inconsistencias: ${result.inconsistencies?.length || 0}`)
      console.log(`   - Lecciones huérfanas: ${result.orphanLessons}`)
      
      if (result.inconsistencies && result.inconsistencies.length > 0) {
        console.log('\n⚠️  Cursos con problemas:')
        result.inconsistencies.forEach(inc => {
          console.log(`   - Curso ${inc.courseId}: ${inc.courseName}`)
          console.log(`     Esperadas: ${inc.expected}, Encontradas: ${inc.actual}`)
        })
      }
      
    } else {
      console.error('❌ Error en el debug:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Error ejecutando debug:', error)
  }
}

// Ejecutar debug
debugDatabase()

export default debugDatabase
