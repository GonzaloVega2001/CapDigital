import { supabase } from './supabase'

// Función para ejecutar scripts SQL en Supabase
export async function executeSQLScript(sqlScript: string) {
  try {
    // Dividir el script en statements individuales
    const statements = sqlScript
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'))

    const results = []
    
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Ejecutando:', statement.substring(0, 100) + '...')
        
        try {
          const { data, error } = await supabase.rpc('execute_sql', {
            sql_query: statement
          })
          
          if (error) {
            console.error('Error ejecutando statement:', error)
            results.push({ statement, error })
          } else {
            console.log('✓ Statement ejecutado correctamente')
            results.push({ statement, success: true, data })
          }
        } catch (err) {
          console.error('Error en statement:', err)
          results.push({ statement, error: err })
        }
      }
    }
    
    return results
  } catch (error) {
    console.error('Error ejecutando script SQL:', error)
    return [{ error }]
  }
}

// Función para vincular lecciones y cursos
export async function linkLessonsAndCourses() {
  try {
    console.log('=== VINCULANDO LECCIONES Y CURSOS ===')
    
    // 1. Verificar cursos existentes
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .order('id')
    
    if (coursesError) {
      console.error('Error obteniendo cursos:', coursesError)
      return { success: false, error: coursesError }
    }
    
    console.log('Cursos encontrados:', courses?.length || 0)
    courses?.forEach(course => {
      console.log(`- Curso ${course.id}: ${course.title} (${course.lessons_count} lecciones)`)
    })
    
    // 2. Verificar lecciones existentes
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('*')
      .order('course_id', { ascending: true })
      .order('order_index', { ascending: true })
    
    if (lessonsError) {
      console.error('Error obteniendo lecciones:', lessonsError)
      return { success: false, error: lessonsError }
    }
    
    console.log('Lecciones encontradas:', lessons?.length || 0)
    
    // 3. Agrupar lecciones por curso
    const lessonsByCourse = lessons?.reduce((acc: any, lesson) => {
      if (!acc[lesson.course_id]) {
        acc[lesson.course_id] = []
      }
      acc[lesson.course_id].push(lesson)
      return acc
    }, {}) || {}
    
    console.log('\n=== LECCIONES POR CURSO ===')
    Object.keys(lessonsByCourse).forEach(courseId => {
      const courseLessons = lessonsByCourse[courseId]
      const course = courses?.find(c => c.id === parseInt(courseId))
      console.log(`\nCurso ${courseId}: ${course?.title || 'Desconocido'}`)
      console.log(`Lecciones encontradas: ${courseLessons.length}`)
      console.log(`Lecciones esperadas: ${course?.lessons_count || 0}`)
      
      courseLessons.forEach((lesson: any, index: number) => {
        console.log(`  ${index + 1}. ${lesson.title} (ID: ${lesson.id}, Order: ${lesson.order_index})`)
      })
    })
    
    // 4. Verificar consistencia
    const inconsistencies: Array<{
      courseId: number
      courseName: string
      expected: number
      actual: number
    }> = []
    courses?.forEach(course => {
      const courseLessons = lessonsByCourse[course.id] || []
      if (courseLessons.length !== course.lessons_count) {
        inconsistencies.push({
          courseId: course.id,
          courseName: course.title,
          expected: course.lessons_count,
          actual: courseLessons.length
        })
      }
    })
    
    if (inconsistencies.length > 0) {
      console.log('\n=== INCONSISTENCIAS ENCONTRADAS ===')
      inconsistencies.forEach(inc => {
        console.log(`⚠️  Curso ${inc.courseId} (${inc.courseName}): Esperadas ${inc.expected}, Encontradas ${inc.actual}`)
      })
    } else {
      console.log('\n✅ Todos los cursos tienen el número correcto de lecciones')
    }
    
    // 5. Verificar relaciones de clave foránea
    console.log('\n=== VERIFICANDO RELACIONES ===')
    const { data: orphanLessons, error: orphanError } = await supabase
      .from('lessons')
      .select('id, title, course_id')
      .not('course_id', 'in', `(${courses?.map(c => c.id).join(',') || '0'})`)
    
    if (orphanError) {
      console.error('Error verificando lecciones huérfanas:', orphanError)
    } else if (orphanLessons && orphanLessons.length > 0) {
      console.log('⚠️  Lecciones huérfanas encontradas:')
      orphanLessons.forEach(lesson => {
        console.log(`  - Lección ${lesson.id}: ${lesson.title} (curso_id: ${lesson.course_id})`)
      })
    } else {
      console.log('✅ No se encontraron lecciones huérfanas')
    }
    
    return {
      success: true,
      courses: courses?.length || 0,
      lessons: lessons?.length || 0,
      lessonsByCourse,
      inconsistencies,
      orphanLessons: orphanLessons?.length || 0
    }
    
  } catch (error) {
    console.error('Error vinculando lecciones y cursos:', error)
    return { success: false, error }
  }
}

