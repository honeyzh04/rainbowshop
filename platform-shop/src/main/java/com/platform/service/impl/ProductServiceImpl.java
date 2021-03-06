package com.platform.service.impl;

import com.platform.dao.GoodsSpecificationDao;
import com.platform.dao.ProductDao;
import com.platform.entity.GoodsSpecificationEntity;
import com.platform.entity.ProductEntity;
import com.platform.service.ProductService;
import com.platform.utils.BeanUtils;
import com.platform.utils.ListCombinationUtil;
import com.platform.utils.StringUtils;
import net.sf.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service实现类
 *
 * @author lipengjun
 * @email 939961241@qq.com
 * @date 2017-08-30 14:31:21
 */
@Service("productService")
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductDao productDao;
    @Autowired
    private GoodsSpecificationDao goodsSpecificationDao;

    @Override
    public ProductEntity queryObject(Integer id) {
        return productDao.queryObject(id);
    }

    @Override
    public List<ProductEntity> queryList(Map<String, Object> map) {
        List<ProductEntity> list = productDao.queryList(map);

        List<ProductEntity> result = new ArrayList<>();
        //翻译产品规格
        if (null != list && list.size() > 0) {
            for (ProductEntity item : list) {
                String specificationIds = item.getGoodsSpecificationIds();
                String specificationValue = "";
                if (!StringUtils.isNullOrEmpty(specificationIds)) {
                    String[] arr = specificationIds.split("_");

                    for (String goodsSpecificationId : arr) {
                        GoodsSpecificationEntity entity = goodsSpecificationDao.queryObject(goodsSpecificationId);
                        if (null != entity) {
                            specificationValue += entity.getValue() + "；";
                        }
                    }
                }
                item.setSpecificationValue(item.getGoodsName() + " " + specificationValue);
                result.add(item);
            }
        }
        for ( ProductEntity a:result){
            JSONObject jsonObject = JSONObject.fromObject( a);
            System.err.println("a"+ jsonObject.toString());
        }

        return result;
    }

    @Override
    public int queryTotal(Map<String, Object> map) {
        return productDao.queryTotal(map);
    }

    /**
     * 添加商品下的产品
     * @param product 实体
     * @return
     */
    @Override
    @Transactional
    public int save(ProductEntity product) {
        int result = 0;
        JSONObject jsonObject = JSONObject.fromObject( product);
        String goodsSpecificationIds = product.getGoodsSpecificationIds();
        if (!StringUtils.isNullOrEmpty(goodsSpecificationIds)) {
            List<List<Integer>> inputList = new ArrayList<>();
            String[] goodsSpecificationIdArr = goodsSpecificationIds.split("_");
            for (int i = 0; i < goodsSpecificationIdArr.length ; i++) {
                if (! goodsSpecificationIdArr[i].equals("")){
                String[] oneId = goodsSpecificationIdArr[i].split(",");
                    List<String> list = Arrays.asList(oneId);
                    List<Integer> codesInteger = list.stream().map(Integer::parseInt).collect(Collectors.toList());
                    System.out.println(list);

                    inputList.add(codesInteger);


        /*            String[] oneId = goodsSpecificationIdArr[i].split(",");
                String[] twoId = goodsSpecificationIdArr[i + 1].split(",");
                for (int j = 0; j < oneId.length; j++) {
                    for (int k = 0; k < twoId.length; k++) {
                        String strGoodsSpecificationIds = null;
                        if (StringUtils.isNullOrEmpty(oneId[j]) || StringUtils.isNullOrEmpty(twoId[k])){
                            continue;
                        }
                        strGoodsSpecificationIds = oneId[j] + "_" + twoId[k];
                        product.setGoodsSpecificationIds(strGoodsSpecificationIds);
                        ProductEntity entity = new ProductEntity();
                        BeanUtils.copyProperties(product, entity);
                        result += productDao.save(entity);
                    }
                }*/


                }
            }


            List<String>  specification= ListCombinationUtil.calculateCombination(inputList);
            System.err.println(specification);
           for (String a : specification){
            product.setGoodsSpecificationIds(a);
            ProductEntity entity = new ProductEntity();
            BeanUtils.copyProperties(product, entity);
            result += productDao.save(entity);
        }

        }
        return result;
    }

    @Override
    public int update(ProductEntity product) {
        if (StringUtils.isNullOrEmpty(product.getGoodsSpecificationIds())){
            product.setGoodsSpecificationIds("");
        }
        return productDao.update(product);
    }

    @Override
    public int delete(Integer id) {
        return productDao.delete(id);
    }

    @Override
    public int deleteBatch(Integer[] ids) {
        return productDao.deleteBatch(ids);
    }
}
