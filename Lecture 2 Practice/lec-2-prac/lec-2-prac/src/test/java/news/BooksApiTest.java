package books;

import com.redmath.lec_2_prac.Lec2PracApplication;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest(classes = Lec2PracApplication.class)
@AutoConfigureMockMvc
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
                .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize(Matchers.greaterThanOrEqualTo(2))));
    }
}
