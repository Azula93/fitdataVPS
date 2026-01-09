# FitData - Sistema de Análisis de Indicadores de Salud 🏃‍♀️📊

FitData es una aplicación web robusta diseñada para profesionales de la salud y el deporte. Permite el cálculo automatizado, seguimiento y gestión de indicadores biométricos críticos como el IMC (Índice de Masa Corporal), ICC (Índice Cintura-Cadera) y el VO2 Máximo.

## 🚀 Características Principales

* **Cálculos Biométricos Avanzados:** Algoritmos precisos para la evaluación de la composición corporal y capacidad aeróbica.
* **Arquitectura MVC:** Desarrollo estructurado bajo el patrón Modelo-Vista-Controlador, garantizando escalabilidad y fácil mantenimiento.
* **ActiveRecord Pattern:** Implementación personalizada para la interacción segura con la base de datos MySQL.
* **Seguridad:** Sistema de autenticación de usuarios y protección de rutas mediante middlewares.
* **Diseño Responsivo:** Interfaz optimizada para su uso en dispositivos móviles y de escritorio.

## 🛠️ Stack Tecnológico

* **Backend:** PHP 8.x (Arquitectura limpia / Routing personalizado)
* **Base de Datos:** MySQL
* **Frontend:** JavaScript (Vanilla), HTML5, CSS3 (SASS/PostCSS)
* **Despliegue:** Configurado para entornos VPS (Virtual Private Server) con optimización de rutas.

## 📁 Estructura del Proyecto

* `/app`: Modelos y lógica de negocio (ActiveRecord).
* `/controllers`: Gestión de peticiones y flujos de trabajo.
* `/views`: Plantillas de interfaz de usuario.
* `/public`: Punto de entrada de la aplicación y recursos estáticos (JS, CSS).
* `/includes`: Configuraciones de base de datos y utilidades.

## ⚙️ Instalación Local

1.  Clona el repositorio:
    ```bash
    git clone [https://github.com/Azula93/fitdataVPS.git](https://github.com/Azula93/fitdataVPS.git)
    ```
2.  Crea una base de datos MySQL e importa el archivo `.sql` (si está disponible).
3.  Apunta tu servidor local (Apache/Nginx) a la carpeta `public/`.

## 📈 Impacto del Proyecto
Este sistema fue diseñado para digitalizar procesos de evaluación física en institutos de recuperación funcional, reduciendo el error humano en cálculos manuales y centralizando la información del paciente para un seguimiento histórico.

---
Desarrollado con ❤️ por [Silvia Riquett](https://github.com/Azula93)
