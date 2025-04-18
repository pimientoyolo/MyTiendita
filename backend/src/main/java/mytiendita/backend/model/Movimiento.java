package mytiendita.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "movimiento")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Movimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_tipo", referencedColumnName = "id")
    private TipoMovimiento tipoMovimiento;

    @Column(name = "valor")
    private Double valor;

    @Column(name = "fecha")
    private Date fecha;
}
