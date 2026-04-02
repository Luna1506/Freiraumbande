package freiraumbande.gallery.repository;

import freiraumbande.gallery.model.GalleryImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GalleryRepository extends JpaRepository<GalleryImage, Long> {
    List<GalleryImage> findAllByOrderByUploadedAtDesc();
}
