package com.redmath.lec_4_prac.books;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BooksRepository extends JpaRepository<com.redmath.lec_4_prac.books.Books, Long> {

}

//extends JpaRepository<News, Long>: This specifies that NewsRepository extends JpaRepository.
//        News: The type of the entity that the repository manages.
//        Long: The type of the primary key of the entity.