package mytiendita.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import mytiendita.backend.model.TipoMovimiento;
import mytiendita.backend.service.interfaces.TipoMovimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tipo-movimiento")
@Tag(name = "TipoMovimiento", description = "Controlador para los tipos de movimiento")
public class TipoMovimientoController {

    private TipoMovimientoService tipoMovimientoService;

    @GetMapping("/listar/salida-entrada")
    public ResponseEntity<List<TipoMovimiento>> listarSalidaEntrada() {

        return ResponseEntity.ok(tipoMovimientoService.listarSalidaEntrada());
    }

    @Autowired
    public void setTipoMovimientoService(TipoMovimientoService tipoMovimientoService) {
        this.tipoMovimientoService = tipoMovimientoService;
    }

}
