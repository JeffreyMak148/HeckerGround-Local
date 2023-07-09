package com.heckerForum.heckerForum.dto;

import java.util.List;

import com.heckerForum.heckerForum.models.Comment;
import com.heckerForum.heckerForum.models.Post;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostResponse {
	private Post post;
	private List<Comment> comments;
	
	public PostResponse(Post post, List<Comment> comments) {
		this.post = post;
		this.comments = comments;
	}
}
