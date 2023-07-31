package com.heckerForum.heckerForum.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.heckerForum.heckerForum.dto.CommentDto;
import com.heckerForum.heckerForum.exception.CommentNotFoundException;
import com.heckerForum.heckerForum.exception.PostNotFoundException;
import com.heckerForum.heckerForum.models.Comment;
import com.heckerForum.heckerForum.models.Post;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.repository.CommentRepository;
import com.heckerForum.heckerForum.repository.PostRepository;

@Service
public class CommentService {
	
	@Autowired
	private CommentRepository commentRepository;
	
	@Autowired
	private PostRepository postRepository;
	
	public Comment save(Long postId, User user, String content, Long replyCommentId) throws Exception {
		Comment comment = new Comment();
		Post post = postRepository.findById(postId).orElse(null);
		if(post == null) {
			throw new PostNotFoundException();
		}
		Comment replyComment = null;
		if(replyCommentId != null) {
			replyComment = commentRepository.findById(replyCommentId).orElse(null);
			replyComment.setNumberOfReply(replyComment.getNumberOfReply()+1);
			replyComment = commentRepository.save(replyComment);
		}
		Set<Comment> allComments = commentRepository.findByPost(post);
		
		comment.setUser(user);
		comment.setPost(post);
		comment.setContent(content);
		comment.setCreateDateTime(LocalDateTime.now());
		comment.setReplyComment(replyComment);
		comment.setCommentNumber(allComments.size() + 1);
		comment.setNumberOfReply(0);
		
		return commentRepository.save(comment);
	}
	
	public Comment saveUpvote(Long commentId) throws Exception {
		Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException("Comment does not exist"));
		comment.setUpvote(comment.getUpvote()+1);
		return commentRepository.save(comment);
	}
	
	public Comment saveDownvote(Long commentId) throws Exception {
		Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new CommentNotFoundException("Comment does not exist"));
		comment.setDownvote(comment.getDownvote()+1);
		return commentRepository.save(comment);
	}
	
	public List<Comment> findAll() {
		return commentRepository.findAll();
	}
	
	public List<Comment> findAllByPagination(Integer pageNo, Integer pageSize, String sortBy) {
		Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(sortBy));
		
		Page<Comment> result = commentRepository.findAll(paging);
		
		if(result.hasContent()) {
            return result.getContent();
        } else {
            return new ArrayList<Comment>();
        }
	}
	
	public Set<Comment> findByUser(User user) {
		return commentRepository.findByUser(user);
	}
	
	public CommentDto findByCommentId(Long commentId) {
		Comment comment = commentRepository.findById(commentId).orElse(null);
		List<Comment> replyComments = new ArrayList<Comment>();
		if(comment != null) {
			replyComments = commentRepository.findByReplyComment(comment);
		}
		return new CommentDto(comment, replyComments);
	}
	
	public Integer findNumberOfReplyComment(Long commentId) {
		return commentRepository.findNumberOfReplyComment(commentId);
	}
	
	public List<Comment> findByPostIdAndPagination(Long postId, Integer pageNo, Integer pageSize, String sortBy) {
		Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(sortBy));
		
		Post post = postRepository.findById(postId).orElse(null);
		
		if(post != null) {
			Page<Comment> result = commentRepository.findByPost(post, paging);
			return result.hasContent() ? result.getContent() : new ArrayList<Comment>();
		}
		return null;
	}
	
}
