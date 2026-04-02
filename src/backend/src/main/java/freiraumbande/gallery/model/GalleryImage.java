package freiraumbande.gallery.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gallery_image")
public class GalleryImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private String originalName;

    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        uploadedAt = LocalDateTime.now();
    }

    public GalleryImage() {}

    public GalleryImage(String filename, String originalName) {
        this.filename = filename;
        this.originalName = originalName;
    }

    public Long getId() { return id; }
    public String getFilename() { return filename; }
    public String getOriginalName() { return originalName; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
}
