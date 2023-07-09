package com.heckerForum.heckerForum.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.heckerForum.heckerForum.dto.CommentDto;
import com.heckerForum.heckerForum.dto.CommentRequest;
import com.heckerForum.heckerForum.models.Comment;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.service.CommentService;

@RestController
@RequestMapping("/api/comments")
public class CommentController extends BaseController {
	
	@Autowired
	private CommentService commentService;
	
	@PostMapping("{postId}")
	public ResponseEntity<?> createComments(@RequestBody CommentRequest commentRequest, @AuthenticationPrincipal User user) throws Exception {
		Comment newComment = commentService.save(commentRequest.getPostId(), user, commentRequest.getContent(), commentRequest.getReplyCommentId());
		
		return ResponseEntity.ok(newComment);
	}
	
	@GetMapping(params = { "page" , "size" })
	public ResponseEntity<?> getCommentByPagination(@RequestParam(defaultValue="0") Integer page, @RequestParam(defaultValue="10") Integer size) {		
		return ResponseEntity.ok(commentService.findAllByPagination(page, size, "id"));
	}
	
	@GetMapping("{commentId}")
	public ResponseEntity<?> getCommentById(@PathVariable Long commentId) {
		CommentDto commentDto = commentService.findByCommentId(commentId);
		return ResponseEntity.ok(commentDto);
	}
	
}
