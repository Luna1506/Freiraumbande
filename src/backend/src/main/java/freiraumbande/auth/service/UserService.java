package freiraumbande.auth.service;

import freiraumbande.auth.dto.LoginRequest;
import freiraumbande.auth.dto.LoginResponse;

public interface UserService {
    LoginResponse login(LoginRequest request);
}
