package freiraumbande.gallery.service;

import freiraumbande.gallery.dto.GalleryImageDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface GalleryService {
    List<GalleryImageDTO> findAll();
    GalleryImageDTO upload(MultipartFile file) throws IOException;
    void delete(Long id) throws IOException;
}
