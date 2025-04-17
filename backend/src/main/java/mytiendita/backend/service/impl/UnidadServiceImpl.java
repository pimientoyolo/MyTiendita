package mytiendita.backend.service.impl;

import mytiendita.backend.model.Unidad;
import mytiendita.backend.repository.UnidadRepository;
import mytiendita.backend.service.interfaces.UnidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UnidadServiceImpl implements UnidadService {

    private UnidadRepository unidadRepository;

    @Override
    public List<Unidad> listarUnidades() {
        // Lógica para listar las unidades de medida
        return unidadRepository.findAll();
    }

    @Autowired
    public void setUnidadRepository(UnidadRepository unidadRepository) {
        this.unidadRepository = unidadRepository;
    }
}
