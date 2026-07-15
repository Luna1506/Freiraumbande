package freiraumbande.content.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface ContentService {

    /** Alle überschriebenen Inhalte als Key-Value-Map. */
    Map<String, String> findAll();

    /**
     * Upsert der übergebenen Einträge. Ein leerer oder null-Wert löscht den
     * Eintrag (Zurücksetzen auf den Frontend-Default).
     */
    Map<String, String> updateAll(Map<String, String> entries);

    /** Speichert ein neues Hintergrundbild und liefert dessen öffentliche URL. */
    String uploadBackground(MultipartFile file) throws IOException;

    /** Entfernt das eigene Hintergrundbild (zurück zum Standard). */
    void resetBackground();
}
