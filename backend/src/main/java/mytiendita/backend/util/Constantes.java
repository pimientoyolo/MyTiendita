package mytiendita.backend.util;

import java.util.List;

public class Constantes {

    public static final Long ID_TIPO_MOVIMIENTO_VENTA = 1L;
    public static final Long ID_TIPO_MOVIMIENTO_COMPRA = 2L;
    public static final Long ID_TIPO_MOVIMIENTO_SALIDA = 3L;
    public static final Long ID_TIPO_MOVIMIENTO_ENTRADA = 4L;

    public static final List<Long>
            IDS_TIPO_MOVIMIENTO_SALIDA_ENTRADA = List.of(ID_TIPO_MOVIMIENTO_SALIDA, ID_TIPO_MOVIMIENTO_ENTRADA);

    public static final Long ID_UNIDAD = 1L;
}
