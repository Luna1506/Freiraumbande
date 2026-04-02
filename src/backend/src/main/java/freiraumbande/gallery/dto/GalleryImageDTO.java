package freiraumbande.gallery.dto;

import java.time.LocalDateTime;

public record GalleryImageDTO(
        Long id,
        String url,
        String originalName,
        LocalDateTime uploadedAt
) {}
