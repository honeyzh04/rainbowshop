package com.platform.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * 数组排列组合
 * @Title: ListCombination
 * @ProjectName rainbowshop
 * @Description: TODO
 * @author Administrator
 * @date 2019/1/2211:01
 */

public class ListCombinationUtil {
    public static  List<String> calculateCombination(List<List<Integer>> inputList) {
        List<String> specification=new ArrayList<String>();
        List<Integer> combination = new ArrayList<Integer>();
        int n=inputList.size();
        for (int i = 0; i < n; i++) {
            combination.add(0);
        }
        int i=0;
        boolean isContinue=false;
        do{
            //打印一次循环生成的组合
            StringBuilder a = new StringBuilder();
            for (int j = 0; j < n; j++) {
                a.append(inputList.get(j).get(combination.get(j))+"_");

            }
            specification.add(a.toString());
            System.err.println(a);
            i++;
            combination.set(n-1, i);
            for (int j = n-1; j >= 0; j--) {
                if (combination.get(j)>=inputList.get(j).size()) {
                    combination.set(j, 0);
                    i=0;
                    if (j-1>=0) {
                        combination.set(j-1, combination.get(j-1)+1);
                    }
                }
            }
            isContinue=false;
            for (Integer integer : combination) {
                if (integer != 0) {
                    isContinue=true;
                }
            }
        }while (isContinue);

        return   specification;
    }
    public static void main(String[] args) {
        ListCombinationUtil a=new ListCombinationUtil();
        List<Integer> list1 = new ArrayList<>();
        list1.add(0);
        list1.add(1);
        list1.add(2);
        List<Integer> list2 = new ArrayList<>();
        list2.add(3);
        list2.add(4);
        list2.add(5);
        List<Integer> list3 = new ArrayList<>();
        list3.add(6);
        list3.add(7);
        list3.add(8);
        List<List<Integer>> allList = new ArrayList<>();
        allList.add(list1);
        allList.add(list2);
        allList.add(list3);
        System.err.println( a.calculateCombination(allList));
    }


}
