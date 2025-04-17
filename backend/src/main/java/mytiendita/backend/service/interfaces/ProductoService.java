package mytiendita.backend.service.interfaces;

import mytiendita.backend.model.Producto;

public interface ProductoService {

    Producto getProductoByCodigo(String codigo);

    Producto crearProducto(Producto producto);

    Producto actualizarProducto(Producto producto);
}
