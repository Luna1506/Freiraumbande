package freiraumbande.events.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public record CreateEventRequest(
        @NotBlank String title,
        String description,
        @NotNull LocalDate date,
        LocalTime time,
        String location
) {}
