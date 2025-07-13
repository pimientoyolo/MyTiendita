package mytiendita.backend.repository;

import mytiendita.backend.model.Venta;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {

  @Query(
    """
    SELECT v FROM Venta v
    JOIN FETCH v.detalleVentas dv
    ORDER BY v.fecha DESC
    LIMIT 1000
    """
  )
  List<Venta> findTableVentas();

  @Query("""
    SELECT DISTINCT v FROM Venta v
    JOIN v.detalleVentas dv
    JOIN dv.producto p
    JOIN p.unidad u
    WHERE LOWER(CONCAT(
      TO_CHAR(v.fecha, 'DD/MM/YYYY'), ' ',
      v.valor, ' ',
      LOWER(p.nombre), ' ',
      p.codigoBarras, ' ',
      LOWER(u.nombre), ' '
    )) LIKE LOWER(CONCAT('%', :filter, '%'))
  """)
  Page<Venta> listarVentasPaginadas(String filter, Pageable pageable);
}
