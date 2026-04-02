package freiraumbande.gallery.service.impl;

import freiraumbande.gallery.dto.GalleryImageDTO;
import freiraumbande.gallery.exception.GalleryImageNotFoundException;
import freiraumbande.gallery.model.GalleryImage;
import freiraumbande.gallery.repository.GalleryRepository;
import freiraumbande.gallery.service.GalleryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class GalleryServiceImpl implements GalleryService {

    private final GalleryRepository galleryRepository;
    private final Path uploadPath;

    public GalleryServiceImpl(
            GalleryRepository galleryRepository,
            @Value("${file.upload-dir:./uploads}") String uploadDir) throws IOException {
        this.galleryRepository = galleryRepository;
        this.uploadPath = Paths.get(uploadDir, "gallery");
        Files.createDirectories(this.uploadPath);
    }

    @Override
    public List<GalleryImageDTO> findAll() {
        return galleryRepository.findAllByOrderByUploadedAtDesc()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public GalleryImageDTO upload(MultipartFile file) throws IOException {
        String extension = getExtension(file.getOriginalFilename());
        String filename = UUID.randomUUID() + extension;
        file.transferTo(uploadPath.resolve(filename));

        GalleryImage image = new GalleryImage(filename, file.getOriginalFilename());
        return toDTO(galleryRepository.save(image));
    }

    @Override
    public void delete(Long id) throws IOException {
        GalleryImage image = galleryRepository.findById(id)
                .orElseThrow(() -> new GalleryImageNotFoundException(id));
        Files.deleteIfExists(uploadPath.resolve(image.getFilename()));
        galleryRepository.delete(image);
    }

    private GalleryImageDTO toDTO(GalleryImage image) {
        return new GalleryImageDTO(
                image.getId(),
                "/api/uploads/gallery/" + image.getFilename(),
                image.getOriginalName(),
                image.getUploadedAt()
        );
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.'));
    }
}
