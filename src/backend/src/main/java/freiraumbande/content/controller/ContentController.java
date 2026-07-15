package freiraumbande.content.controller;

import freiraumbande.content.service.ContentService;
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
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContentController {

    private final ContentService contentService;
    private final Path backgroundPath;

    public ContentController(
            ContentService contentService,
            @Value("${file.upload-dir:./uploads}") String uploadDir) {
        this.contentService = contentService;
        // Absolut + normalisiert, damit der startsWith-Check auch bei relativem upload-dir greift
        this.backgroundPath = Paths.get(uploadDir, "backgrounds").toAbsolutePath().normalize();
    }

    /** Öffentlich: alle angepassten Texte/Einstellungen. */
    @GetMapping("/content")
    public Map<String, String> getContent() {
        return contentService.findAll();
    }

    /** Admin: Texte aktualisieren (leerer Wert = Zurücksetzen auf Default). */
    @PutMapping("/content")
    public Map<String, String> updateContent(@RequestBody Map<String, String> entries) {
        return contentService.updateAll(entries);
    }

    /** Admin: neues Hintergrundbild hochladen. */
    @PostMapping("/content/background")
    public ResponseEntity<Map<String, String>> uploadBackground(
            @RequestParam("file") MultipartFile file) throws IOException {
        String url = contentService.uploadBackground(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("url", url));
    }

    /** Admin: Hintergrundbild auf den Standard zurücksetzen. */
    @DeleteMapping("/content/background")
    public ResponseEntity<Void> resetBackground() {
        contentService.resetBackground();
        return ResponseEntity.noContent().build();
    }

    /** Öffentlich: gespeicherte Hintergrundbilder ausliefern. */
    @GetMapping("/uploads/backgrounds/{filename:.+}")
    public ResponseEntity<Resource> serveBackground(@PathVariable String filename) {
        try {
            Path file = backgroundPath.resolve(filename).normalize();
            if (!file.startsWith(backgroundPath)) {
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
