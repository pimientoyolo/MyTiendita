package mytiendita.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Table(name = "movimiento")
@Getter
@Setter
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