// Función para crear lecciones faltantes
export async function createMissingLessons() {
  try {
    console.log('=== CREANDO LECCIONES FALTANTES ===')
    
    // Primero ejecutar la vinculación para ver qué falta
    const linkResult = await linkLessonsAndCourses()
    
    if (!linkResult.success) {
      return linkResult
    }
    
    // Si hay inconsistencias, mostrar qué cursos necesitan lecciones
    if (linkResult.inconsistencies && linkResult.inconsistencies.length > 0) {
      console.log('\nCursos que necesitan lecciones:')
      linkResult.inconsistencies.forEach((inc: any) => {
        console.log(`- Curso ${inc.courseId}: Faltan ${inc.expected - inc.actual} lecciones`)
      })
      
      console.log('\n📝 Para crear las lecciones faltantes, ejecuta el script SQL:')
      console.log('   scripts/03-complete-lessons.sql')
      console.log('\nPuedes ejecutarlo en el editor SQL de Supabase o usando la función executeSQLScript')
      
      return {
        success: true,
        message: 'Lecciones faltantes identificadas. Ejecuta el script SQL para crearlas.',
        inconsistencies: linkResult.inconsistencies
      }
    }
    
    return {
      success: true,
      message: 'Todos los cursos tienen las lecciones correctas',
      courses: linkResult.courses,
      lessons: linkResult.lessons
    }
    
  } catch (error) {
    console.error('Error creando lecciones faltantes:', error)
    return { success: false, error }
  }
}

// Función para reparar vínculos rotos
export async function repairBrokenLinks() {
  try {
    console.log('=== REPARANDO VÍNCULOS ROTOS ===')
    
    // 1. Buscar lecciones con course_id inválido
    const { data: allCourses } = await supabase
      .from('courses')
      .select('id')
    
    const validCourseIds = allCourses?.map(c => c.id) || []
    
    const { data: brokenLessons, error: brokenError } = await supabase
      .from('lessons')
      .select('id, title, course_id')
      .not('course_id', 'in', `(${validCourseIds.join(',') || '0'})`)
    
    if (brokenError) {
      console.error('Error buscando lecciones rotas:', brokenError)
      return { success: false, error: brokenError }
    }
    
    if (brokenLessons && brokenLessons.length > 0) {
      console.log(`Se encontraron ${brokenLessons.length} lecciones con vínculos rotos:`)
      brokenLessons.forEach(lesson => {
        console.log(`- Lección ${lesson.id}: ${lesson.title} (course_id inválido: ${lesson.course_id})`)
      })
      
      // Opcionalmente, podrías eliminar estas lecciones o reasignarlas
      console.log('\n⚠️  Estas lecciones deben ser eliminadas o reasignadas a cursos válidos')
      
      return {
        success: true,
        brokenLessons: brokenLessons.length,
        lessons: brokenLessons
      }
    }
    
    // 2. Buscar progreso de usuario con lesson_id inválido
    const { data: allLessons } = await supabase
      .from('lessons')
      .select('id')
    
    const validLessonIds = allLessons?.map(l => l.id) || []
    
    const { data: brokenProgress, error: progressError } = await supabase
      .from('user_progress')
      .select('id, user_id, lesson_id')
      .not('lesson_id', 'in', `(${validLessonIds.join(',') || '0'})`)
    
    if (progressError) {
      console.error('Error buscando progreso roto:', progressError)
    } else if (brokenProgress && brokenProgress.length > 0) {
      console.log(`\nSe encontraron ${brokenProgress.length} registros de progreso con lesson_id inválido:`)
      brokenProgress.forEach(progress => {
        console.log(`- Progreso ${progress.id}: Usuario ${progress.user_id}, Lección inválida ${progress.lesson_id}`)
      })
      
      console.log('\n⚠️  Estos registros de progreso deben ser eliminados')
      
      return {
        success: true,
        brokenLessons: brokenLessons?.length || 0,
        brokenProgress: brokenProgress.length,
        lessons: brokenLessons || [],
        progress: brokenProgress
      }
    }
    
    console.log('✅ No se encontraron vínculos rotos')
    return {
      success: true,
      brokenLessons: 0,
      brokenProgress: 0,
      message: 'Todos los vínculos están correctos'
    }
    
  } catch (error) {
    console.error('Error reparando vínculos rotos:', error)
    return { success: false, error }
  }
}

// Función principal para vincular todo
export async function setupDatabaseLinks() {
  try {
    console.log('=== CONFIGURANDO VÍNCULOS DE BASE DE DATOS ===')
    
    // 1. Vincular lecciones y cursos
    const linkResult = await linkLessonsAndCourses()
    
    // 2. Reparar vínculos rotos
    const repairResult = await repairBrokenLinks()
    
    // 3. Crear lecciones faltantes si es necesario
    const createResult = await createMissingLessons()
    
    console.log('\n=== RESUMEN ===')
    console.log(`✅ Cursos verificados: ${linkResult.courses || 0}`)
    console.log(`✅ Lecciones verificadas: ${linkResult.lessons || 0}`)
    console.log(`⚠️  Inconsistencias: ${linkResult.inconsistencies?.length || 0}`)
    console.log(`⚠️  Vínculos rotos: ${repairResult.brokenLessons || 0}`)
    
    return {
      success: true,
      linkResult,
      repairResult,
      createResult
    }
    
  } catch (error) {
    console.error('Error configurando vínculos:', error)
    return { success: false, error }
  }
}
