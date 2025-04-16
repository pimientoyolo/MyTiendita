package mytiendita.backend.config;

import mytiendita.backend.exception.CustomException;
import mytiendita.backend.exception.ErrorDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Maneja todas las excepciones genéricas
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDTO> handleGeneralException(Exception ex) {
        ErrorDTO errorDTO = new ErrorDTO(
                "Error interno del servidor: " + ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Puedes crear manejadores específicos para distintas excepciones
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorDTO> handleNotFoundException(CustomException ex) {
        ErrorDTO errorDTO = new ErrorDTO(
                ex.getMessage(),
                HttpStatus.CONFLICT.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorDTO, HttpStatus.CONFLICT);
    }



}
