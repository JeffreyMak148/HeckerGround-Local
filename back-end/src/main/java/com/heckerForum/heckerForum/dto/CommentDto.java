package com.heckerForum.heckerForum.dto;

import java.util.List;

import com.heckerForum.heckerForum.models.Comment;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDto {
	private Comment comment;
	private List<Comment> replyComments;
	
	public CommentDto(Comment comment, List<Comment> replyComments) {
		this.comment = comment;
		this.replyComments = replyComments;
	}
}
