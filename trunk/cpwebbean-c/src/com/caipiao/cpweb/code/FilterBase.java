package com.caipiao.cpweb.code;

import com.caipiao.cpweb.code.jc.FilterJcBQC;
import com.caipiao.cpweb.code.jc.FilterJcCBF;
import com.caipiao.cpweb.code.jc.FilterJcHH;
import com.caipiao.cpweb.code.jc.FilterJcJQS;
import com.caipiao.cpweb.code.jc.FilterJcSPF;
import com.caipiao.cpweb.code.jc.FilterJcRFSPF;
import com.caipiao.cpweb.code.lc.FilterLcSF;
import com.caipiao.cpweb.code.lc.FilterLcRFSF;
import com.caipiao.cpweb.code.lc.FilterLcSFC;
import com.caipiao.cpweb.code.lc.FilterLcDXF;
import com.caipiao.cpweb.code.bj.FilterBQC;
import com.caipiao.cpweb.code.bj.FilterCBF;
import com.caipiao.cpweb.code.bj.FilterJQS;
import com.caipiao.cpweb.code.bj.FilterSPF;
import com.caipiao.cpweb.code.bj.FilterSXP;
import com.caipiao.plugin.helper.CodeFormatException;

public abstract class FilterBase {
    public abstract void filter(CodeBean bean, FilterResult result) throws CodeFormatException;

    public static void doFilter(CodeBean bean, FilterResult result) throws CodeFormatException {
        if (bean.getLottype() == 85) {
            new FilterSPF().filter(bean, result);
        } else if (bean.getLottype() == 86) {
            new FilterCBF().filter(bean, result);
        } else if (bean.getLottype() == 87) {
            new FilterBQC().filter(bean, result);
        } else if (bean.getLottype() == 88) {
            new FilterSXP().filter(bean, result);
        } else if (bean.getLottype() == 89) {
            new FilterJQS().filter(bean, result);
        }
    }

    public static void doFilterJc(CodeBean bean, FilterResult result) throws CodeFormatException {
        bean.setCode(bean.getCode().replaceAll("｜", "|"));
        if (bean.getLottype() == 72) {
            new FilterJcRFSPF().filter(bean, result);
        } else if (bean.getLottype() == 90) {
            new FilterJcSPF().filter(bean, result);
        } else if (bean.getLottype() == 91) {
            new FilterJcCBF().filter(bean, result);
        } else if (bean.getLottype() == 92) {
            new FilterJcBQC().filter(bean, result);
        } else if (bean.getLottype() == 93) {
            new FilterJcJQS().filter(bean, result);
        } else if (bean.getLottype() == 70) {
            new FilterJcHH().filter(bean, result);
        }
    }

    public static void doFilterLc(CodeBean bean, FilterResult result) throws CodeFormatException {
        if (bean.getLottype() == 94) {
            new FilterLcSF().filter(bean, result);
        } else if (bean.getLottype() == 95) {
            new FilterLcRFSF().filter(bean, result);
        } else if (bean.getLottype() == 96) {
            new FilterLcSFC().filter(bean, result);
        } else if (bean.getLottype() == 97) {
            new FilterLcDXF().filter(bean, result);
        }
    }
}
