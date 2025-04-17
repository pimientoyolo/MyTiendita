package mytiendita.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import mytiendita.backend.dto.ProductoTableDTO;
import mytiendita.backend.service.interfaces.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/venta")
@Tag(name = "Venta", description = "Controlador para las ventas")
public class VentaController {

    private VentaService ventaService;

    @PostMapping("/proceso")
    public ResponseEntity<Boolean> procesoVenta(
            @RequestBody List<ProductoTableDTO> productos
    ) {
        ventaService.procesoVenta(productos);

        return ResponseEntity.ok(true);
    }

    @Autowired
    public void setVentaService(VentaService ventaService) {
        this.ventaService = ventaService;
    }
}
