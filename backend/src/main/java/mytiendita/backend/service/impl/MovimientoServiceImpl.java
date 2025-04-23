package mytiendita.backend.service.impl;

import mytiendita.backend.dto.BalanceDTO;
import mytiendita.backend.exception.CustomException;
import mytiendita.backend.model.Movimiento;
import mytiendita.backend.model.TipoMovimiento;
import mytiendita.backend.repository.MovimientoRepository;
import mytiendita.backend.repository.TipoMovimientoRepository;
import mytiendita.backend.service.interfaces.MovimientoService;
import mytiendita.backend.util.Constantes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.*;
import java.util.Date;
import java.util.List;

@Service
public class MovimientoServiceImpl implements MovimientoService {

    private MovimientoRepository movimientoRepository;
    private TipoMovimientoRepository tipoMovimientoRepository;

    @Override
    public BalanceDTO getBalanceDia() {

        // 2) Calcula hoy y ayer en LocalDate
        LocalDate hoy     = LocalDate.now();
        LocalDate ayer = hoy.minusDays(1);

        // 3) Genera los instantes de inicio y fin de cada día
        LocalDateTime inicioHoy  = hoy.atStartOfDay();
        LocalDateTime finHoy    = hoy.atTime(LocalTime.MAX);

        LocalDateTime inicioAyer  = ayer.atStartOfDay();
        LocalDateTime finAyer     = ayer.atTime(LocalTime.MAX);

        // 4) Si tu repo aún usa java.util.Date, convierte así:
        Date inicio   = Timestamp.valueOf(inicioHoy);
        Date fin      = Timestamp.valueOf(finHoy);
        Date inicioP  = Timestamp.valueOf(inicioAyer);
        Date finP     = Timestamp.valueOf(finAyer);

        // 5) Llama al repositorio con esos rangos
        List<Movimiento> movimientos       = movimientoRepository.findByFechaBetween(inicio, fin);
        List<Movimiento> movimientosPasado = movimientoRepository.findByFechaBetween(inicioP, finP);

        // 6) Devuelve el balance
        return generarBalance(movimientos, movimientosPasado);
    }

    @Override
    public BalanceDTO getBalanceSemana() {

        LocalDate hoy = LocalDate.now();

        // calculo de la semana actual
        LocalDateTime inicioSemanaAct = hoy.minusDays(6).atStartOfDay();
        LocalDateTime finSemanaAct    = hoy.atTime(LocalTime.MAX);

        // calculo de la semana pasada
        LocalDateTime inicioSemanaPas = hoy.minusDays(13).atStartOfDay();
        LocalDateTime finSemanaPas    = hoy.minusDays(7).atTime(LocalTime.MAX);

        //pasar a Date
        Date inicioSemanaActual = Timestamp.valueOf(inicioSemanaAct);
        Date finSemanaActual    = Timestamp.valueOf(finSemanaAct);
        Date inicioSemanaPasada = Timestamp.valueOf(inicioSemanaPas);
        Date finSemanaPasada    = Timestamp.valueOf(finSemanaPas);

        List<Movimiento> movimientos       = movimientoRepository.findByFechaBetween(inicioSemanaActual, finSemanaActual);
        List<Movimiento> movimientosPasado = movimientoRepository.findByFechaBetween(inicioSemanaPasada, finSemanaPasada);

        // 6) Devuelve el balance
        return generarBalance(movimientos, movimientosPasado);
    }

    @Override
    public BalanceDTO getBalanceMes() {

        LocalDate hoy = LocalDate.now();

        // mes actual y mes pasado
        YearMonth mesActual = YearMonth.from(hoy);
        YearMonth mesPasado  = mesActual.minusMonths(1);

        // calculo de inicio y fin del mes actual
        LocalDateTime inicioMesAct = mesActual.atDay(1).atStartOfDay();
        LocalDateTime finMesAct    = mesActual.atEndOfMonth().atTime(LocalTime.MAX);

        // calculo de inicio y fin del mes pasado
        LocalDateTime inicioMesPas = mesPasado.atDay(1).atStartOfDay();
        LocalDateTime finMesPas    = mesPasado.atEndOfMonth().atTime(LocalTime.MAX);

        //pasar a Date
        Date inicioMesActual = Timestamp.valueOf(inicioMesAct);
        Date finMesActual    = Timestamp.valueOf(finMesAct);
        Date inicioMesPasado = Timestamp.valueOf(inicioMesPas);
        Date finMesPasado    = Timestamp.valueOf(finMesPas);


        // 5) Llama al repositorio con esos rangos
        List<Movimiento> movimientos       = movimientoRepository.findByFechaBetween(inicioMesActual, finMesActual);
        List<Movimiento> movimientosPasado = movimientoRepository.findByFechaBetween(inicioMesPasado, finMesPasado);

        // 6) Devuelve el balance
        return generarBalance(movimientos, movimientosPasado);
    }

