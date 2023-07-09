package com.heckerForum.heckerForum.dto;

import java.util.List;

import com.heckerForum.heckerForum.models.Post;
import com.heckerForum.heckerForum.models.User;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileResponse {
	private User user;
	private List<Post> posts;
	
	public ProfileResponse(User user, List<Post> posts) {
		this.user = user;
		this.posts = posts;
	}
}
