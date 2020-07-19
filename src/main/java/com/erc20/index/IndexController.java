package com.erc20.index;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.IOException;

@RequiredArgsConstructor
@Controller
public class IndexController {
    private final IndexService indexService;

    @GetMapping("/")
    public String index(){
        return "index";
    }

    @ResponseBody
    @RequestMapping(value="/", method= RequestMethod.POST)
    public String fileUpload(MultipartHttpServletRequest multi, @RequestHeader HttpHeaders headers) throws IOException {
        String output = indexService.runModule(multi);
        return output;
    }
}
