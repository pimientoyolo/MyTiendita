package mytiendita.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BalanceDTO {

    Double balance = 0.0;

    Double ganancia = 0.0;

    Double gasto = 0.0;

    Double balanceAnterior = 0.0;

    Double gananciaAnterior = 0.0;

    Double gastoAnterior = 0.0;

    Double porcentajeMejora = 0.0;
}
