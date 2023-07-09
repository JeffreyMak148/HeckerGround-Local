package com.heckerForum.heckerForum.service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.heckerForum.heckerForum.models.User;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserDetailsImpl implements UserDetails{
	private static final long serialVersionUID = -8842746013501711512L;
	private Long id;
	private String username;
	@JsonIgnore
	private String password;
	private String email;
	private Collection<? extends GrantedAuthority> authorities;
	
	public UserDetailsImpl(Long id, String username, String email, String password,
		      Collection<? extends GrantedAuthority> authorities) {
	    this.id = id;
	    this.username = username;
	    this.email = email;
	    this.password = password;
	    this.authorities = authorities;
	}
	
	public static UserDetailsImpl build(User user) {
	    List<GrantedAuthority> authorities = user.getAuthorities().stream()
	        .map(authority -> new SimpleGrantedAuthority(authority.getAuthority()))
	        .collect(Collectors.toList());

	    return new UserDetailsImpl(
	        user.getId(), 
	        user.getUsername(), 
	        user.getEmail(),
	        user.getPassword(), 
	        authorities);
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
