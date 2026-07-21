package freiraumbande.members.dto;

import java.time.LocalDateTime;

public record MemberDTO(
        Long id,
        String name,
        String role,
        String imageUrl,
        LocalDateTime createdAt
) {}
