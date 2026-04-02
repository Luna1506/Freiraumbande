package freiraumbande.gallery.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class GalleryImageNotFoundException extends RuntimeException {
    public GalleryImageNotFoundException(Long id) {
        super("Galerie-Bild nicht gefunden: " + id);
    }
}
