package mytiendita.backend.service.impl;

import mytiendita.backend.dto.ProductoTableDTO;
import mytiendita.backend.exception.CustomException;
import mytiendita.backend.model.Movimiento;
import mytiendita.backend.model.Producto;
import mytiendita.backend.model.TipoMovimiento;
import mytiendita.backend.repository.MovimientoRepository;
import mytiendita.backend.repository.ProductoRepository;
import mytiendita.backend.repository.UnidadRepository;
import mytiendita.backend.service.interfaces.ProductoService;
import mytiendita.backend.util.Constantes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class ProductoServiceImpl implements ProductoService {

    private ProductoRepository productoRepository;
    private UnidadRepository unidadRepository;
    private MovimientoRepository movimientoRepository;

    @Override
    public Producto getProductoByCodigo(String codigo) {
        return productoRepository.findByCodigoBarras(codigo)
                .orElseThrow(() -> new CustomException("Producto no encontrado"));
    }

    @Override
    @Transactional
    public void entradaProducto(List<ProductoTableDTO> productos) {
        // Tipo de movimiento
        TipoMovimiento tipoMovimiento = new TipoMovimiento();
        tipoMovimiento.setId(Constantes.ID_TIPO_MOVIMIENTO_COMPRA);

        for (ProductoTableDTO producto : productos) {
            if(producto.getCantidad() == null || producto.getCantidad() <= 0) {
                continue;
            }


            // Validar que el producto exista y obtenerlo
            Producto productobd = getProductoByCodigo(producto.getProducto().getCodigoBarras());
            productobd.setCantidad(productobd.getCantidad() + producto.getCantidad());

            if (productobd.getUnidad().getId().equals(Constantes.ID_UNIDAD) && producto.getCantidad() % 1 != 0) {
                throw new CustomException("La cantidad no puede ser decimal, ya que es por unidad: "+ productobd.getNombre());
            }

            // Crear un nuevo movimiento
            Movimiento movimiento = new Movimiento();
            movimiento.setTipoMovimiento(tipoMovimiento);
            movimiento.setProducto(productobd);
            movimiento.setCantidad(producto.getCantidad());
            movimiento.setValor(producto.getCantidad() * productobd.getPrecioCompra());
            movimiento.setFecha(new Date());

            // Guardar el movimiento
            movimientoRepository.save(movimiento);

            // Guardar el producto actualizado
            productoRepository.save(productobd);
        }
    }

    @Override
    @Transactional
    public Producto crearProducto(Producto producto) {
        // formatar el producto
        formatProducto(producto);

        // Validar el producto
        validarProducto(producto);

        // Validar la unidad
        validarUnidad(producto);

        // Validar que el producto no exista
        if (productoRepository.existsByCodigoBarras(producto.getCodigoBarras())) {
            throw new CustomException("El producto ya existe");
        }

        //generar movimiento
        if (producto.getCantidad() > 0) {
            crearMovimientoCompra(producto);
        }

        // Guardar el nuevo producto
        return productoRepository.save(producto);
    }

    @Override
    @Transactional
    public Producto actualizarProducto(Producto producto) {

        // Validar que el producto exista
        Producto productobd = getProductoByCodigo(producto.getCodigoBarras());

        producto.setId(productobd.getId());
        producto.setCantidad(productobd.getCantidad());
        producto.setCodigoBarras(productobd.getCodigoBarras());

        // formatar el producto
        formatProducto(producto);

        // Validar el producto
        validarProducto(producto);

        // Validar la unidad
        validarUnidad(producto);

        // Guardar el producto actualizado
        return productoRepository.save(producto);
    }

    private void crearMovimientoCompra(Producto producto) {
        // Crear el tipo de movimiento
        TipoMovimiento tipoMovimiento = new TipoMovimiento();
        tipoMovimiento.setId(Constantes.ID_TIPO_MOVIMIENTO_COMPRA);

        Double cantidad = producto.getCantidad();
        Double valor = cantidad*producto.getPrecioCompra();

        // Crear un nuevo movimiento
        Movimiento movimiento = new Movimiento();
        movimiento.setTipoMovimiento(tipoMovimiento);
        movimiento.setProducto(producto);
        movimiento.setCantidad(cantidad);
        movimiento.setValor(valor);
        movimiento.setFecha(new Date());

        // Guardar el movimiento
        movimientoRepository.save(movimiento);
    }

    private void validarUnidad(Producto producto) {
        if (producto.getUnidad() == null || producto.getUnidad().getId() == null) {
            throw new CustomException("Se debe seleccionar la unidad");
        }

        if (!unidadRepository.existsById(producto.getUnidad().getId())) {
            throw new CustomException("La unidad no existe");
        }
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

    @Autowired
    public void setUnidadRepository(UnidadRepository unidadRepository) {
        this.unidadRepository = unidadRepository;
    }

    @Autowired
    public void setMovimientoRepository(MovimientoRepository movimientoRepository) {
        this.movimientoRepository = movimientoRepository;
    }

}
