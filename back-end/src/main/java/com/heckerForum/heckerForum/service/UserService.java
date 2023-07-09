package com.heckerForum.heckerForum.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.heckerForum.heckerForum.dto.ProfileResponse;
import com.heckerForum.heckerForum.models.Post;
import com.heckerForum.heckerForum.models.User;
import com.heckerForum.heckerForum.repository.UserRepository;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private PostService postService;
	
	public ProfileResponse findPostsByUserIdAndPagination(Long userId, Integer pageNo, Integer pageSize, String sortBy) {
		User user = userRepository.findById(userId).orElse(null);
		if(user == null) {
			return new ProfileResponse(null, new ArrayList<Post>());
		}
		Pageable paging = PageRequest.of(pageNo, pageSize, Sort.by(sortBy));
		return new ProfileResponse(user, postService.findByUserAndPagination(user, paging));
	}
	
	public User findUserById(Long userId) {
		return userRepository.findById(userId).orElse(null);
	}

	
}
