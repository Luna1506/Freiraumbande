package freiraumbande.events.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record EventDTO(
        Long id,
        String title,
        String description,
        LocalDate date,
        LocalTime time,
        String location,
        LocalDateTime createdAt
) {}
