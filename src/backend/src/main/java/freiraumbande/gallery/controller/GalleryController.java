package freiraumbande.gallery.controller;

import freiraumbande.gallery.dto.GalleryImageDTO;
import freiraumbande.gallery.service.GalleryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api")
public class GalleryController {

    private final GalleryService galleryService;
    private final Path uploadPath;

    public GalleryController(
            GalleryService galleryService,
            @Value("${file.upload-dir:./uploads}") String uploadDir) {
        this.galleryService = galleryService;
        this.uploadPath = Paths.get(uploadDir, "gallery");
    }

    @GetMapping("/gallery")
    public List<GalleryImageDTO> getAllImages() {
        return galleryService.findAll();
    }

    @PostMapping("/gallery/upload")
    public ResponseEntity<GalleryImageDTO> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(galleryService.upload(file));
    }

    @DeleteMapping("/gallery/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) throws IOException {
        galleryService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/uploads/gallery/{filename:.+}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = uploadPath.resolve(filename).normalize();
            if (!file.startsWith(uploadPath)) {
                return ResponseEntity.badRequest().build();
            }
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            String contentType = Files.probeContentType(file);
            MediaType mediaType = contentType != null
                    ? MediaType.parseMediaType(contentType)
                    : MediaType.APPLICATION_OCTET_STREAM;
            return ResponseEntity.ok().contentType(mediaType).body(resource);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
