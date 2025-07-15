const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas')
  console.log('Asegúrate de que tienes configuradas:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function debugCourses() {
  console.log('🔍 DEBUGGING TODOS LOS CURSOS EN LA BASE DE DATOS')
  console.log('================================================\n')

  try {
    // 1. Verificar conexión a Supabase
    console.log('1. Verificando conexión a Supabase...')
    const { data: testData, error: testError } = await supabase
      .from('courses')
      .select('count')
      .limit(1)
    
    if (testError) {
      throw new Error(`Error de conexión: ${testError.message}`)
    }
    console.log('✅ Conexión exitosa a Supabase\n')

    // 2. Obtener todos los cursos
    console.log('2. Obteniendo todos los cursos...')
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .order('order_index')

    if (coursesError) {
      throw new Error(`Error al obtener cursos: ${coursesError.message}`)
    }

    console.log(`✅ Encontrados ${courses.length} cursos en total\n`)

    // 3. Mostrar información detallada de cada curso
    console.log('3. INFORMACIÓN DETALLADA DE CADA CURSO:')
    console.log('=====================================\n')

    for (const course of courses) {
      console.log(`📚 CURSO ${course.id}: ${course.title}`)
      console.log(`   Descripción: ${course.description}`)
      console.log(`   Lecciones: ${course.lessons_count}`)
      console.log(`   Duración: ${course.duration}`)
      console.log(`   Dificultad: ${course.difficulty}`)
      console.log(`   Ícono: ${course.icon}`)
      console.log(`   Color: ${course.color}`)
      console.log(`   Orden: ${course.order_index}`)
      console.log(`   Activo: ${course.is_active ? '✅' : '❌'}`)
      console.log(`   Creado: ${course.created_at}`)

      // Obtener lecciones para este curso
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', course.id)
        .order('order_index')

      if (lessonsError) {
        console.log(`   ❌ Error al obtener lecciones: ${lessonsError.message}`)
      } else {
        console.log(`   📖 Lecciones encontradas: ${lessons.length}`)
        
        if (lessons.length > 0) {
          console.log(`   📋 Lista de lecciones:`)
          lessons.forEach((lesson, index) => {
            console.log(`      ${index + 1}. ${lesson.title} (ID: ${lesson.id})`)
            console.log(`         Duración: ${lesson.duration}`)
            console.log(`         Activa: ${lesson.is_active ? '✅' : '❌'}`)
            console.log(`         Orden: ${lesson.order_index}`)
          })
        }
      }
      console.log('   ' + '-'.repeat(50))
    }

    // 4. Verificar cursos activos vs inactivos
    console.log('\n4. RESUMEN DE ESTADO DE CURSOS:')
    console.log('===============================')
    
    const activeCourses = courses.filter(c => c.is_active)
    const inactiveCourses = courses.filter(c => !c.is_active)
    
    console.log(`✅ Cursos activos: ${activeCourses.length}`)
    console.log(`❌ Cursos inactivos: ${inactiveCourses.length}`)

    if (activeCourses.length > 0) {
      console.log('\n📚 CURSOS ACTIVOS:')
      activeCourses.forEach(course => {
        console.log(`   - ${course.title} (ID: ${course.id})`)
      })
    }

    if (inactiveCourses.length > 0) {
      console.log('\n🚫 CURSOS INACTIVOS:')
      inactiveCourses.forEach(course => {
        console.log(`   - ${course.title} (ID: ${course.id})`)
      })
    }

    // 5. Verificar integridad de datos
    console.log('\n5. VERIFICACIÓN DE INTEGRIDAD:')
    console.log('==============================')
    
    let hasIssues = false
    
    for (const course of courses) {
      const { data: lessons } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', course.id)
      
      const actualLessons = lessons ? lessons.length : 0
      
      if (actualLessons !== course.lessons_count) {
        console.log(`⚠️  INCONSISTENCIA en curso "${course.title}":`)
        console.log(`    Lecciones esperadas: ${course.lessons_count}`)
        console.log(`    Lecciones reales: ${actualLessons}`)
        hasIssues = true
      }
    }
    
    if (!hasIssues) {
      console.log('✅ Todos los cursos tienen integridad de datos correcta')
    }

    // 6. Estadísticas generales
    console.log('\n6. ESTADÍSTICAS GENERALES:')
    console.log('=========================')
    
    const totalLessons = courses.reduce((sum, course) => sum + course.lessons_count, 0)
    const avgLessonsPerCourse = totalLessons / courses.length
    
    console.log(`📊 Total de cursos: ${courses.length}`)
    console.log(`📖 Total de lecciones: ${totalLessons}`)
    console.log(`📈 Promedio de lecciones por curso: ${avgLessonsPerCourse.toFixed(1)}`)
    
    const difficulties = courses.reduce((acc, course) => {
      acc[course.difficulty] = (acc[course.difficulty] || 0) + 1
      return acc
    }, {})
    
    console.log(`🎯 Distribución por dificultad:`)
    Object.entries(difficulties).forEach(([difficulty, count]) => {
      console.log(`   - ${difficulty}: ${count} cursos`)
    })

    console.log('\n🎉 DEBUG COMPLETADO EXITOSAMENTE')
    
  } catch (error) {
    console.error('❌ Error durante el debug:', error.message)
    process.exit(1)
  }
}

// Ejecutar el debug
debugCourses()
