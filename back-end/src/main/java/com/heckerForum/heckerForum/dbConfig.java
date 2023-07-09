package com.heckerForum.heckerForum;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class dbConfig {
	
	@Value("${DB_URL}")
	private String dbUrl;
	
	@Value("${DB_USERNAME}")
	private String dbUsername;
	
	@Value("${DB_PASSWORD}")
	private String dbPassword;
	
	@Primary
	@Bean
	public DataSource getDataSource() {
		return DataSourceBuilder.create()
				.driverClassName("com.mysql.cj.jdbc.Driver")
				.url(dbUrl)
				.username(dbUsername)
				.password(dbPassword)
				.build();
	}
}
