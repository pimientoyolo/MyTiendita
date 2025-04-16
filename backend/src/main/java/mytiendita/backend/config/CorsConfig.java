package mytiendita.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")           // todas las rutas
                .allowedOrigins("*")         // cualquier origen
                .allowedMethods("*")         // cualquier método HTTP
                .allowedHeaders("*")         // cualquier cabecera
                .allowCredentials(false);    // o true si necesitas cookies/autenticación
    }

}
