package com.heckerForum.heckerForum.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.heckerForum.heckerForum.filter.JwtFilter;
import com.heckerForum.heckerForum.service.UserDetailsServiceImpl;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class WebSecurityConfig {
	
	@Autowired 
	private UserDetailsServiceImpl userDetailService;
	
	@Autowired
	private JwtFilter jwtFilter;
	
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		
		http = http.cors().and().csrf().disable();
		
		http = http.sessionManagement()
				.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				.and();
		
		http = http.exceptionHandling()
				.authenticationEntryPoint((request, response, e) -> {
					response.sendError(HttpServletResponse.SC_UNAUTHORIZED, e.getMessage());
				}).and();
		
		http.authorizeHttpRequests()
			.requestMatchers("/api/auth/**").permitAll()
			.requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll()
			.requestMatchers(HttpMethod.GET, "/api/comments/**").permitAll()
			.requestMatchers(HttpMethod.GET, "/api/profile/**").permitAll()
			.requestMatchers(HttpMethod.GET, "/api/auth/loggedin").authenticated()
			.anyRequest().authenticated();
		
		http.authenticationProvider(authenticationProvider());

		http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		
		return http.build();
	}
	
	@Bean
	public DaoAuthenticationProvider authenticationProvider() {
	    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
	       
	    authProvider.setUserDetailsService(userDetailService);
	    authProvider.setPasswordEncoder(passwordEncoder());
	   
	    return authProvider;
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}
}
