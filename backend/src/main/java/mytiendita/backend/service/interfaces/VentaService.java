package mytiendita.backend.service.interfaces;

import mytiendita.backend.dto.ProductoTableDTO;
import mytiendita.backend.model.Venta;

import java.util.List;

public interface VentaService {

    void procesoVenta(List<ProductoTableDTO> productos);

    List<Venta> listarVentas();
}
