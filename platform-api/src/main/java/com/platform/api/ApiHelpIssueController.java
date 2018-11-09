package com.platform.api;

import com.platform.annotation.IgnoreAuth;
import com.platform.entity.HelpIssueVo;
import com.platform.entity.HelpTypeVo;
import com.platform.service.ApiCartService;
import com.platform.service.ApiHelpIssueService;
import com.platform.service.ApiHelpTypeService;
import com.platform.util.ApiBaseAction;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller
 *
 * @author lipengjun
 * @email 939961241@qq.com
 * @date 2018-11-07 11:04:20
 */
@Api(tags = "帮助中心")
@RestController
@RequestMapping("api/helpissue")
public class ApiHelpIssueController extends ApiBaseAction {
    @Autowired
    private ApiHelpIssueService helpIssueService;
    @Autowired
    private ApiHelpTypeService helpTypeService;
    @Autowired
    private ApiCartService cartService;
    /**
     * 查看帮助类型列表
     */
    @RequestMapping("/typeList")
    @IgnoreAuth
    public Object typeList() {
        System.err.println("查看类型");
        List<HelpTypeVo> list = helpTypeService.queryList(new HashMap());
        System.err.println(list);
        return toResponsSuccess(list);
    }

    /**
     * 查看问题列表
     */
    @RequestMapping("/issueList")
    @IgnoreAuth
    public Object issueList(Long type_id) {

        Map params = new HashMap();
        params.put("type_id", type_id);
        List<HelpIssueVo> helpIssueList = helpIssueService.queryList(params);

        return toResponsSuccess(helpIssueList);
    }
}
