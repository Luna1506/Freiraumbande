package freiraumbande.members.service;

import freiraumbande.members.dto.MemberDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface MemberService {
    List<MemberDTO> findAll();

    /** Legt ein Mitglied an — das Foto ist optional. */
    MemberDTO create(String name, String role, MultipartFile photo) throws IOException;

    /**
     * Aktualisiert Name/Rolle. Ein neues Foto ist optional (null = behalten);
     * removePhoto entfernt das vorhandene Foto (wird von einem neuen Foto übersteuert).
     */
    MemberDTO update(Long id, String name, String role, MultipartFile photo, boolean removePhoto)
            throws IOException;

    void delete(Long id);
}
