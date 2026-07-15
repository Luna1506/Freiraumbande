package freiraumbande.content.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "site_content")
public class SiteContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "content_key", nullable = false, unique = true, length = 128)
    private String contentKey;

    @Column(name = "content_value", columnDefinition = "TEXT")
    private String contentValue;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onWrite() {
        updatedAt = LocalDateTime.now();
    }

    public SiteContent() {}

    public SiteContent(String contentKey, String contentValue) {
        this.contentKey = contentKey;
        this.contentValue = contentValue;
    }

    public Long getId() { return id; }
    public String getContentKey() { return contentKey; }
    public String getContentValue() { return contentValue; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setContentKey(String contentKey) { this.contentKey = contentKey; }
    public void setContentValue(String contentValue) { this.contentValue = contentValue; }
}
