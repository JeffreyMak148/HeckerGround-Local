package com.heckerForum.heckerForum.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequest {
	private Integer catId;
	private String title;
	private String content;
}
