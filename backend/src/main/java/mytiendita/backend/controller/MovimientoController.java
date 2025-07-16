package mytiendita.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import mytiendita.backend.dto.BalanceDTO;
import mytiendita.backend.model.Movimiento;
import mytiendita.backend.service.interfaces.MovimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movimiento")
@Tag(name = "Movimiento", description = "Controlador para los movimientos de productos")
public class MovimientoController {

    private MovimientoService movimientoService;

    @GetMapping("/balance/dia")
    public ResponseEntity<BalanceDTO> getBalanceDia() {

        BalanceDTO balance = movimientoService.getBalanceDia();

        return ResponseEntity.ok(balance);
    }

    @GetMapping("/balance/semana")
    public ResponseEntity<BalanceDTO> getBalanceSemana() {

        BalanceDTO balance = movimientoService.getBalanceSemana();

        return ResponseEntity.ok(balance);
    }

    @GetMapping("/balance/mes")
    public ResponseEntity<BalanceDTO> getBalanceMes() {

        BalanceDTO balance = movimientoService.getBalanceMes();

        return ResponseEntity.ok(balance);
    }

    @PostMapping("/ingreso-movimiento")
    public ResponseEntity<Void> ingresoMovimiento(
            @RequestParam Double monto,
            @RequestParam Long idTipoMovimiento
    ) {
        movimientoService.ingresoMovimiento(monto, idTipoMovimiento);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/paginadas")
    public ResponseEntity<Page<Movimiento>> listarMovimientosPaginados(
        @RequestParam("filter") String filter,
        @PageableDefault(size = 5)Pageable pageable
      )
    {
        Page<Movimiento> movimientos = movimientoService.listarMovimientosPaginados(filter, pageable);
        return ResponseEntity.ok(movimientos);
    }


    @Autowired
    public void setMovimientoService(MovimientoService movimientoService) {
        this.movimientoService = movimientoService;
    }
}
