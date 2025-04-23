package mytiendita.backend.repository;

import mytiendita.backend.model.TipoMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoMovimientoRepository extends JpaRepository<TipoMovimiento, Long> {

    List<TipoMovimiento> findByIdIn(List<Long> ids);

}
