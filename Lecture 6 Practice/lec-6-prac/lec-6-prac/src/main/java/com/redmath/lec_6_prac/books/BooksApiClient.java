package com.redmath.lec_6_prac.books;


import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Component
public class BooksApiClient {
//    private final RestTemplate restTemplate;
//
//    public BooksApiClient(RestTemplateBuilder builder) {
//        this.restTemplate = builder.build();
//
//    }
//
//    @Cacheable(cacheNames = "booksCache")
//    @Async
//    public CompletableFuture<List<Books>> searchBooksAsync() {
//        String apiUrl = "https://www.abibliadigital.com.br/api/books";
//        Books[] booksArray = restTemplate.getForObject(apiUrl, Books[].class);
//
//        if (booksArray != null) {
//            return CompletableFuture.completedFuture(Arrays.asList(booksArray));
//        } else {
//            return CompletableFuture.completedFuture(List.of()); // Return an empty list if no books or response is null
//        }
//    }
//
//    @Scheduled(fixedRate = 10000) // Run every minute
//    public void refreshCache() {
//        // Optionally refresh cache or perform periodic tasks
//        System.out.println("Refreshing books cache...");
//    }


}
