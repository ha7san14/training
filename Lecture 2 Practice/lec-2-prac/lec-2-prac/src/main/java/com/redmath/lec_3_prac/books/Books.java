package com.redmath.lec_3_prac.books;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity //This JPA annotation specifies that this class is a JPA entity. This means that it is mapped to a database table.
public class Books {
    @Id
    private Long id;

    private String title;
    private String author;
    private LocalDate publishedDate;
    private BigDecimal price;
}