    private BalanceDTO generarBalance(List<Movimiento> movimientos, List<Movimiento> movimientosPasado){
        BalanceDTO balanceDTO = new BalanceDTO();

        for (Movimiento movimiento : movimientos) {
            if (movimiento.getTipoMovimiento().getId().equals(Constantes.ID_TIPO_MOVIMIENTO_VENTA) ||
                    movimiento.getTipoMovimiento().getId().equals(Constantes.ID_TIPO_MOVIMIENTO_ENTRADA)) {

                // Sumar las ganancias actuales
                balanceDTO.setGanancia(balanceDTO.getGanancia() + movimiento.getValor());
            }else if(movimiento.getTipoMovimiento().getId().equals(Constantes.ID_TIPO_MOVIMIENTO_COMPRA) ||
                    movimiento.getTipoMovimiento().getId().equals(Constantes.ID_TIPO_MOVIMIENTO_SALIDA)){

                // Sumar los gastos actuales
                balanceDTO.setGasto(balanceDTO.getGasto() + movimiento.getValor());
            }
        }

        for (Movimiento movimiento : movimientosPasado) {
            if (movimiento.getTipoMovimiento().getId().equals(Constantes.ID_TIPO_MOVIMIENTO_VENTA) ||
                    movimiento.getTipoMovimiento().getId().equals(Constantes.ID_TIPO_MOVIMIENTO_ENTRADA)) {

                // Sumar las ganancias pasadas
                balanceDTO.setGananciaAnterior(balanceDTO.getGananciaAnterior() + movimiento.getValor());
            }else if(movimiento.getTipoMovimiento().getId().equals(Constantes.ID_TIPO_MOVIMIENTO_COMPRA) ||
                    movimiento.getTipoMovimiento().getId().equals(Constantes.ID_TIPO_MOVIMIENTO_SALIDA)){

                // Sumar los gastos pasados
                balanceDTO.setGastoAnterior(balanceDTO.getGastoAnterior() + movimiento.getValor());
            }
        }

        // Calcular el balance actual
        balanceDTO.setBalance(balanceDTO.getGanancia() - balanceDTO.getGasto());

        // Calcular el balance anterior
        balanceDTO.setBalanceAnterior(balanceDTO.getGananciaAnterior() - balanceDTO.getGastoAnterior());

        // Calcular el porcentaje de mejora
        if (balanceDTO.getBalanceAnterior() != 0) {
            balanceDTO.setPorcentajeMejora((balanceDTO.getBalance() - balanceDTO.getBalanceAnterior()) / balanceDTO.getBalanceAnterior() * 100);
        } else {
            balanceDTO.setPorcentajeMejora(0.0);
        }

        // redondedar porcentaje a 2 decimales
        Double redondeo = Math.round(balanceDTO.getPorcentajeMejora() * 100.0) / 100.0;
        balanceDTO.setPorcentajeMejora(redondeo);

        return balanceDTO;
    }

    @Override
    @Transactional
    public void ingresoMovimiento(Double monto, Long idTipoMovimiento) {
        TipoMovimiento tipoMovimiento = tipoMovimientoRepository.findById(idTipoMovimiento)
                .orElseThrow(() -> new CustomException("Tipo de movimiento no encontrado"));

        Movimiento movimiento = new Movimiento();
        movimiento.setValor(monto);
        movimiento.setTipoMovimiento(tipoMovimiento);
        movimiento.setFecha(new Date());
        movimientoRepository.save(movimiento);
    }


    @Autowired
    public void setMovimientoRepository(MovimientoRepository movimientoRepository) {
        this.movimientoRepository = movimientoRepository;
    }

    @Autowired
    public void setTipoMovimientoRepository(TipoMovimientoRepository tipoMovimientoRepository) {
        this.tipoMovimientoRepository = tipoMovimientoRepository;
    }
}
