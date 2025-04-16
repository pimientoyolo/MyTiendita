package mytiendita.backend.service.impl;

import mytiendita.backend.exception.CustomException;
import mytiendita.backend.model.Producto;
import mytiendita.backend.repository.ProductoRepository;
import mytiendita.backend.service.interfaces.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductoServiceImpl implements ProductoService {

    private ProductoRepository productoRepository;

    @Override
    public Producto getProductoByCodigo(String codigo) {
        return productoRepository.findByCodigoBarras(codigo)
                .orElseThrow(() -> new CustomException("Producto no encontrado"));
    }

    // Setters
    @Autowired
    public void setProductoRepository(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

}
