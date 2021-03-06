package com.erc20.index;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.List;

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
    public String fileUpload(MultipartHttpServletRequest multi){
        String output = indexService.runModule(multi);
        return output;
    }

    @ResponseBody
    @RequestMapping(value="/{tokenName}", method= RequestMethod.POST)
    public String runExample(@PathVariable String tokenName){
        String output = indexService.runExample(tokenName);
        return output;
    }


    @ResponseBody
    @RequestMapping(value="/examples", method= RequestMethod.GET)
    public List<String> getListOfExample(){
        List<String> exampleList = indexService.getListOfExample();
        return exampleList;
    }
}
