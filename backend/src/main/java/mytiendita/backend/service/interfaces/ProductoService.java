package mytiendita.backend.service.interfaces;

import mytiendita.backend.dto.ProductoTableDTO;
import mytiendita.backend.model.Producto;

import java.util.List;

public interface ProductoService {

    Producto getProductoByCodigo(String codigo);

    Producto crearProducto(Producto producto);

    Producto actualizarProducto(Producto producto);

    void entradaProducto(List<ProductoTableDTO> productos);

    List<Producto> listarProductosPorIds(List<Long> ids);

    List<Producto> listar();

    void eliminarProducto(String codigo);

    void movimientoProducto(String codigo, Double cantidad, Long idTipoMovimiento);
}
