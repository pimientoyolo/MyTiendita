package mytiendita.backend.service.impl;

import mytiendita.backend.model.TipoMovimiento;
import mytiendita.backend.repository.TipoMovimientoRepository;
import mytiendita.backend.service.interfaces.TipoMovimientoService;
import mytiendita.backend.util.Constantes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoMovimientoServiceImpl implements TipoMovimientoService {

    private TipoMovimientoRepository tipoMovimientoRepository;

    @Override
    public List<TipoMovimiento> listarSalidaEntrada() {
        return tipoMovimientoRepository.findByIdIn(Constantes.IDS_TIPO_MOVIMIENTO_SALIDA_ENTRADA);
    }

    @Autowired
    public void setTipoMovimientoRepository(TipoMovimientoRepository tipoMovimientoRepository) {
        this.tipoMovimientoRepository = tipoMovimientoRepository;
    }
}
