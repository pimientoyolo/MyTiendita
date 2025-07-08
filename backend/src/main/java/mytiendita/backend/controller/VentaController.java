package mytiendita.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import mytiendita.backend.dto.ProductoTableDTO;
import mytiendita.backend.dto.VentaTableDTO;
import mytiendita.backend.mapper.VentaMapper;
import mytiendita.backend.model.Venta;
import mytiendita.backend.service.interfaces.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venta")
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

    @GetMapping("/listar")
    public ResponseEntity<List<VentaTableDTO>> listarVentas() {
        List<Venta> ventas = ventaService.listarVentas();
        List<VentaTableDTO> ventasDTO = VentaMapper.INSTANCE.toVentaTableDTOList(ventas);
        return ResponseEntity.ok(ventasDTO);
    }

    @Autowired
    public void setVentaService(VentaService ventaService) {
        this.ventaService = ventaService;
    }
}
