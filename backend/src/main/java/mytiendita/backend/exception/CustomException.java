package mytiendita.backend.exception;

public class CustomException extends RuntimeException {

    // Constructor que recibe mensaje y código de error
    public CustomException(String message) {
        super(message);
    }
}
