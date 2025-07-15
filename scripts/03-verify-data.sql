-- Script para verificar y corregir integridad de datos

-- 1. Verificar conteo de lecciones por curso
SELECT 
    c.id as course_id,
    c.title,
    c.lessons_count as stored_count,
    COUNT(l.id) as actual_count,
    CASE 
        WHEN c.lessons_count != COUNT(l.id) THEN 'MISMATCH' 
        ELSE 'OK' 
    END as status
FROM courses c
LEFT JOIN lessons l ON c.id = l.course_id AND l.is_active = true
GROUP BY c.id, c.title, c.lessons_count
ORDER BY c.id;

-- 2. Actualizar conteo de lecciones si es necesario
UPDATE courses 
SET lessons_count = (
    SELECT COUNT(*) 
    FROM lessons 
    WHERE course_id = courses.id AND is_active = true
);

-- 3. Verificar progreso de usuarios
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    COUNT(up.lesson_id) as completed_lessons,
    ARRAY_AGG(DISTINCT l.course_id ORDER BY l.course_id) as courses_with_progress
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN lessons l ON up.lesson_id = l.id
GROUP BY u.id, u.name, u.email
ORDER BY u.name;

-- 4. Verificar progreso detallado por curso para un usuario específico
-- Reemplazar 'USER_ID_HERE' con el ID real del usuario
SELECT 
    c.id as course_id,
    c.title,
    c.lessons_count,
    COUNT(up.lesson_id) as completed_lessons,
    ROUND((COUNT(up.lesson_id)::decimal / c.lessons_count) * 100, 2) as progress_percentage
FROM courses c
LEFT JOIN lessons l ON c.id = l.course_id AND l.is_active = true
LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = 'USER_ID_HERE'
GROUP BY c.id, c.title, c.lessons_count
ORDER BY c.id;

-- 5. Verificar lecciones completadas por usuario y curso
SELECT 
    l.course_id,
    l.order_index,
    l.title,
    up.completed_at,
    CASE WHEN up.lesson_id IS NOT NULL THEN 'COMPLETED' ELSE 'PENDING' END as status
FROM lessons l
LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = 'USER_ID_HERE'
WHERE l.is_active = true
ORDER BY l.course_id, l.order_index;

-- 6. Verificar estructura de tablas
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'courses', 'lessons', 'user_progress')
ORDER BY table_name, ordinal_position;
