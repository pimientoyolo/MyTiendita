package mytiendita.backend.service.impl;

import mytiendita.backend.dto.ProductoTableDTO;
import mytiendita.backend.exception.CustomException;
import mytiendita.backend.model.DetalleVenta;
import mytiendita.backend.model.Producto;
import mytiendita.backend.model.Venta;
import mytiendita.backend.repository.DetalleVentaRepository;
import mytiendita.backend.repository.ProductoRepository;
import mytiendita.backend.repository.VentaRepository;
import mytiendita.backend.service.interfaces.ProductoService;
import mytiendita.backend.service.interfaces.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class VentaServiceImpl implements VentaService {

    private VentaRepository ventaRepository;
    private DetalleVentaRepository detalleVentaRepository;
    private ProductoService productoService;
    private ProductoRepository productoRepository;

    @Override
    @Transactional
    public void procesoVenta(List<ProductoTableDTO> productos) {

        //verificamos si la lista de productos es vacia
        if (productos == null || productos.isEmpty()) {
            throw new CustomException("La lista de productos no puede estar vacia");
        }

        //creacion de venta
        Venta venta = new Venta();
        venta.setValor(0.0);
        venta.setFecha(new Date());

        //guardamos la venta
        venta = ventaRepository.save(venta);

        //inicializamos el valor total
        Double valorTotal = 0.0;

        //recorremos la lista de productos
        for (ProductoTableDTO producto : productos) {
            //verificamos si el producto existe
            Producto productobd = productoService.getProductoByCodigo(producto.getProducto().getCodigoBarras());

            Double cantidadVendida = producto.getCantidad();
            Double valor = cantidadVendida * producto.getProducto().getPrecioVenta();

            //calculamos el valor total
            valorTotal += valor;

            //creamos el detalle de venta
            DetalleVenta detalleVenta = new DetalleVenta();
            detalleVenta.setCantidad(cantidadVendida);
            detalleVenta.setValor(valor);
            detalleVenta.setProducto(productobd);
            detalleVenta.setVenta(venta);

            //actualizamos la cantidad del producto
            productobd.setCantidad(productobd.getCantidad() - cantidadVendida);
            //no se puede tener menor a cero, simplicidad por manejo de tienda
            if (productobd.getCantidad() < 0) {
                productobd.setCantidad(0.0);
            }

            //guardamos el detalle de venta
            detalleVentaRepository.save(detalleVenta);

            //actualizamos el producto
            productoRepository.save(productobd);

        }

        //actualizamos el valor de la venta
        venta.setValor(valorTotal);

        //guardamos la venta
        ventaRepository.save(venta);

    }

    @Autowired
    public void setVentaRepository(VentaRepository ventaRepository) {
        this.ventaRepository = ventaRepository;
    }

    @Autowired
    public void setDetalleVentaRepository(DetalleVentaRepository detalleVentaRepository) {
        this.detalleVentaRepository = detalleVentaRepository;
    }

    @Autowired
    public void setProductoService(ProductoService productoService) {
        this.productoService = productoService;
    }

    @Autowired
    public void setProductoRepository(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

}
