package freiraumbande.members.controller;

import freiraumbande.members.dto.MemberDTO;
import freiraumbande.members.service.MemberService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.CacheControl;
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
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api")
public class MemberController {

    private final MemberService memberService;
    private final Path uploadPath;

    public MemberController(
            MemberService memberService,
            @Value("${file.upload-dir:./uploads}") String uploadDir) {
        this.memberService = memberService;
        this.uploadPath = Paths.get(uploadDir, "members").toAbsolutePath().normalize();
    }

    /** Öffentlich: alle Mitglieder (älteste zuerst). */
    @GetMapping("/members")
    public List<MemberDTO> getAllMembers() {
        return memberService.findAll();
    }

    /** Admin: neues Mitglied anlegen — Foto ist optional. */
    @PostMapping("/members")
    public ResponseEntity<MemberDTO> createMember(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam(value = "role", required = false) String role) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(memberService.create(name, role, file));
    }

    /** Admin: Mitglied aktualisieren — neues Foto optional, removePhoto entfernt das vorhandene. */
    @PutMapping("/members/{id}")
    public MemberDTO updateMember(
            @PathVariable Long id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam(value = "role", required = false) String role,
            @RequestParam(value = "removePhoto", required = false, defaultValue = "false") boolean removePhoto)
            throws IOException {
        return memberService.update(id, name, role, file, removePhoto);
    }

    /** Admin: Mitglied löschen (inkl. Foto). */
    @DeleteMapping("/members/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        memberService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /** Öffentlich: Mitglieder-Fotos ausliefern. */
    @GetMapping("/uploads/members/{filename:.+}")
    public ResponseEntity<Resource> servePhoto(@PathVariable String filename) {
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
            return ResponseEntity.ok()
                    .contentType(mediaType)
                    // UUID-Dateinamen ändern sich pro Upload → dauerhaft cachebar
                    .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePublic().immutable())
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
