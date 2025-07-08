package mytiendita.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "venta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Venta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "valor")
    private Double valor;

    @Column(name = "fecha")
    private Date fecha;

    @OneToMany(mappedBy = "venta", fetch = FetchType.LAZY, orphanRemoval = true)
    private List<DetalleVenta> detalleVentas;

}
