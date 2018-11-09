package com.platform.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
/**
     * 系统页面视图Controller
     * @ClassName:      SysPageController
     * @Description:
     * @Author:         zhaoh
     * @CreateDate:     2018/11/3 14:10
     * @UpdateDate:     2018/11/3 14:10
     * @Version:        1.0
     */
@Controller
public class SysPageController {

    /**
     * 视图路径
     *
     * @param module 模块
     * @param url    url
     * @return 页面视图路径
     */
    @RequestMapping("{module}/{url}.html")
    public String page(@PathVariable("module") String module, @PathVariable("url") String url) {
        System.err.println("地址1"+module+"地址2"+url);

        return module + "/" + url + ".html";
    }

}
