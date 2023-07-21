package com.heckerForum.heckerForum.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.heckerForum.heckerForum.dto.ExceptionMessage;
import com.heckerForum.heckerForum.exception.loginInvalidException;

public class BaseController {
	@ExceptionHandler(loginInvalidException.class)
	protected ResponseEntity<?> handleException(loginInvalidException e) {
		ExceptionMessage message = new ExceptionMessage(HttpStatus.UNAUTHORIZED, e.getMessage());
		return new ResponseEntity<>(message, message.getStatus());
	}
	
	@ExceptionHandler(Exception.class)
	protected ResponseEntity<?> handleException(Exception e) {
		ExceptionMessage message = new ExceptionMessage(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
		return new ResponseEntity<>(message, message.getStatus());
	}
	
}
