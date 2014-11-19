package com.caipiao.cpweb.bank.llpay;

import java.io.Serializable;

/**
* 支付信息bean
* @author guoyx
* @date:Jun 24, 2013 3:25:29 PM
* @version :1.0
*
*/
public class PaymentInfo implements Serializable{
    private static final long serialVersionUID = 1L;
    // 商户提交参数
    private String            version;
    private String            oid_partner;
    private String            user_id;
    private String            sign_type;
    private String            sign;
    private String            busi_partner;
    private String            no_order;
    private String            dt_order;
    private String            name_goods;
    private String            info_order;
    private String            money_order;
    private String            notify_url;
    private String            url_return;
    private String            userreq_ip;
    private String            url_order;
    private String            valid_order;
    private String            bank_code;
    private String            pay_type;
    private String            timestamp;
    private String            risk_item;
    public String             no_agree;
    private String            id_type;              // 证件类型
    private String            id_no;                // 证件号码
    private String            acct_name;            // 银行账号姓名
    private String            flag_modify;          // 修改标记
    private String            card_no;              // 银行卡号
    private String            back_url;

    public String getVersion()
    {
        return version;
    }

    public void setVersion(String version)
    {
        this.version = version;
    }

    public String getOid_partner()
    {
        return oid_partner;
    }

    public void setOid_partner(String oid_partner)
    {
        this.oid_partner = oid_partner;
    }

    public String getUser_id()
    {
        return user_id;
    }

    public void setUser_id(String user_id)
    {
        this.user_id = user_id;
    }

    public String getSign_type()
    {
        return sign_type;
    }

    public void setSign_type(String sign_type)
    {
        this.sign_type = sign_type;
    }

    public String getSign()
    {
        return sign;
    }

    public void setSign(String sign)
    {
        this.sign = sign;
    }

    public String getBusi_partner()
    {
        return busi_partner;
    }

    public void setBusi_partner(String busi_partner)
    {
        this.busi_partner = busi_partner;
    }

    public String getNo_order()
    {
        return no_order;
    }

    public void setNo_order(String no_order)
    {
        this.no_order = no_order;
    }

    public String getDt_order()
    {
        return dt_order;
    }

    public void setDt_order(String dt_order)
    {
        this.dt_order = dt_order;
    }

    public String getName_goods()
    {
        return name_goods;
    }

    public void setName_goods(String name_goods)
    {
        this.name_goods = name_goods;
    }

    public String getInfo_order()
    {
        return info_order;
    }

    public void setInfo_order(String info_order)
    {
        this.info_order = info_order;
    }

    public String getMoney_order()
    {
        return money_order;
    }

    public void setMoney_order(String money_order)
    {
        this.money_order = money_order;
    }

    public String getNotify_url()
    {
        return notify_url;
    }

    public void setNotify_url(String notify_url)
    {
        this.notify_url = notify_url;
    }

    public String getUrl_return()
    {
        return url_return;
    }

    public void setUrl_return(String url_return)
    {
        this.url_return = url_return;
    }

    public String getUserreq_ip()
    {
        return userreq_ip;
    }

    public void setUserreq_ip(String userreq_ip)
    {
        this.userreq_ip = userreq_ip;
    }

    public String getUrl_order()
    {
        return url_order;
    }

    public void setUrl_order(String url_order)
    {
        this.url_order = url_order;
    }

    public String getValid_order()
    {
        return valid_order;
    }

    public void setValid_order(String valid_order)
    {
        this.valid_order = valid_order;
    }

    public String getBank_code()
    {
        return bank_code;
    }

    public void setBank_code(String bank_code)
    {
        this.bank_code = bank_code;
    }

    public String getPay_type()
    {
        return pay_type;
    }

    public void setPay_type(String pay_type)
    {
        this.pay_type = pay_type;
    }

    public String getTimestamp()
    {
        return timestamp;
    }

    public void setTimestamp(String timestamp)
    {
        this.timestamp = timestamp;
    }

    public String getRisk_item()
    {
        return risk_item;
    }

    public void setRisk_item(String risk_item)
    {
        this.risk_item = risk_item;
    }

    public String getNo_agree()
    {
        return no_agree;
    }

    public void setNo_agree(String no_agree)
    {
        this.no_agree = no_agree;
    }

    public String getId_type()
    {
        return id_type;
    }

    public void setId_type(String id_type)
    {
        this.id_type = id_type;
    }

    public String getId_no()
    {
        return id_no;
    }

    public void setId_no(String id_no)
    {
        this.id_no = id_no;
    }

    public String getAcct_name()
    {
        return acct_name;
    }

    public void setAcct_name(String acct_name)
    {
        this.acct_name = acct_name;
    }

    public String getFlag_modify()
    {
        return flag_modify;
    }

    public void setFlag_modify(String flag_modify)
    {
        this.flag_modify = flag_modify;
    }

    public String getCard_no()
    {
        return card_no;
    }

    public void setCard_no(String card_no)
    {
        this.card_no = card_no;
    }

    public String getBack_url()
    {
        return back_url;
    }

    public void setBack_url(String back_url)
    {
        this.back_url = back_url;
    }

}
