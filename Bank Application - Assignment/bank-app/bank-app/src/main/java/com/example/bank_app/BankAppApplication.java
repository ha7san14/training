package com.example.bank_app;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BankAppApplication {
    private static final Logger LOGGER = LoggerFactory.getLogger(BankAppApplication.class);

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.load();
        String mysqlPassword = dotenv.get("MYSQL_PASSWORD");
        if (mysqlPassword != null) {
            System.setProperty("MYSQL_PASSWORD", mysqlPassword);
        } else {
            LOGGER.error("MYSQL_PASSWORD not found in .env file.");
            System.exit(1);
        }
        SpringApplication.run(BankAppApplication.class, args);
    }
}
