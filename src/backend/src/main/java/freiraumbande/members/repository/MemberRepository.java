package freiraumbande.members.repository;

import freiraumbande.members.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Long> {
    /** Älteste zuerst — Gründungsmitglieder stehen damit vorn. */
    List<Member> findAllByOrderByCreatedAtAsc();
}
