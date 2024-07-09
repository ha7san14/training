package com.redmath.lec_5_prac.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@EnableConfigurationProperties(value = { ApiProperties.class })
@EnableMethodSecurity
@Configuration
public class ApiSecurityConfiguration {

    @Value("${api.security.ignored}")
    private String[] ignored;


    @Autowired
    private ApiProperties props;

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        // return new WebSecurityCustomizer() {
        // @Override
        // public void customize(WebSecurity web) {
        // for (String location : ignored) {
        // web.ignoring().requestMatchers(AntPathRequestMatcher.antMatcher(HttpMethod.GET,
        // location));
        // }
        // }
        // };
//        return web -> {
//            for (String location : ignored) {
//                web.ignoring().requestMatchers(AntPathRequestMatcher.antMatcher(HttpMethod.GET, location));
//            }
//        };
        return web -> {
            for (String location : props.getIgnored()) {
                web.ignoring().requestMatchers(AntPathRequestMatcher.antMatcher(HttpMethod.GET, location));
            }
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.formLogin(Customizer.withDefaults());

        http.authorizeHttpRequests(config -> config
//                .requestMatchers(HttpMethod.GET, "/api/v1/books/**").permitAll()
//                .requestMatchers(HttpMethod.POST, "/api/v1/postbooks").hasAnyAuthority("librarymanager", "bookreporter")
//                .requestMatchers(HttpMethod.PUT, "/api/v1/books/**").hasAnyAuthority("librarymanager", "bookeditor")
//                .requestMatchers(HttpMethod.DELETE, "/api/v1/books/**").hasAuthority("librarymanager")
               .anyRequest().authenticated());
        http.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()));
        return http.build();
        // http.csrf(csrf -> csrf.disable());
    }



//        http.formLogin(Customizer.withDefaults());
//        http.authorizeHttpRequests(config -> config
//                // .requestMatchers(HttpMethod.POST, "/api/v1/postbooks").hasAnyAuthority("librarymanager",
//                // "bookreporter")
//                // .requestMatchers(HttpMethod.PUT, "/api/v1/books/**").hasAnyAuthority("librarymanager",
//                // "bookeditor")
//                .anyRequest().authenticated());
//        http.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
//                .sessionAuthenticationStrategy(new NullAuthenticatedSessionStrategy()));
//        return http.build();
}