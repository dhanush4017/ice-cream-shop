package com.icytales.backend.controller;

import com.icytales.backend.dto.auth.LoginRequest;
import com.icytales.backend.dto.auth.RegisterRequest;
import com.icytales.backend.security.AuthTokenService;
import com.icytales.backend.security.AuthGuard;
import com.icytales.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final AuthTokenService tokens;
    private final AuthGuard guard;
    public AuthController(AuthService authService, AuthTokenService tokens, AuthGuard guard) { this.authService=authService; this.tokens=tokens; this.guard=guard; }

    @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED)
    public Map<String,Object> register(@Valid @RequestBody RegisterRequest request){ return authService.register(request); }

    @PostMapping("/login")
    public Map<String,Object> login(@Valid @RequestBody LoginRequest request){ return authService.login(request); }

    @PostMapping("/logout")
    public Map<String,Object> logout(HttpServletRequest request){
        String auth=request.getHeader("Authorization");
        if(auth!=null && auth.startsWith("Bearer ")) tokens.revoke(auth.substring(7).trim());
        return Map.of("success",true);
    }

    @GetMapping("/me")
    public Map<String,Object> me(HttpServletRequest request){
        var s=guard.requireUser(request);
        return Map.of("name",s.userIdValue(),"email",s.email(),"userId",s.userIdValue(),"role",s.role());
    }
}
