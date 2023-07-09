package com.heckerForum.heckerForum.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.heckerForum.heckerForum.dto.ExceptionMessage;

public class BaseController {
	@ExceptionHandler(Exception.class)
	protected ResponseEntity<?> handleException(Exception e) {
		ExceptionMessage message = new ExceptionMessage(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
		return new ResponseEntity<>(message, message.getStatus());
	}
}
