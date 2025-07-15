-- Completar lecciones faltantes para todos los cursos

-- Insertar lecciones para el curso 3 (Uso de la Computadora)
INSERT INTO lessons (course_id, title, description, content, duration, order_index) VALUES
(3, 'Archivos y Carpetas', 'Organiza tus documentos digitales', 'Aprenderás qué son los archivos y carpetas, cómo crear nuevas carpetas, y cómo organizar tus documentos de manera ordenada. También veremos cómo encontrar archivos que hayas guardado.', '35 min', 1),
(3, 'Escribir en Word', 'Crea tus primeros documentos', 'Te enseñaré a usar Microsoft Word para escribir cartas, notas y documentos. Aprenderás a escribir, cambiar el tamaño de letra, y guardar tu trabajo.', '40 min', 2),
(3, 'Guardar y Abrir Documentos', 'Nunca pierdas tu trabajo', 'Aprenderás diferentes formas de guardar tus documentos, cómo darles nombres apropiados, y cómo encontrar y abrir documentos que guardaste anteriormente.', '25 min', 3),
(3, 'Configuración Básica', 'Personaliza tu computadora', 'Te mostraré cómo ajustar el tamaño de letra en la pantalla, cambiar el fondo de escritorio, y configurar el volumen para que sea cómodo para ti.', '30 min', 4),
(3, 'Mantener tu PC Segura', 'Protege tu computadora', 'Aprenderás conceptos básicos de seguridad: qué es un antivirus, cómo mantener tu computadora actualizada, y cómo evitar descargar programas peligrosos.', '28 min', 5),
(3, 'Solución de Problemas', 'Qué hacer cuando algo no funciona', 'Te enseñaré qué hacer cuando la computadora va lenta, cómo cerrar programas que no responden, y cuándo es mejor reiniciar la computadora.', '25 min', 6),
(3, 'Conectar Dispositivos', 'USB, impresoras y más', 'Aprenderás a conectar dispositivos como memorias USB, impresoras, y cámaras digitales. También veremos cómo transferir fotos de tu cámara a la computadora.', '20 min', 7),
(3, 'Mantenimiento Básico', 'Cuida tu computadora', 'Consejos para mantener tu computadora en buen estado: cómo limpiarla, organizarla, y pequeños trucos para que funcione mejor por más tiempo.', '18 min', 8),
(3, 'Respaldos y Seguridad', 'Protege tu información importante', 'Aprenderás qué es un respaldo, por qué es importante, y cómo hacer copias de seguridad de tus documentos y fotos más importantes.', '30 min', 9),
(3, 'Personalización Avanzada', 'Haz tu computadora única', 'Te mostraré cómo personalizar tu escritorio, organizar los iconos, y configurar tu computadora para que sea más fácil de usar.', '25 min', 10),
(3, 'Programas Útiles', 'Software que te va a ayudar', 'Conocerás programas útiles para adultos mayores: calculadora, calendario, grabadora de voz, y otras herramientas que harán tu vida más fácil.', '22 min', 11),
(3, 'Repaso y Práctica', 'Consolida lo aprendido', 'Una lección de repaso donde practicaremos todo lo que hemos aprendido. Te daré ejercicios prácticos para que te sientas seguro usando tu computadora.', '35 min', 12);

-- Insertar lecciones para el curso 4 (WhatsApp y Mensajería)
INSERT INTO lessons (course_id, title, description, content, duration, order_index) VALUES
(4, 'Instalando WhatsApp', 'Descarga y configura la aplicación', 'Te guiaré paso a paso para descargar WhatsApp en tu celular, crear tu cuenta, y configurar tu perfil con tu nombre y foto.', '25 min', 1),
(4, 'Tu Primer Mensaje', 'Envía tu primer WhatsApp', 'Aprenderás a buscar contactos, escribir tu primer mensaje, y enviarlo. También veremos cómo saber si tu mensaje fue entregado y leído.', '20 min', 2),
(4, 'Mensajes de Voz', 'Cuando escribir es difícil', 'Te enseñaré a enviar mensajes de voz, cómo grabarlos correctamente, y cómo escuchar los mensajes de voz que te envíen.', '18 min', 3),
(4, 'Compartir Fotos', 'Envía fotos a tu familia', 'Aprenderás a tomar fotos y enviarlas por WhatsApp, cómo enviar fotos que ya tienes guardadas, y cómo ver las fotos que te envíen.', '30 min', 4),
(4, 'Grupos Familiares', 'Mantente conectado con todos', 'Te mostraré cómo crear grupos de WhatsApp para estar en contacto con toda tu familia, cómo agregar personas, y cómo participar en conversaciones grupales.', '28 min', 5),
(4, 'Videollamadas', 'Habla cara a cara', 'Aprenderás a hacer videollamadas por WhatsApp, cómo contestar cuando te llamen, y consejos para que la llamada salga bien.', '25 min', 6);

