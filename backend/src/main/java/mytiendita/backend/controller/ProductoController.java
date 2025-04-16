package mytiendita.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/producto")
@Tag(name = "Producto", description = "Controlador para los productos")
public class ProductoController {
}
