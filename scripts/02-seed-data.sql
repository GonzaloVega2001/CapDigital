-- Insertar cursos
INSERT INTO courses (title, description, lessons_count, duration, difficulty, icon, color, order_index) VALUES
('Fundamentos del Celular', 'Aprende lo básico para usar tu smartphone de manera efectiva', 8, '2-3 horas', 'Principiante', 'Smartphone', 'cyan', 1),
('Navegación en Internet', 'Descubre cómo navegar de forma segura en la web', 10, '3-4 horas', 'Principiante', 'Wifi', 'blue', 2),
('Uso de la Computadora', 'Domina las funciones básicas de tu PC o laptop', 12, '4-5 horas', 'Principiante', 'Laptop', 'teal', 3),
('WhatsApp y Mensajería', 'Comunícate con familia y amigos usando WhatsApp', 6, '2 horas', 'Principiante', 'MessageCircle', 'green', 4),
('Correo Electrónico', 'Aprende a enviar y recibir emails de forma profesional', 8, '3 horas', 'Intermedio', 'Mail', 'purple', 5),
('Seguridad Digital', 'Protégete de estafas y mantén tu información segura', 10, '3-4 horas', 'Intermedio', 'Shield', 'red', 6);

-- Insertar lecciones para el curso 1 (Fundamentos del Celular)
INSERT INTO lessons (course_id, title, description, content, duration, order_index) VALUES
(1, 'Conociendo tu Celular', 'Aprende las partes básicas de tu smartphone', 'En esta lección aprenderás a identificar las partes principales de tu celular: la pantalla, los botones de volumen, el botón de encendido, y cómo sostenerlo correctamente. También veremos cómo encender y apagar el dispositivo de forma segura.', '15 min', 1),
(1, 'Encender y Configurar', 'Primeros pasos para configurar tu dispositivo', 'Configuraremos tu celular por primera vez. Aprenderás a conectarte a WiFi, configurar la fecha y hora, y ajustar el brillo de la pantalla para que sea cómodo para tus ojos.', '20 min', 2),
(1, 'La Pantalla Principal', 'Navegando por la pantalla de inicio', 'Descubriremos juntos la pantalla principal de tu celular. Veremos qué son los íconos, cómo tocar la pantalla correctamente, y cómo volver siempre a la pantalla de inicio.', '18 min', 3),
(1, 'Hacer tu Primera Llamada', 'Aprende a llamar a tus seres queridos', 'Es hora de hacer tu primera llamada. Te enseñaré paso a paso cómo marcar un número, cómo contestar cuando te llamen, y cómo colgar correctamente. También veremos cómo ajustar el volumen durante una llamada.', '25 min', 4),
(1, 'Contactos y Agenda', 'Guarda los números importantes', 'Aprenderás a guardar los números de teléfono de tu familia y amigos en la agenda de contactos. También veremos cómo buscar un contacto y cómo llamar directamente desde la agenda.', '22 min', 5),
(1, 'Mensajes de Texto', 'Envía tu primer mensaje', 'Te guiaré para enviar tu primer mensaje de texto. Aprenderás a escribir usando el teclado del celular, cómo enviar el mensaje, y cómo leer los mensajes que recibas.', '30 min', 6),
(1, 'La Cámara Básica', 'Toma tus primeras fotos', 'Descubriremos cómo usar la cámara de tu celular. Aprenderás a tomar fotos, cómo ver las fotos que tomaste, y algunos consejos para que tus fotos salgan mejor.', '20 min', 7),
(1, 'Cuidado y Mantenimiento', 'Mantén tu celular en buen estado', 'Consejos importantes para cuidar tu celular: cómo limpiarlo, dónde guardarlo, cómo cargarlo correctamente, y qué hacer si algo no funciona como esperabas.', '15 min', 8);

