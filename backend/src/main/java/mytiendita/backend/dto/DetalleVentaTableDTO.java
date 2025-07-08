package mytiendita.backend.dto;

import lombok.*;
import mytiendita.backend.model.Producto;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleVentaTableDTO {

  private Long id;

  private Producto producto;

  private Double cantidad;

  private Double valor;
}
