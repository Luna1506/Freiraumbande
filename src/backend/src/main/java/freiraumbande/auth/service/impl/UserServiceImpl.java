package freiraumbande.auth.service.impl;

import freiraumbande.auth.dto.LoginRequest;
import freiraumbande.auth.dto.LoginResponse;
import freiraumbande.auth.service.JwtService;
import freiraumbande.auth.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserServiceImpl implements UserService {

    private static final long ADMIN_ID = 1L;

    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsername;
    private final String adminPasswordHash;

    public UserServiceImpl(
            JwtService jwtService,
            PasswordEncoder passwordEncoder,
            @Value("${admin.username:admin}") String adminUsername,
            @Value("${admin.password:changeme}") String adminPassword) {
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.adminUsername = adminUsername;
        // Hash once at startup — never stored in DB
        this.adminPasswordHash = passwordEncoder.encode(adminPassword);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        if (!adminUsername.equals(request.username()) ||
                !passwordEncoder.matches(request.password(), adminPasswordHash)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Ungültige Anmeldedaten");
        }
        String token = jwtService.createAccessToken(ADMIN_ID, adminUsername);
        return new LoginResponse(token);
    }
}
