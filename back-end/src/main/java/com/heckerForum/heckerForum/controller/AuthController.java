package com.heckerForum.heckerForum.controller;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.heckerForum.heckerForum.dto.LoginRequest;
import com.heckerForum.heckerForum.dto.RegisterRequest;
import com.heckerForum.heckerForum.dto.UserInfoResponse;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.repository.UserRepository;
import com.heckerForum.heckerForum.util.JwtUtil;

import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/auth")
@Log4j2
public class AuthController extends BaseController {
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private JwtUtil jwtUtil;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@GetMapping("/loggedin")
	public Principal getIsLoggedIn(Principal principal) {
		return principal;
	}
	
	@PostMapping("/signin")
	public ResponseEntity<?> signIn(@Valid @RequestBody LoginRequest req) {
		try {
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
			
			SecurityContextHolder.getContext().setAuthentication(authentication);
			
			User user = (User) authentication.getPrincipal();
			
			ResponseCookie jwtCookie = jwtUtil.generateJwtCookie(user);
			
			List<String> roles = user.getAuthorities().stream()
					.map(item -> item.getAuthority())
					.collect(Collectors.toList());
			
			return ResponseEntity.ok()
					.header(
							HttpHeaders.SET_COOKIE,
							jwtCookie.toString()
							)
					.body(new UserInfoResponse(user.getId(),
											   user.getUsername(),
											   user.getEmail(),
											   roles));
		} catch(BadCredentialsException e) {
			log.debug(e.getMessage());
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}
	}
	
	@PostMapping("/signup")
	  public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest req) {
	    if (userRepository.existsByUsername(req.getUsername())) {
	      return ResponseEntity.badRequest().body("Error: Username is already taken!");
	    }

	    if (userRepository.existsByEmail(req.getEmail())) {
	      return ResponseEntity.badRequest().body("Error: Email is already in use!");
	    }

	    // Create new user's account
	    User user = new User(req.getUsername(),
	    					 passwordEncoder.encode(req.getPassword()),
	                         req.getEmail());

//	    Set<String> strRoles = signUpRequest.getRole();
//	    Set<Role> roles = new HashSet<>();
//
//	    if (strRoles == null) {
//	      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
//	          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//	      roles.add(userRole);
//	    } else {
//	      strRoles.forEach(role -> {
//	        switch (role) {
//	        case "admin":
//	          Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
//	              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//	          roles.add(adminRole);
//
//	          break;
//	        case "mod":
//	          Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
//	              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//	          roles.add(modRole);
//
//	          break;
//	        default:
//	          Role userRole = roleRepository.findByName(ERole.ROLE_USER)
//	              .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
//	          roles.add(userRole);
//	        }
//	      });
//	    }
//	    user.setRoles(roles);

	    User registeredUser = userRepository.save(user);

	    return ResponseEntity.ok(registeredUser);
	  }

	  @PostMapping("/signout")
	  public ResponseEntity<?> logoutUser() {
	    ResponseCookie cookie = jwtUtil.getCleanJwtCookie();
	    return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString())
	        .body("You've been signed out!");
	  }
}
