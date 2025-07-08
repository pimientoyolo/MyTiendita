package mytiendita.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "unidad")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Unidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "descripcion")
    private String descripcion;
}
