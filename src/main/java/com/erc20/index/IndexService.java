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

    public String runModule(MultipartHttpServletRequest multi){
        String userToken = UUID.randomUUID().toString();
        String fileString = "";
        try{
            makeModule(userToken);

            putInputFile(multi, userToken);

            executeShell(userToken);

            fileString = getOutputFile(userToken);

        }catch(Exception e){
            e.printStackTrace();
        }finally{
            removeCopiedModule(userToken);
        }
        return fileString.replaceAll("\u001B\\[[;\\d]*m", "");
    }

    private void makeModule(String userToken) {
        try {
            String[] linuxCopyCommand = {"/bin/sh", "-c", "mkdir ~/" + userToken};
            Runtime runtime = Runtime.getRuntime();
            Process p = runtime.exec(linuxCopyCommand);
            p.waitFor();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void putInputFile(MultipartHttpServletRequest multi, String userToken) {
        String copiedPath = Paths.get(System.getProperty("user.home"), userToken).toString();
        String fileName = "";
        Iterator<String> files = multi.getFileNames();

        for (int i = 0; i < 3; i++) {
            String uploadFile = files.next();
            MultipartFile mFile = multi.getFile(uploadFile);
            fileName = mFile.getOriginalFilename();
/*
            System.out.println("오리지날 파일 이름" + mFile.getOriginalFilename());
            System.out.println("파일크기" + mFile.getSize());
 */
            try {
                mFile.transferTo(new File(Paths.get(copiedPath, fileName).toString()));
            } catch (Exception e) {
                e.printStackTrace();
                System.err.println("File Upload Error");
            }
        }
    }

    private void executeShell(String userToken) {
        String homePath = Paths.get(System.getProperty("user.home")).toString();
        try {
            String[] linuxExecuteCommand = { "sh", "/home/ec2-user/runmodule.sh", userToken};
            Runtime runtime = Runtime.getRuntime();
            Process p = Runtime.getRuntime().exec(linuxExecuteCommand);
            p.waitFor();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private String getOutputFile(String userToken) throws IOException {
        BufferedReader br = null;
        StringBuilder sb = null;
        String fileString = "";
        try {
            br = new BufferedReader(new FileReader(Paths.get(System.getProperty("user.home"), userToken, "module", "output.txt").toFile()));
            sb = new StringBuilder();
            String line = br.readLine();
//            String separator = System.getProperty("line.separator");
            boolean printing = true;
            while (line != null) {
                if (line.contains("Compilation warnings encountered")){
                    printing = false;
                }
                if (line.startsWith("\u001B")){
                    printing = true;
                }
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
            String[] linuxDeleteCommand = {"/bin/sh", "-c", "rm -r ~/" + userToken};

            Runtime r = Runtime.getRuntime();
            Process p = r.exec(linuxDeleteCommand);
            p.waitFor();
        }catch(Exception e){
            e.printStackTrace();
        }
    }
}
