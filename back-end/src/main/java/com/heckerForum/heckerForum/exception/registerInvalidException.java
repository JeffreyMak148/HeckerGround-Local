package com.heckerForum.heckerForum.exception;

public class registerInvalidException extends Exception {
	private static final long serialVersionUID = 3102625167489237217L;

	public registerInvalidException() {
		super();
	}
	
	public registerInvalidException(String errorMessage) {
		super(errorMessage);
	}
}
