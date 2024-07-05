package com.redmath.lec_3_prac.books;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BooksController {

    private final BooksRepository booksRepository;

    // This field is injected via constructor injection with an instance of BooksRepository, allowing the
    // controller to interact with Books entities in the database.
    public BooksController(BooksRepository booksRepository) {
        this.booksRepository = booksRepository;
    }

    // ResponseEntity<Books>: This method returns a ResponseEntity containing a Books object.
    @GetMapping("/api/v1/books/{bookId}")
    public ResponseEntity<Books> get(@PathVariable("bookId") Long bookId) {
        // Optional<Books> book = booksRepository.findById(bookId);: This line uses the findById method inherited from JpaRepository to retrieve a Books entity by its ID.
        Optional<Books> book = booksRepository.findById(bookId);
        if (book.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(book.get());
    }

    // @GetMapping("/api/v1/books"): This annotation maps HTTP GET requests to /api/v1/books, without any path variables.
    // ResponseEntity<List<Books>>: This method returns a ResponseEntity containing a list of Books objects.
    // @RequestParam(name = "page", defaultValue = "0") Integer page: This annotation maps the page request parameter to the page method parameter. It has a default value of 0.
    // @RequestParam(name = "size", defaultValue = "1000") Integer size: This annotation maps the size request parameter to the size method parameter. It has a default value of 1000.
    // Clients can optionally pass page and size parameters in the URL query string (e.g., /api/v1/books?page=1&size=20).
    // If these parameters are not provided in the request, the controller uses default values (page=0 and size=1000) specified in @RequestParam annotations.
    @GetMapping("/api/v1/books")
    public ResponseEntity<List<Books>> get(@RequestParam(name = "page", defaultValue = "0") Integer page,
                                           @RequestParam(name = "size", defaultValue = "1000") Integer size) {
        return ResponseEntity.ok(booksRepository.findAll());
    }
}
