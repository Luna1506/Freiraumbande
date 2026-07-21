package freiraumbande.members.service.impl;

import freiraumbande.members.dto.MemberDTO;
import freiraumbande.members.exception.MemberNotFoundException;
import freiraumbande.members.model.Member;
import freiraumbande.members.repository.MemberRepository;
import freiraumbande.members.service.MemberService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class MemberServiceImpl implements MemberService {

    private static final String IMAGE_URL_PREFIX = "/api/uploads/members/";
    // Extension aus dem geprüften Content-Type, nie aus dem Client-Dateinamen
    private static final Map<String, String> EXTENSION_BY_TYPE = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp",
            "image/avif", ".avif");

    private final MemberRepository repository;
    private final Path uploadPath;

    public MemberServiceImpl(
            MemberRepository repository,
            @Value("${file.upload-dir:./uploads}") String uploadDir) throws IOException {
        this.repository = repository;
        // Absolut + normalisiert, damit der startsWith-Traversal-Check auch bei
        // relativem upload-dir (lokale Entwicklung) greift
        this.uploadPath = Paths.get(uploadDir, "members").toAbsolutePath().normalize();
        Files.createDirectories(this.uploadPath);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MemberDTO> findAll() {
        return repository.findAllByOrderByCreatedAtAsc().stream().map(this::toDTO).toList();
    }

    @Override
    @Transactional
    public MemberDTO create(String name, String role, MultipartFile photo) throws IOException {
        String filename = hasPhoto(photo) ? storePhoto(photo) : null;
        Member member = new Member(validateName(name), normalizeRole(role), filename);
        return toDTO(repository.save(member));
    }

    @Override
    @Transactional
    public MemberDTO update(Long id, String name, String role, MultipartFile photo, boolean removePhoto)
            throws IOException {
        Member member = repository.findById(id).orElseThrow(() -> new MemberNotFoundException(id));
        member.setName(validateName(name));
        member.setRole(normalizeRole(role));
        if (hasPhoto(photo)) {
            // Altes Foto erst NACH dem erfolgreichen Speichern entfernen,
            // damit die DB nie auf eine bereits gelöschte Datei zeigt
            String previous = member.getFilename();
            member.setFilename(storePhoto(photo));
            repository.saveAndFlush(member);
            deletePhotoQuietly(previous);
        } else if (removePhoto && member.getFilename() != null) {
            String previous = member.getFilename();
            member.setFilename(null);
            repository.saveAndFlush(member);
            deletePhotoQuietly(previous);
        }
        return toDTO(member);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Member member = repository.findById(id).orElseThrow(() -> new MemberNotFoundException(id));
        repository.delete(member);
        deletePhotoQuietly(member.getFilename());
    }

    private String validateName(String name) {
        if (name == null || name.isBlank() || name.trim().length() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name fehlt oder ist zu lang (max. 100 Zeichen)");
        }
        return name.trim();
    }

    /** Leere Rolle wird zu null — so bleibt das Feld in der Anzeige sauber optional. */
    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) return null;
        String trimmed = role.trim();
        if (trimmed.length() > 150) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rolle ist zu lang (max. 150 Zeichen)");
        }
        return trimmed;
    }

    private boolean hasPhoto(MultipartFile photo) {
        return photo != null && !photo.isEmpty();
    }

    private String storePhoto(MultipartFile photo) throws IOException {
        String contentType = photo.getContentType();
        String extension = contentType == null ? null : EXTENSION_BY_TYPE.get(contentType);
        if (extension == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Nur Bilddateien (JPEG, PNG, WebP, AVIF) sind erlaubt");
        }
        String filename = UUID.randomUUID() + extension;
        photo.transferTo(uploadPath.resolve(filename));
        return filename;
    }

    /** Best-effort-Löschung — ein Fehler hier darf die eigentliche Operation nicht zurückrollen. */
    private void deletePhotoQuietly(String filename) {
        if (filename == null) return;
        Path target = uploadPath.resolve(filename).normalize();
        if (!target.startsWith(uploadPath)) return;
        try {
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // Datei-Leiche ist verschmerzbar
        }
    }

    private MemberDTO toDTO(Member member) {
        return new MemberDTO(
                member.getId(),
                member.getName(),
                member.getRole(),
                member.getFilename() == null ? null : IMAGE_URL_PREFIX + member.getFilename(),
                member.getCreatedAt()
        );
    }
}
