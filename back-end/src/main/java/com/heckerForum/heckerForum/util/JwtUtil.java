package com.heckerForum.heckerForum.util;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import com.heckerForum.heckerForum.models.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;


@Log4j2
@Component
public class JwtUtil implements Serializable {
	
	private static final long serialVersionUID = 1L;

	public static final long JWT_TOKEN_VALIDITY = 7 * 24 * 60 * 60;
	
	@Value("${JWT_SECRET}")
	private String jwtSecret;
	
	@Value("${JWT_COOKIENAME}")
	private String jwtCookie;
	
	public String getJwtFromCookies(HttpServletRequest request) {
		Cookie cookie = WebUtils.getCookie(request, jwtCookie);
		if(cookie != null) {
			return cookie.getValue();
		} else {
			return null;
		}
	}
	
	public ResponseCookie generateJwtCookie(User userPrincipal) {
		String jwt = generateJwtTokenFromEmail(userPrincipal.getEmail());
		ResponseCookie cookie = ResponseCookie.from(jwtCookie, jwt).path("/api").maxAge(JWT_TOKEN_VALIDITY).httpOnly(true).build();
		return cookie;
	}
	
	public ResponseCookie getCleanJwtCookie() {
		ResponseCookie cookie = ResponseCookie.from(jwtCookie, null).path("/api").build();
		return cookie;
	}
	
	public String getUsernameFromJwtToken(String token) {
		return getClaimFromJwtToken(token, Claims::getSubject);
	}
	
	public String getEmailFromJwtToken(String token) {
		return getClaimFromJwtToken(token, Claims::getSubject);
	}
	
	public Date getIssuedAtDateFromJwtToken(String token) {
		return getClaimFromJwtToken(token, Claims::getIssuedAt);
	}
	
	public Date getExpirationDateFromJwtToken(String token) {
		return getClaimFromJwtToken(token, Claims::getExpiration);
	}
	
	public <T> T getClaimFromJwtToken(String token, Function<Claims, T> claimsResolver) {
		final Claims claims = getAllClaimsFromJwtToken(token);
		return claimsResolver.apply(claims);
	}
	
	private Claims getAllClaimsFromJwtToken(String token) {
		return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
	}
	
	private Boolean isJwtTokenExpired(String token) {
		final Date expiration = getExpirationDateFromJwtToken(token);
		return expiration.before(new Date());
	}
	
	private Boolean ignoreJwtTokenExpiration(String token) {
		// here you specify tokens, for that the expiration is ignored
		return false;
	}
	
	public String generateJwtToken(UserDetails userDetails) {
		Map<String, Object> claims = new HashMap<>();
		return doGenerateJwtToken(claims, userDetails.getUsername());
	}
	
	private String doGenerateJwtToken(Map<String, Object> claims, String subject) {
		return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
				.signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
	}
	
	public Boolean canJwtTokenBeRefreshed(String token) {
		return (!isJwtTokenExpired(token) || ignoreJwtTokenExpiration(token));
	}
	
//	public Boolean validateToken(String token, UserDetails userDetails) {
//		final String username = getUsernameFromToken(token);
//		return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
//	}
	
	public boolean validateJwtToken(String authToken) {
	    try {
	    	Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
	    	return true;
	    } catch (Exception e) {
	    	log.error(e.getMessage());
	    }
	
	    return false;
	}
	
	public String generateJwtTokenFromUsername(String username) {
		return Jwts.builder()
				.setSubject(username)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
				.signWith(SignatureAlgorithm.HS512, jwtSecret)
				.compact();
	}
	
	public String generateJwtTokenFromEmail(String email) {
		return Jwts.builder()
				.setSubject(email)
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + JWT_TOKEN_VALIDITY * 1000))
				.signWith(SignatureAlgorithm.HS512, jwtSecret)
				.compact();
	}

}
