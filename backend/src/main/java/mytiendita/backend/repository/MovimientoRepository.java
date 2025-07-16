package mytiendita.backend.repository;

import mytiendita.backend.model.Movimiento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {

    List<Movimiento> findByFechaBetween(Date inicio, Date fin);

    @Query(
      """
        SELECT m FROM Movimiento m
        WHERE LOWER(CONCAT(
            LOWER(m.tipoMovimiento.nombre), ' ',
            m.valor, ' ',
            TO_CHAR(m.fecha, 'DD/MM/YYYY')
        )) LIKE LOWER(CONCAT('%', :filter, '%'))
        """
    )
    Page<Movimiento> findByFilter(String filter, Pageable pageable);

}
