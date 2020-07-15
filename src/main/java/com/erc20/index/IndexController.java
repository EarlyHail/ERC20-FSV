package com.erc20.index;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;

@RequiredArgsConstructor
@Controller
public class IndexController {
    @GetMapping("/")
    public String index(){
        return "index";
    }

    @ResponseBody
    @RequestMapping(value="/", method= RequestMethod.POST)
    public String fileUpload(MultipartHttpServletRequest multi) throws IOException {
        Path currentRelativePath = Paths.get("");
        String s = currentRelativePath.toAbsolutePath().toString();
        System.out.println("Current relative path is: " + s);

        String path = "fileTest";
        String fileName = "";
        File dir = new File(path);
        if(!dir.isDirectory()){
            dir.mkdir();
        }
        path = dir.getAbsolutePath()+File.separator;
        System.out.println(path);
        Iterator<String> files = multi.getFileNames();
        while(files.hasNext()){
            String uploadFile = files.next();
            MultipartFile mFile = multi.getFile(uploadFile);
            fileName = mFile.getOriginalFilename();
/*            System.out.println("파라미터명" + mFile.getName());
            System.out.println("파일크기" + mFile.getSize());
            System.out.println("파일 존재" + mFile.isEmpty());
            System.out.println("오리지날 파일 이름" + mFile.getOriginalFilename());*/
            try{
                System.out.println(path+fileName);
//                mFile.transferTo(new File(path+fileName));
            }catch(Exception e){
                e.printStackTrace();
//                System.err.println("File Upload Error");
            }
        }

        BufferedReader br = null;
        StringBuilder sb = null;
        String fileString = "";
        try{
            br = new BufferedReader(new FileReader(s+File.separator+"result"+File.separator+"output.txt"));
            System.out.println(s+File.separator+"result"+File.separator+"output.txt");
            sb = new StringBuilder();
            String line = br.readLine();
            String separator = System.getProperty("line.separator");
            boolean printing = false;
            while (line != null) {
/*                if(line.startsWith("="))
                    printing = false;*/
                if(line.startsWith("\u001B"))
                    printing = true;
                if(printing){
                    System.out.println(line);
                    sb.append(line).append("<br>");
                    //sb.append(line).append(separator);
                }
                line = br.readLine();
            }
            fileString = sb.toString();
        }catch(IOException e){
            e.printStackTrace();
        }finally{
            br.close();
        }
//        System.out.println(fileString);
        return fileString.replaceAll("\u001B\\[[;\\d]*m", "");
        //Make String to ANSI color Style
    }
}
