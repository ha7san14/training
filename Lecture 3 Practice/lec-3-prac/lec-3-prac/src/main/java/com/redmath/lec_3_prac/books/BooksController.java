package com.redmath.lec_3_prac.books;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import com.redmath.lec_3_prac.books.Books;
import com.redmath.lec_3_prac.books.BooksService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BooksController {

    private final BooksService booksService;

    public BooksController(BooksService booksService) {
        this.booksService = booksService;
    }

    @GetMapping("/api/v1/books/{bookId}")
    public ResponseEntity<Books> get(@PathVariable("bookId") Long bookId) {
        Optional<Books> books = booksService.findById(bookId);
        if (books.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(books.get());
    }

    @GetMapping("/api/v1/books")
    public ResponseEntity<List<Books>> getBooks(@RequestParam(name = "page", defaultValue = "0") Integer page,
                                                @RequestParam(name = "size", defaultValue = "1000") Integer size) {
        return ResponseEntity.ok(booksService.findAll(page, size));
    }

    @PostMapping("/api/v1/postbooks")
    public ResponseEntity<Books> create(@RequestBody Books books) {
        books = booksService.create(books);
        return ResponseEntity.created(URI.create("/api/v1/postbooks/" + books.getBookId())).body(books);
    }
}
