package mytiendita.backend.service.interfaces;

import mytiendita.backend.dto.BalanceDTO;

public interface MovimientoService {

    BalanceDTO getBalanceDia();

    BalanceDTO getBalanceSemana();

    BalanceDTO getBalanceMes();

    void ingresoMovimiento(Double monto, Long idTipoMovimiento);
}
