package mytiendita.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mytiendita.backend.model.Producto;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoTableDTO {

    private Producto producto;

    private Double cantidad;

    private Double subtotal;
}
