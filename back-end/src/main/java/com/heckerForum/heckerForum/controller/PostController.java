package com.heckerForum.heckerForum.controller;

import java.util.List;
import java.util.Optional;

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

import com.heckerForum.heckerForum.dto.PostRequest;
import com.heckerForum.heckerForum.dto.PostResponse;
import com.heckerForum.heckerForum.enums.PostCategoryEnum;
import com.heckerForum.heckerForum.exception.PostNotFoundException;
import com.heckerForum.heckerForum.models.Comment;
import com.heckerForum.heckerForum.models.Post;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.service.CommentService;
import com.heckerForum.heckerForum.service.PostService;

@RestController
@RequestMapping("/api/posts")
public class PostController extends BaseController {
	
	@Autowired
	private PostService postService;
	
	@Autowired
	private CommentService commentService;
	
	@PostMapping("")
	public ResponseEntity<?> createPosts(@RequestBody PostRequest postRequest, @AuthenticationPrincipal User user) throws Exception {
		Post newPost = postService.save(user, postRequest.getCatId(), postRequest.getTitle(), postRequest.getContent());
		
		return ResponseEntity.ok(newPost);
	}
	
	@GetMapping("")
	public ResponseEntity<?> getAllPosts() {
		return ResponseEntity.ok(postService.findAll());
	}
	
	@GetMapping(params = { "page" , "size" })
	public ResponseEntity<?> getPostByPagination(@RequestParam(defaultValue="0") Integer page, @RequestParam(defaultValue="10") Integer size) {		
		return ResponseEntity.ok(postService.findAllByPagination(page, size, "id"));
	}
	
	@GetMapping("{postId}")
	public ResponseEntity<?> getPostByIdAndPagination(@PathVariable Long postId, @RequestParam(name="page", defaultValue="0") Integer page, @RequestParam(name="size", defaultValue="50") Integer size) throws Exception {
		Optional<Post> postOpt = postService.findById(postId);
		List<Comment> comments = commentService.findByPostIdAndPagination(postId, page, size, "id");
		return ResponseEntity.ok(new PostResponse(postOpt.orElse(null), comments));
	}
	
	@GetMapping("/category")
	public ResponseEntity<?> getPostCategory() {
		return ResponseEntity.ok(PostCategoryEnum.values());
	}
	
	@GetMapping("/category/{catId}")
	public ResponseEntity<?> getPostByCategoryAndPagination(@PathVariable Integer catId, @RequestParam(name="page", defaultValue="0") Integer page, @RequestParam(name="size", defaultValue="10") Integer size) {
		return ResponseEntity.ok(postService.findByCategoryAndPagination(catId, page, size, "id"));
	}
}
