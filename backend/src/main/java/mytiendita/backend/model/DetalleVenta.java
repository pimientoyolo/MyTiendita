package mytiendita.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "detalle_venta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleVenta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_producto", referencedColumnName = "id")
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_venta", referencedColumnName = "id")
    private Venta venta;

    @Column(name = "cantidad")
    private Double cantidad;

    @Column(name = "valor")
    private Double valor;
}
