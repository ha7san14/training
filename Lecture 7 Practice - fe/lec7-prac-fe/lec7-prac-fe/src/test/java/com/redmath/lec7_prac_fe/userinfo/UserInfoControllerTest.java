package com.redmath.lec7_prac_fe.userinfo;

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

@SpringBootTest
@AutoConfigureMockMvc
public class UserInfoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testHelloWorldSuccess() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.get("/api/v1/userinfo"))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON_VALUE))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name", Matchers.is("Hassan")))
                .andExpect(MockMvcResultMatchers.jsonPath("$.age", Matchers.is(23)))
                .andExpect(MockMvcResultMatchers.jsonPath("$.created_at", Matchers.notNullValue()));
    }

}