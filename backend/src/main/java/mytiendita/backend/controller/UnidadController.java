package mytiendita.backend.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import mytiendita.backend.model.Unidad;
import mytiendita.backend.service.interfaces.UnidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/unidad")
@Tag(name = "Unidad", description = "Controlador para las unidades de medida")
public class UnidadController {

    private UnidadService unidadService;

    @GetMapping("/listar")
    public List<Unidad> listarUnidades() {
        // Lógica para listar las unidades de medida
        return unidadService.listarUnidades();
    }

    @Autowired
    public void setUnidadService(UnidadService unidadService) {
        this.unidadService = unidadService;
    }
}
