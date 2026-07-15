package freiraumbande.content.service.impl;

import freiraumbande.content.model.SiteContent;
import freiraumbande.content.repository.SiteContentRepository;
import freiraumbande.content.service.ContentService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.dao.DataIntegrityViolationException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class ContentServiceImpl implements ContentService {

    public static final String BACKGROUND_KEY = "design.backgroundImage";
    private static final String BACKGROUND_URL_PREFIX = "/api/uploads/backgrounds/";
    // Extension wird aus dem geprüften Content-Type abgeleitet — nie aus dem Client-Dateinamen
    private static final Map<String, String> EXTENSION_BY_TYPE = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp",
            "image/avif", ".avif");

    private final SiteContentRepository repository;
    private final Path backgroundPath;

    public ContentServiceImpl(
            SiteContentRepository repository,
            @Value("${file.upload-dir:./uploads}") String uploadDir) throws IOException {
        this.repository = repository;
        // Absolut + normalisiert, sonst schlägt der startsWith-Traversal-Check
        // bei relativem upload-dir (lokale Entwicklung) für legitime Dateien fehl
        this.backgroundPath = Paths.get(uploadDir, "backgrounds").toAbsolutePath().normalize();
        Files.createDirectories(this.backgroundPath);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, String> findAll() {
        Map<String, String> result = new LinkedHashMap<>();
        for (SiteContent entry : repository.findAll()) {
            result.put(entry.getContentKey(), entry.getContentValue());
        }
        return result;
    }

    @Override
    @Transactional
    public Map<String, String> updateAll(Map<String, String> entries) {
        for (Map.Entry<String, String> entry : entries.entrySet()) {
            String key = entry.getKey();
            String value = entry.getValue();
            if (key == null || key.isBlank() || key.length() > 128) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ungültiger Content-Key");
            }
            if (BACKGROUND_KEY.equals(key)) {
                // Sonst blieben Bilddateien verwaist liegen
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Das Hintergrundbild wird über /api/content/background verwaltet");
            }
            if (value == null || value.isBlank()) {
                repository.findByContentKey(key).ifPresent(repository::delete);
            } else {
                upsert(key, value);
            }
        }
        return findAll();
    }

    @Override
    @Transactional
    public String uploadBackground(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Leere Datei");
        }
        String contentType = file.getContentType();
        String extension = contentType == null ? null : EXTENSION_BY_TYPE.get(contentType);
        if (extension == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Nur Bilddateien (JPEG, PNG, WebP, AVIF) sind erlaubt");
        }

        String filename = UUID.randomUUID() + extension;
        file.transferTo(backgroundPath.resolve(filename));

        // Altes Bild erst NACH dem erfolgreichen DB-Update entfernen,
        // damit die DB nie auf eine bereits gelöschte Datei zeigt
        String previousFilename = storedBackgroundFilename();
        upsert(BACKGROUND_KEY, BACKGROUND_URL_PREFIX + filename);
        deleteBackgroundFileQuietly(previousFilename);

        return BACKGROUND_URL_PREFIX + filename;
    }

    @Override
    @Transactional
    public void resetBackground() {
        String filename = storedBackgroundFilename();
        repository.findByContentKey(BACKGROUND_KEY).ifPresent(repository::delete);
        deleteBackgroundFileQuietly(filename);
    }

    private void upsert(String key, String value) {
        SiteContent content = repository.findByContentKey(key)
                .orElseGet(() -> new SiteContent(key, null));
        content.setContentValue(value);
        try {
            repository.saveAndFlush(content);
        } catch (DataIntegrityViolationException e) {
            // Paralleler Schreibzugriff auf denselben neuen Key
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Gleichzeitige Änderung erkannt — bitte erneut versuchen");
        }
    }

    /** Dateiname des aktuell hinterlegten Hintergrundbilds oder null. */
    private String storedBackgroundFilename() {
        return repository.findByContentKey(BACKGROUND_KEY)
                .map(SiteContent::getContentValue)
                .filter(value -> value != null && value.startsWith(BACKGROUND_URL_PREFIX))
                .map(value -> value.substring(BACKGROUND_URL_PREFIX.length()))
                .orElse(null);
    }

    /** Best-effort-Löschung — ein Fehler hier darf die eigentliche Operation nicht zurückrollen. */
    private void deleteBackgroundFileQuietly(String filename) {
        if (filename == null) return;
        Path target = backgroundPath.resolve(filename).normalize();
        if (!target.startsWith(backgroundPath)) return;
        try {
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // Datei-Leiche ist verschmerzbar; Upload/Reset soll trotzdem gelingen
        }
    }
}
