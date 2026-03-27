package freiraumbande.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;

public interface JwtService {

    String createAccessToken(Long userId, String email);

    Jws<Claims> parse(String token) throws JwtException;

    Long getUserId(String token);

    boolean isAccessToken(String token);
}
