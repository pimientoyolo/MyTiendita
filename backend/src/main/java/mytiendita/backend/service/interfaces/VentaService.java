package mytiendita.backend.service.interfaces;

import mytiendita.backend.dto.ProductoTableDTO;
import mytiendita.backend.model.Venta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface VentaService {

    void procesoVenta(List<ProductoTableDTO> productos);

    List<Venta> listarVentas();

    Page<Venta> listarVentasPaginadas(String filter, Pageable pageable);
}
