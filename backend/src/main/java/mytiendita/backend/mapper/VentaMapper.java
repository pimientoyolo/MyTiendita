package mytiendita.backend.mapper;

import mytiendita.backend.dto.DetalleVentaTableDTO;
import mytiendita.backend.dto.VentaTableDTO;
import mytiendita.backend.model.DetalleVenta;
import mytiendita.backend.model.Venta;
import org.mapstruct.InheritConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper
public interface VentaMapper {

  VentaMapper INSTANCE = Mappers.getMapper(VentaMapper.class);

  VentaTableDTO toVentaTableDTO(Venta venta);

  @InheritConfiguration(name = "toVentaTableDTO")
  List<VentaTableDTO> toVentaTableDTOList(List<Venta> ventas);

  DetalleVentaTableDTO toDetalleVentaTableDTO(DetalleVenta detalleVenta);
}
