package mytiendita.backend.service.interfaces;

import mytiendita.backend.dto.ProductoTableDTO;
import mytiendita.backend.model.Producto;

import java.util.List;

public interface ProductoService {

    Producto getProductoByCodigo(String codigo);

    Producto crearProducto(Producto producto);

    Producto actualizarProducto(Producto producto);

    void entradaProducto(List<ProductoTableDTO> productos);
}
