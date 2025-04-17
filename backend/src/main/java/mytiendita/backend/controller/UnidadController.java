package mytiendita.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/unidad")
@Tag(name = "Unidad", description = "Controlador para las unidades de medida")
public class UnidadController {
}