-- Insertar lecciones para el curso 5 (Correo Electrónico)
INSERT INTO lessons (course_id, title, description, content, duration, order_index) VALUES
(5, 'Crear tu Cuenta de Email', 'Tu primera dirección de correo', 'Te ayudaré a crear tu primera cuenta de correo electrónico, elegir una dirección apropiada, y configurar una contraseña segura.', '30 min', 1),
(5, 'Enviar tu Primer Email', 'Redacta y envía mensajes', 'Aprenderás a escribir un correo electrónico, cómo poner el destinatario, escribir el asunto, y enviar el mensaje correctamente.', '25 min', 2),
(5, 'Leer y Responder', 'Gestiona tu bandeja de entrada', 'Te enseñaré cómo leer los correos que recibas, cómo responder a un mensaje, y cómo reenviar correos a otras personas.', '28 min', 3),
(5, 'Adjuntar Archivos', 'Envía fotos y documentos', 'Aprenderás a adjuntar archivos a tus correos: fotos, documentos, y otros archivos que quieras compartir.', '22 min', 4),
(5, 'Organizar tu Correo', 'Mantén todo ordenado', 'Te mostraré cómo organizar tu correo en carpetas, cómo marcar correos importantes, y cómo eliminar mensajes que no necesitas.', '20 min', 5),
(5, 'Contactos de Email', 'Guarda direcciones importantes', 'Aprenderás a guardar las direcciones de correo de las personas importantes en tu agenda de contactos.', '18 min', 6),
(5, 'Seguridad en Email', 'Protégete de estafas', 'Consejos importantes para usar el correo de forma segura, cómo identificar correos sospechosos, y qué hacer si recibes algo extraño.', '25 min', 7),
(5, 'Email en el Celular', 'Revisa tu correo desde cualquier lugar', 'Te enseñaré cómo configurar tu correo en tu celular para poder leerlo y responder desde cualquier lugar.', '30 min', 8);

-- Insertar lecciones para el curso 6 (Seguridad Digital)
INSERT INTO lessons (course_id, title, description, content, duration, order_index) VALUES
(6, 'Contraseñas Seguras', 'Protege tus cuentas', 'Aprenderás a crear contraseñas seguras, por qué son importantes, y cómo recordarlas sin escribirlas en lugares peligrosos.', '25 min', 1),
(6, 'Reconocer Estafas', 'No caigas en trampas', 'Te enseñaré a identificar estafas comunes por internet, teléfono y mensajes, y qué hacer si sospechas que algo es una estafa.', '30 min', 2),
(6, 'Compras Seguras Online', 'Compra sin riesgos', 'Aprenderás a identificar sitios web seguros para comprar, cómo proteger tu información bancaria, y qué hacer si algo sale mal.', '35 min', 3),
(6, 'Información Personal', 'Qué compartir y qué no', 'Te mostraré qué información personal nunca debes compartir online, cómo configurar la privacidad en redes sociales, y cómo proteger tus datos.', '28 min', 4),
(6, 'Antivirus y Protección', 'Mantén tus dispositivos seguros', 'Aprenderás qué es un antivirus, cómo mantener tu computadora y celular protegidos, y cómo reconocer si algo está mal.', '25 min', 5),
(6, 'Respaldos y Recuperación', 'Nunca pierdas información importante', 'Te enseñaré cómo hacer respaldos de tus fotos y documentos importantes, y cómo recuperar información si algo pasa.', '30 min', 6),
(6, 'Redes WiFi Seguras', 'Conéctate de forma segura', 'Aprenderás a conectarte a redes WiFi de forma segura, qué redes evitar, y cómo proteger tu red de casa.', '22 min', 7),
(6, 'Privacidad en Redes Sociales', 'Controla quién ve tu información', 'Te mostraré cómo configurar la privacidad en Facebook, Instagram y otras redes sociales para proteger tu información.', '25 min', 8),
(6, 'Qué hacer si te Hackean', 'Recupera tus cuentas', 'Aprenderás qué hacer si sospechas que alguien accedió a tus cuentas sin permiso, cómo cambiar contraseñas, y cómo reportar problemas.', '30 min', 9),
(6, 'Mantenerse Actualizado', 'Seguridad a largo plazo', 'Te enseñaré cómo mantenerte informado sobre nuevas amenazas, cómo actualizar tus dispositivos, y cómo seguir aprendiendo sobre seguridad digital.', '20 min', 10);

-- Actualizar el contador de lecciones en los cursos
UPDATE courses SET lessons_count = 8 WHERE id = 1;
UPDATE courses SET lessons_count = 10 WHERE id = 2;
UPDATE courses SET lessons_count = 12 WHERE id = 3;
UPDATE courses SET lessons_count = 6 WHERE id = 4;
UPDATE courses SET lessons_count = 8 WHERE id = 5;
UPDATE courses SET lessons_count = 10 WHERE id = 6;
