package mytiendita.backend.dto;

import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VentaTableDTO {

  Long id;

  Double valor;

  Date fecha;

  List<DetalleVentaTableDTO> detalleVentas;
}
