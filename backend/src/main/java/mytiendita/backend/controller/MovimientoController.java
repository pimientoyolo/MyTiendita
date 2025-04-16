package mytiendita.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/movimiento")
@Tag(name = "Movimiento", description = "Controlador para los movimientos de productos")
public class MovimientoController {
}
