package com.redmath.lec_5_prac.books;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class BooksController {

    private final BooksApiClient booksApiClient;

    public BooksController(BooksApiClient booksApiClient) {
        this.booksApiClient = booksApiClient;
    }
    @GetMapping("/api/v1/books")
    public CompletableFuture<List<Books>> getBooks() {
        return booksApiClient.searchBooksAsync();
    }
//    private final BooksService booksService;

//    public BooksController(BooksService booksService) {
//        this.booksService = booksService;
//    }
//
//    @GetMapping("/api/v1/books/{bookId}")
//    public ResponseEntity<Books> get(@PathVariable("bookId") Long bookId) {
//        Optional<Books> books = booksService.findById(bookId);
//        if (books.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(books.get());
//    }
//
//    @GetMapping("/api/v1/books")
//    public ResponseEntity<List<Books>> getBooks(@RequestParam(name = "page", defaultValue = "0") Integer page,
//                                                @RequestParam(name = "size", defaultValue = "1000") Integer size) {
//        return ResponseEntity.ok(booksService.findAll(page, size));
//    }
//
////    @PreAuthorize("hasAnyAuthority('librarymanager', 'bookreporter')")
//    @PostMapping("/api/v1/postbooks")
//    public ResponseEntity<Books> create(@RequestBody Books books) {
//        books = booksService.create(books);
//        return ResponseEntity.created(URI.create("/api/v1/postbooks/" + books.getBookId())).body(books);
//    }
//
////    @PreAuthorize("hasAnyAuthority('librarymanager', 'bookeditor')")
//    @PutMapping("/api/v1/books/{bookId}")
//    public ResponseEntity<Books> update(@PathVariable("bookId") Long bookId, @RequestBody Books books){
//        Optional<Books> saved = booksService.update(bookId,books);
//        if(saved.isEmpty()){
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(saved.get());
//    }
//
////    @PreAuthorize("hasAuthority('librarymanager')")
//    @DeleteMapping("/api/v1/books/{bookId}")
//    public ResponseEntity<Void> delete(@PathVariable("bookId") Long bookId) {
//
//        booksService.delete(bookId);
//        return ResponseEntity.noContent().build();
//    }
}
