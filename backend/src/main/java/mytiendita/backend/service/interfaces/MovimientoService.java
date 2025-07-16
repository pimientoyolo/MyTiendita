package mytiendita.backend.service.interfaces;

import mytiendita.backend.dto.BalanceDTO;
import mytiendita.backend.model.Movimiento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MovimientoService {

    BalanceDTO getBalanceDia();

    BalanceDTO getBalanceSemana();

    BalanceDTO getBalanceMes();

    void ingresoMovimiento(Double monto, Long idTipoMovimiento);

    Page<Movimiento> listarMovimientosPaginados(String filter, Pageable pageable);
}
