package mytiendita.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/venta")
@Tag(name = "Venta", description = "Controlador para las ventas")
public class Venta {
}