-- Insertar lecciones para el curso 2 (Navegación en Internet)
INSERT INTO lessons (course_id, title, description, content, duration, order_index) VALUES
(2, 'Qué es Internet', 'Introducción al mundo digital', 'Aprenderemos qué es internet, cómo funciona y por qué es útil para ti. Veremos ejemplos de cosas que puedes hacer online y cómo internet puede mejorar tu vida diaria.', '20 min', 1),
(2, 'Tu Primer Navegador', 'Conociendo Chrome, Safari y otros', 'Te enseñaré qué es un navegador web y cómo usarlo. Aprenderás a abrir Chrome o Safari, y entenderás la diferencia entre ellos.', '18 min', 2),
(2, 'Hacer Búsquedas en Google', 'Encuentra lo que necesitas', 'Aprenderás a usar Google para buscar información. Te enseñaré trucos para encontrar exactamente lo que buscas y cómo saber si la información es confiable.', '25 min', 3),
(2, 'Sitios Web Útiles', 'Páginas que te van a encantar', 'Descubriremos sitios web útiles para adultos mayores: noticias, clima, recetas, salud y entretenimiento. Te mostraré cómo navegar por cada uno.', '30 min', 4),
(2, 'Guardar tus Favoritos', 'No pierdas las páginas importantes', 'Aprenderás a guardar las páginas web que más te gusten en favoritos, para poder encontrarlas fácilmente después.', '15 min', 5),
(2, 'Ver Videos en YouTube', 'Entretenimiento y aprendizaje', 'Te enseñaré cómo usar YouTube para ver videos de tus temas favoritos: música, cocina, ejercicios, y mucho más.', '28 min', 6),
(2, 'Compras Online Seguras', 'Cómo comprar sin riesgos', 'Aprenderás los conceptos básicos de las compras online, cómo identificar sitios seguros y qué precauciones tomar.', '35 min', 7),
(2, 'Redes Sociales Básicas', 'Conecta con familia y amigos', 'Una introducción suave a Facebook e Instagram, cómo ver fotos de tu familia y conectarte con amigos.', '25 min', 8),
(2, 'Navegación Segura', 'Protégete mientras navegas', 'Consejos importantes para navegar de forma segura, cómo identificar sitios peligrosos y qué hacer si algo sale mal.', '22 min', 9),
(2, 'Solución de Problemas', 'Qué hacer cuando algo no funciona', 'Te enseñaré qué hacer cuando una página no carga, cómo cerrar ventanas que no quieres, y otros problemas comunes.', '20 min', 10);

-- Insertar logros
INSERT INTO achievements (title, description, points, icon, requirements, rarity) VALUES
('¡Bienvenido a CapDigital!', 'Te registraste en la plataforma', 10, 'Heart', '{"type": "registration"}', 'common'),
('Primera Lección', 'Completaste tu primera lección', 25, 'Star', '{"type": "lessons_completed", "count": 1}', 'common'),
('Curso Iniciado', 'Comenzaste tu primer curso', 15, 'BookOpen', '{"type": "course_started"}', 'common'),
('Estudiante Dedicado', 'Completa 5 lecciones', 50, 'Target', '{"type": "lessons_completed", "count": 5}', 'rare'),
('Experto en Celular', 'Completa el curso de Fundamentos del Celular', 100, 'Medal', '{"type": "course_completed", "course_id": 1}', 'epic'),
('Navegador Web', 'Completa el curso de Navegación en Internet', 100, 'Trophy', '{"type": "course_completed", "course_id": 2}', 'epic'),
('Maestro Digital', 'Completa todos los cursos disponibles', 500, 'Crown', '{"type": "all_courses_completed"}', 'legendary'),
('Racha de 7 Días', 'Estudia 7 días consecutivos', 75, 'Zap', '{"type": "daily_streak", "days": 7}', 'rare'),
('Tiempo de Calidad', 'Acumula 10 horas de estudio', 80, 'Clock', '{"type": "study_time", "hours": 10}', 'rare'),
('Miembro de la Comunidad', 'Participa en el foro de la comunidad', 30, 'Users', '{"type": "community_participation"}', 'common');
