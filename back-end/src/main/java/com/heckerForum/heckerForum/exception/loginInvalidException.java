package com.heckerForum.heckerForum.exception;

public class loginInvalidException extends Exception {
	private static final long serialVersionUID = 3578303790354178931L;

	public loginInvalidException() {
		super();
	}
	
	public loginInvalidException(String errorMessage) {
		super(errorMessage);
	}
}
