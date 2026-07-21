package freiraumbande.members.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "member")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    /** Optionaler Kurztext unter dem Namen, z. B. Rolle im Verein. */
    @Column(length = 150)
    private String role;

    /** Dateiname des Fotos im Upload-Verzeichnis (uploads/members) — optional. */
    @Column
    private String filename;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Member() {}

    public Member(String name, String role, String filename) {
        this.name = name;
        this.role = role;
        this.filename = filename;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getFilename() { return filename; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setName(String name) { this.name = name; }
    public void setRole(String role) { this.role = role; }
    public void setFilename(String filename) { this.filename = filename; }
}
