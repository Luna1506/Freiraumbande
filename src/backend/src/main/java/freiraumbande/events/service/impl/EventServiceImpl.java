package freiraumbande.events.service.impl;

import freiraumbande.events.dto.CreateEventRequest;
import freiraumbande.events.dto.EventDTO;
import freiraumbande.events.exception.EventNotFoundException;
import freiraumbande.events.model.Event;
import freiraumbande.events.repository.EventRepository;
import freiraumbande.events.service.EventService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventServiceImpl implements EventService {

    private final EventRepository eventRepository;

    public EventServiceImpl(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    public List<EventDTO> findAll() {
        return eventRepository.findAllByOrderByDateAscTimeAsc()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public EventDTO findById(Long id) {
        return eventRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new EventNotFoundException(id));
    }

    @Override
    public EventDTO create(CreateEventRequest request) {
        Event event = new Event();
        applyRequest(event, request);
        return toDTO(eventRepository.save(event));
    }

    @Override
    public EventDTO update(Long id, CreateEventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException(id));
        applyRequest(event, request);
        return toDTO(eventRepository.save(event));
    }

    @Override
    public void delete(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new EventNotFoundException(id);
        }
        eventRepository.deleteById(id);
    }

    private void applyRequest(Event event, CreateEventRequest request) {
        event.setTitle(request.title());
        event.setDescription(request.description());
        event.setDate(request.date());
        event.setTime(request.time());
        event.setLocation(request.location());
    }

    private EventDTO toDTO(Event event) {
        return new EventDTO(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getDate(),
                event.getTime(),
                event.getLocation(),
                event.getCreatedAt()
        );
    }
}
