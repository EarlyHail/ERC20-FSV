package com.erc20.index;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.*;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.UUID;

@Service
public class IndexService {
    private Path currentRelativePath = Paths.get("");
    private String absolutePath = currentRelativePath.toAbsolutePath().toString();
    private String dir1 = "copyDir1";
    private String dir2 = "copyDir2";
    private String dir3 = "copyDir3";
    private String resultDir = "resultDir";
    private boolean isWindows;

    public String runModule(MultipartHttpServletRequest multi) throws IOException {
        String userToken = UUID.randomUUID().toString();

        if(System.getProperty("os.name").indexOf("Windows") > -1){
            isWindows = true;
        }else{
            isWindows = false;
        }

        copyModule(userToken);

        putInputFile(multi, userToken);

        String fileString = getOutputFile(userToken);

        removeCopiedModule(userToken);

        return fileString.replaceAll("\u001B\\[[;\\d]*m", "");
    }

    private void copyModule(String userToken) {
        try {
            String copyCommand="";
            if(isWindows){
                copyCommand = "cmd /c echo d | " +
                        "xcopy \"" + absolutePath + File.separator + "module\" \"" + absolutePath + File.separator + userToken + "\" /k /h /e";
            }else{
                copyCommand = "/bin/sh -c cp " + absolutePath + File.separator + "module " + absolutePath + File.separator + userToken;

            }
            Runtime r = Runtime.getRuntime();
            Process p = r.exec(copyCommand);

            BufferedReader stdInput = new BufferedReader(new
                    InputStreamReader(p.getInputStream()));
            BufferedReader stdError = new BufferedReader(new
                    InputStreamReader(p.getInputStream()));
            String s = "";
            while ((s = stdInput.readLine()) != null) {
//                System.out.println(s);
            }
            while ((s = stdError.readLine()) != null) {
//                System.out.println(s);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void putInputFile(MultipartHttpServletRequest multi, String userToken) {
        String targetPath = absolutePath + File.separator + userToken;
        File dir = new File(targetPath);

        String folderPath = "";
        String fileName = "";
        Iterator<String> files = multi.getFileNames();

        for (int i = 0; i < 3; i++) {
            String uploadFile = files.next();
            MultipartFile mFile = multi.getFile(uploadFile);
            fileName = mFile.getOriginalFilename();
/*            System.out.println("파라미터명" + mFile.getName());
            System.out.println("파일크기" + mFile.getSize());
            System.out.println("파일 존재" + mFile.isEmpty());
            System.out.println("오리지날 파일 이름" + mFile.getOriginalFilename());*/
            try {
                if (i == 0) {
                    folderPath = dir1;
                }
                if (i == 1) {
                    folderPath = dir2;
                }
                if (i == 2) {
                    folderPath = dir3;
                }
                mFile.transferTo(new File(targetPath + File.separator + folderPath + File.separator + fileName));
            } catch (Exception e) {
                e.printStackTrace();
                System.err.println("File Upload Error");
            }
        }
    }

    private String getOutputFile(String userToken) throws IOException {
        BufferedReader br = null;
        StringBuilder sb = null;
        String fileString = "";
        try {
            br = new BufferedReader(new FileReader(absolutePath + File.separator + userToken + File.separator + resultDir + File.separator + "output.txt"));
            sb = new StringBuilder();
            String line = br.readLine();
            String separator = System.getProperty("line.separator");
            boolean printing = false;
            while (line != null) {
                if (line.startsWith("\u001B"))
                    printing = true;
                if (printing) {
//                    System.out.println(line);
                    sb.append(line).append("<br>"); //for new line in HTML
                    //sb.append(line).append(separator); //for new line in general
                }
                line = br.readLine();
            }
            fileString = sb.toString();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            br.close();
        }
        return fileString;
    }

    private void removeCopiedModule(String userToken) {
        try{
            String deleteCommand = "";
            if(isWindows){
                deleteCommand = "cmd /c echo y | rmdir \"" + absolutePath +File.separator+userToken+"\" /s";
            }else{
                deleteCommand = "/bin/sh rm -r " + absolutePath + File.separator + "module " + absolutePath + File.separator + userToken;
            }
            Runtime r = Runtime.getRuntime();
            Process p = r.exec(deleteCommand);

            BufferedReader stdInput = new BufferedReader(new
                    InputStreamReader(p.getInputStream()));
            BufferedReader stdError = new BufferedReader(new
                    InputStreamReader(p.getInputStream()));
            String s = "";
            while((s = stdInput.readLine()) != null){
//                System.out.println(s);
            }
            while((s = stdError.readLine()) != null){
//                System.out.println(s);
            }
        }catch(IOException e){
            e.printStackTrace();
        }
    }
}
