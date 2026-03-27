package freiraumbande.auth.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import freiraumbande.auth.service.JwtService;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwt;

    public JwtAuthFilter(JwtService jwt) {
        this.jwt = jwt;
    }

    // Optional: bestimmte Pfade komplett skippen
    private final RequestMatcher skip =
            request -> {
                String p = request.getRequestURI();
                return p.startsWith("/swagger-ui")
                        || p.startsWith("/v3/api-docs")
                        || p.startsWith("/api/auth")
                        || p.startsWith("/actuator");
            };

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return skip.matches(request);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
        String token = extractBearer(auth);

        if (token != null) {
            try {
                if (jwt.isAccessToken(token)) {
                    Long userId = jwt.getUserId(token);

                    // Minimal auth: principal=userId, keine roles
                    var authentication =
                            new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception ignored) {
                // invalid token -> einfach keine Auth setzen
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }

    private static String extractBearer(String authorization) {
        if (authorization == null) return null;
        if (!authorization.startsWith("Bearer ")) return null;
        String t = authorization.substring("Bearer ".length()).trim();
        return t.isEmpty() ? null : t;
    }
}
