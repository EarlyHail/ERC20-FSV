package com.erc20.index;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.GetMapping;

@RequiredArgsConstructor
@Configuration
public class IndexController {
    @GetMapping("/")
    public String index(){
        return "index";
    }
}
