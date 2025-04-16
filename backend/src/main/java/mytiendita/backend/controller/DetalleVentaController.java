package mytiendita.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/detalle-venta")
@Tag(name = "DetalleVenta", description = "Controlador para las relaciones entre venta y productos")
public class DetalleVentaController {
}
