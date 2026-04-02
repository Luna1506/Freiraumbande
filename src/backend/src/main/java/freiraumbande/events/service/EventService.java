package freiraumbande.events.service;

import freiraumbande.events.dto.CreateEventRequest;
import freiraumbande.events.dto.EventDTO;

import java.util.List;

public interface EventService {
    List<EventDTO> findAll();
    EventDTO findById(Long id);
    EventDTO create(CreateEventRequest request);
    EventDTO update(Long id, CreateEventRequest request);
    void delete(Long id);
}
