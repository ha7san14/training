package books;

import com.redmath.lec_6_prac.Application;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest(classes = Application.class)
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class BooksApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testBookGetSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/books/1"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id", Matchers.is(1)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.title", Matchers.is("Sample Book 1")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.author", Matchers.is("Author 1")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.publishedDate", Matchers.notNullValue()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.price", Matchers.is(9.99)));
    }

    @Test
    public void testBookGetNotFound() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/books/999"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isNotFound());
    }

    @Test
    public void testBookGetListSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/books"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize(Matchers.greaterThanOrEqualTo(1))));
    }
    @Test
    public void testBooksPostSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.post("/api/v1/postbooks")
                        .contentType(MediaType.APPLICATION_JSON_VALUE)
                        .content("{\"title\":\"Sample Book Title\",\"author\":\"Sample Author\",\"publishedDate\":\"2023-07-10\",\"price\":29.99}")
                        .with(SecurityMockMvcRequestPostProcessors.csrf())
                        .with(SecurityMockMvcRequestPostProcessors.user("test")
                                .authorities(new SimpleGrantedAuthority("bookreporter"))))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$.id").exists())
                .andExpect(MockMvcResultMatchers.jsonPath("$.title").value("Sample Book Title"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.author").value("test"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.publishedDate").value("2024-07-10"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.price").value(29.99));
    }

}
