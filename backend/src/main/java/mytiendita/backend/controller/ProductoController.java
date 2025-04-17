package mytiendita.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import mytiendita.backend.dto.ProductoTableDTO;
import mytiendita.backend.model.Producto;
import mytiendita.backend.service.interfaces.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/producto")
@Tag(name = "Producto", description = "Controlador para los productos")
public class ProductoController {

    private ProductoService productoService;

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<Producto> getProductoByCodigo(
            @PathVariable String codigo
    ) {
        // Lógica para obtener el producto por código
        return ResponseEntity.ok(productoService.getProductoByCodigo(codigo));
    }

    @PostMapping("/crear")
    public ResponseEntity<Producto> crearProducto(
            @RequestBody Producto producto
    ) {
        // Lógica para crear un nuevo producto
        return ResponseEntity.ok(productoService.crearProducto(producto));
    }

    @PutMapping("/actualizar")
    public ResponseEntity<Producto> actualizarProducto(
            @RequestBody Producto producto
    ) {
        // Lógica para actualizar un producto existente
        return ResponseEntity.ok(productoService.actualizarProducto(producto));
    }

    @PutMapping("/entrada")
    public ResponseEntity<Boolean> entradaProducto(
            @RequestBody List<ProductoTableDTO> productos
            ) {
        productoService.entradaProducto(productos);

        return ResponseEntity.ok(true);
    }

    @GetMapping("/listar/ids")
    public ResponseEntity<List<Producto>> listarProductosPorIds(
            @RequestParam List<Long> ids
    ) {
        // Lógica para listar productos por IDs
        return ResponseEntity.ok(productoService.listarProductosPorIds(ids));
    }

    //setters
    @Autowired
    public void setProductoService(ProductoService productoService) {
        this.productoService = productoService;
    }

}
