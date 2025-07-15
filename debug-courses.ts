import { supabase } from './lib/supabase'

interface Course {
  id: number
  title: string
  description: string
  lessons_count: number
  duration: string
  difficulty: string
  icon: string
  color: string
  order_index: number
  is_active: boolean
  created_at: string
}

interface Lesson {
  id: number
  course_id: number
  title: string
  description: string
  content: string
  duration: string
  order_index: number
  video_url: string | null
  is_active: boolean
  created_at: string
}

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

    console.log(`✅ Encontrados ${courses?.length || 0} cursos en total\n`)

    if (!courses || courses.length === 0) {
      console.log('⚠️  No se encontraron cursos en la base de datos')
      console.log('¿Necesitas ejecutar el script de seed data?')
      return
    }

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
        console.log(`   📖 Lecciones encontradas: ${lessons?.length || 0}`)
        
        if (lessons && lessons.length > 0) {
          console.log(`   📋 Lista de lecciones:`)
          lessons.forEach((lesson: Lesson, index: number) => {
            console.log(`      ${index + 1}. ${lesson.title} (ID: ${lesson.id})`)
            console.log(`         Duración: ${lesson.duration}`)
            console.log(`         Activa: ${lesson.is_active ? '✅' : '❌'}`)
            console.log(`         Orden: ${lesson.order_index}`)
            if (lesson.video_url) {
              console.log(`         Video: ${lesson.video_url}`)
            }
          })
        }
      }
      
      // Verificar progreso de usuarios en este curso
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('user_id, lesson_id')
        .in('lesson_id', lessons?.map(l => l.id) || [])
      
      if (!progressError && progressData) {
        const uniqueUsers = new Set(progressData.map(p => p.user_id)).size
        console.log(`   👥 Usuarios con progreso: ${uniqueUsers}`)
        console.log(`   ✅ Lecciones completadas: ${progressData.length}`)
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
    }, {} as Record<string, number>)
    
    console.log(`🎯 Distribución por dificultad:`)
    Object.entries(difficulties).forEach(([difficulty, count]) => {
      console.log(`   - ${difficulty}: ${count} cursos`)
    })

    // 7. Verificar usuarios y progreso
    console.log('\n7. INFORMACIÓN DE USUARIOS Y PROGRESO:')
    console.log('====================================')
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, created_at')
    
    if (usersError) {
      console.log(`❌ Error al obtener usuarios: ${usersError.message}`)
    } else {
      console.log(`👥 Total de usuarios registrados: ${users?.length || 0}`)
      
      if (users && users.length > 0) {
        console.log(`📋 Lista de usuarios:`)
        users.forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.name} (${user.email})`)
        })
      }
    }

    // 8. Verificar logros
    console.log('\n8. INFORMACIÓN DE LOGROS:')
    console.log('=========================')
    
    const { data: achievements, error: achievementsError } = await supabase
      .from('achievements')
      .select('*')
      .order('id')
    
    if (achievementsError) {
      console.log(`❌ Error al obtener logros: ${achievementsError.message}`)
    } else {
      console.log(`🏆 Total de logros disponibles: ${achievements?.length || 0}`)
      
      if (achievements && achievements.length > 0) {
        console.log(`📋 Lista de logros:`)
        achievements.forEach((achievement, index) => {
          console.log(`   ${index + 1}. ${achievement.title} (${achievement.points} puntos)`)
          console.log(`      ${achievement.description}`)
          console.log(`      Rareza: ${achievement.rarity}`)
        })
      }
    }

    console.log('\n🎉 DEBUG COMPLETADO EXITOSAMENTE')
    
  } catch (error) {
    console.error('❌ Error durante el debug:', error instanceof Error ? error.message : 'Error desconocido')
    console.error('Stack trace:', error)
  }
}

// Ejecutar el debug
debugCourses().catch(console.error)

export default debugCourses
