package com.heckerForum.heckerForum.dto;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ExceptionMessage {
	private HttpStatus status;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-mm-yyyy hh:mm:ss")
	private LocalDateTime timestamp;
	private String errorMessage;
	
	public ExceptionMessage(HttpStatus status, String errorMessage) {
		this.timestamp = LocalDateTime.now();
		this.status = status;
		this.errorMessage = errorMessage;
	}
}
