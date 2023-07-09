package com.heckerForum.heckerForum.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequest {
	private Long postId;
	private String content;
	private Long replyCommentId;
}
