package mytiendita.backend.service.impl;

import mytiendita.backend.exception.CustomException;
import mytiendita.backend.model.Producto;
import mytiendita.backend.repository.ProductoRepository;
import mytiendita.backend.service.interfaces.ProductoService;
import mytiendita.backend.util.Constantes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductoServiceImpl implements ProductoService {

    private ProductoRepository productoRepository;

    @Override
    public Producto getProductoByCodigo(String codigo) {
        return productoRepository.findByCodigoBarras(codigo)
                .orElseThrow(() -> new CustomException("Producto no encontrado"));
    }

    @Override
    @Transactional
    public Producto crearProducto(Producto producto) {
        // formatar el producto
        formatProducto(producto);

        // Validar el producto
        validarProducto(producto);

        // Validar que el producto no exista
        if (productoRepository.existsByCodigoBarras(producto.getCodigoBarras())) {
            throw new CustomException("El producto ya existe");
        }

        // Guardar el nuevo producto
        return productoRepository.save(producto);
    }

    private void formatProducto(Producto producto) {
        producto.setCodigoBarras(producto.getCodigoBarras().trim());
        producto.setNombre(producto.getNombre().trim());
        producto.setDescripcion(producto.getDescripcion().trim());
    }

    private void validarProducto(Producto producto) {

        if(producto.getCantidad() == null){
            producto.setCantidad(0.0);
        } else if (producto.getCantidad() < 0) {
            throw new CustomException("La cantidad no puede ser menor a cero");
        }

        if(producto.getUnidad().getId().equals(Constantes.ID_UNIDAD) && producto.getCantidad() % 1 != 0) {
                throw new CustomException("La cantidad no puede ser decimal, ya que es por unidad");
            }


        if (producto.getPrecioCompra() == null || producto.getPrecioCompra() <= 0) {
            throw new CustomException("El precio de costo debe ser mayor a cero");
        }

        if (producto.getPrecioVenta() == null || producto.getPrecioVenta() <= 0) {
            throw new CustomException("El precio de venta debe ser mayor a cero");
        }

        if (producto.getPrecioVenta() <= producto.getPrecioCompra()) {
            throw new CustomException("El precio de venta debe ser mayor al precio de costo");
        }

        if (producto.getNombre() == null || producto.getNombre().isEmpty()) {
            throw new CustomException("El nombre del producto no puede estar vacío");
        }

        if (producto.getCodigoBarras() == null || producto.getCodigoBarras().isEmpty()) {
            throw new CustomException("El código de barras no puede estar vacío");
        }


    }

    // Setters
    @Autowired
    public void setProductoRepository(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

}
