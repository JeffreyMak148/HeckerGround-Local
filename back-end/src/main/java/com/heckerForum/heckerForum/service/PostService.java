package com.heckerForum.heckerForum.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.heckerForum.heckerForum.models.Post;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.repository.PostRepository;

@Service
public class PostService {
	
	@Autowired
	private PostRepository postRepository;
	
	@Autowired
	private CommentService commentService;
	
	public Post save(User user, Integer catId, String title, String content) throws Exception {
		Post post = new Post();
		
		post.setUser(user);
		post.setCatId(catId);
		post.setTitle(title);
		post.setCreateDateTime(LocalDateTime.now());
		
		Post createdPost = postRepository.save(post);
		
		commentService.save(createdPost.getId(), user, content, null);
		
		return createdPost;
	}
	
	public List<Post> findAll() {
		return postRepository.findAll();
	}
	
	public List<Post> findAllByPagination(Integer pageNo, Integer pageSize, String sortBy) {
		Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(sortBy));
		
		Page<Post> result = postRepository.findAll(paging);
		
		if(result.hasContent()) {
            return result.getContent();
        } else {
            return new ArrayList<Post>();
        }
	}
	
	public List<Post> findByUser(User user) {
		return postRepository.findByUser(user);
	}
	
	public List<Post> findByUserAndPagination(User user, Pageable paging) {
		Page<Post> result = postRepository.findByUser(user, paging);
		return result.hasContent() ? result.getContent() : new ArrayList<Post>();
	}
	
	public Optional<Post> findById(Long postId) {
		return postRepository.findById(postId);
	}
	
	public List<Post> findByCategoryAndPagination(Integer catId, Integer pageNo, Integer pageSize, String sortBy) {
		Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(sortBy));
		
		Page<Post> result = postRepository.findByCatId(catId, paging);
		
		return result.hasContent() ? result.getContent() : new ArrayList<Post>();
	}
	
}
