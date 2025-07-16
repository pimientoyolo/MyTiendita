package mytiendita.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import mytiendita.backend.dto.ProductoTableDTO;
import mytiendita.backend.dto.VentaTableDTO;
import mytiendita.backend.mapper.VentaMapper;
import mytiendita.backend.model.Venta;
import mytiendita.backend.service.interfaces.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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

    @GetMapping("/paginadas")
    public ResponseEntity<Page<VentaTableDTO>> listarVentasPaginadas(
            @PageableDefault(size = 5) Pageable pageable,
            @RequestParam("filter") String filter
    ) {
        Page<Venta> ventas = ventaService.listarVentasPaginadas(filter, pageable);
        Page<VentaTableDTO> ventasDTO = VentaMapper.INSTANCE.toVentaTableDTOPage(ventas);
        return ResponseEntity.ok(ventasDTO);
    }

    @Autowired
    public void setVentaService(VentaService ventaService) {
        this.ventaService = ventaService;
    }
}
