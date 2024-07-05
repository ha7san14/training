package com.redmath.lec_3_prac.books;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class BooksService {

    private final BooksRepository booksRepository;

    public BooksService(BooksRepository booksRepository) {
        this.booksRepository = booksRepository;
    }

    public Optional<Books> findById(Long bookId) {
        return booksRepository.findById(bookId);
    }

    public List<Books> findAll(Integer page, Integer size) {
        if (page < 0) {
            page = 0;
        }
        if (size > 1000) {
            size = 1000;
        }
        return booksRepository.findAll(PageRequest.of(page, size)).getContent();
    }

    public Books create(Books books) {
        books.setBookId(System.currentTimeMillis());
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        books.setReportedBy(username);
        books.setReportedAt(LocalDate.now());
        return booksRepository.save(books);
    }
}