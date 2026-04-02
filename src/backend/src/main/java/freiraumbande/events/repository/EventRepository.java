package freiraumbande.events.repository;

import freiraumbande.events.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findAllByOrderByDateAscTimeAsc();
    List<Event> findByDateGreaterThanEqualOrderByDateAscTimeAsc(LocalDate from);
}
