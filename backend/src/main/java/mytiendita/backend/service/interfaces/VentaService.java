package mytiendita.backend.service.interfaces;

import mytiendita.backend.dto.ProductoTableDTO;

import java.util.List;

public interface VentaService {

    void procesoVenta(List<ProductoTableDTO> productos);
}
