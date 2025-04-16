package mytiendita.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tipo-movimiento")
@Tag(name = "TipoMovimiento", description = "Controlador para los tipos de movimiento")
public class TipoMovimientoController {
}
