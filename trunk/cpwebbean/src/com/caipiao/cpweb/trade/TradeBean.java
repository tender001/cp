package com.caipiao.cpweb.trade;

import com.caipiao.cpweb.BaseBean;
import com.caipiao.cpweb.trade.util.CheckUtil;
import com.caipiao.split.GameUtil;

public class TradeBean extends BaseBean {

	private static final long serialVersionUID = 3173522854342398343L;
	public final static int CAST_HM = 1;
	public final static int CAST_BUY = 2;
	public final static int CAST_ZH = 3;
	public final static int CANCEL_HM = 4;
	public final static int CANCEL_BUY = 5;
	public final static int CANCEL_ZH = 6;
	public final static int UPLOAD = 7;

	private String balance = "";// 用户余额

	private int play;// 玩法
	private String codes = "";// 投注号码（文件投注的文件名）

	private String name = "";// 方案名称
	private String desc = "";// 方案描叙
	private int type;// 方案类型(0代购 1合买)

	private int tnum;// 总份数
	private int bnum;// 认购份数
	private int pnum;// 保底份数
	private int muli;// 投注倍数

	private int money;// 方案总金额
	private int wrate;// 中奖提成比率
	private int oflag;// 公开标志
	private int fflag;// 文件标志（0 是号码 1 是文件）
	private int zflag;// 追号标志

	private String hid = "";// 合买编号
	private String bid = "";// 认购编号
	private String zid = "";// 追号编号
	private String did = "";// 明细编号

	// 方案列表的参数
	private int state = 0;// 查询类型
	private String find = "";// 查询字符串
	private String fsort = "";// 排序字段
	private String dsort = "";// 排序方向

	private int emoney;// 每注金额(大乐透 有3元 其他为两元)
	private String endTime = "";// 方按截止时间

	private String mulitys = "";// 追号倍数列表
	private String func = "";
	private int tr = 0;
	
	private String awardMatch = "";

	public int getTr() {
		return tr;
	}

	public void setTr(int tr) {
		this.tr = tr;
	}

	public String getFunc() {
		return func;
	}

	public void setFunc(String func) {
		this.func = func;
	}

	public String getBalance() {
		return balance;
	}

	public void setBalance(String balance) {
		this.balance = balance;
	}

	public int getPlay() {
		return play;
	}

	public void setPlay(int play) {
		this.play = play;
	}

	public String getCodes() {
		return codes;
	}

	public void setCodes(String codes) {
		this.codes = codes;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDesc() {
		return desc;
	}

	public void setDesc(String desc) {
		this.desc = desc;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getTnum() {
		return tnum;
	}

	public void setTnum(int tnum) {
		this.tnum = tnum;
	}

	public int getBnum() {
		return bnum;
	}

	public void setBnum(int bnum) {
		this.bnum = bnum;
	}

	public int getPnum() {
		return pnum;
	}

	public void setPnum(int pnum) {
		this.pnum = pnum;
	}

	public int getMuli() {
		return muli;
	}

	public void setMuli(int muli) {
		this.muli = muli;
	}

	public int getMoney() {
		return money;
	}

	public void setMoney(int money) {
		this.money = money;
	}

	public int getWrate() {
		return wrate;
	}

	public void setWrate(int wrate) {
		this.wrate = wrate;
	}

	public int getOflag() {
		return oflag;
	}

	public void setOflag(int oflag) {
		this.oflag = oflag;
	}

	public int getFflag() {
		return fflag;
	}

	public void setFflag(int fflag) {
		this.fflag = fflag;
	}

	public int getZflag() {
		return zflag;
	}

	public void setZflag(int zflag) {
		this.zflag = zflag;
	}

	public String getHid() {
		return hid;
	}

	public void setHid(String hid) {
		this.hid = hid;
	}

	public String getBid() {
		return bid;
	}

	public void setBid(String bid) {
		this.bid = bid;
	}

	public String getZid() {
		return zid;
	}

	public void setZid(String zid) {
		this.zid = zid;
	}

	public String getDid() {
		return did;
	}

	public void setDid(String did) {
		this.did = did;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public String getFind() {
		return find;
	}

	public void setFind(String find) {
		this.find = find;
	}

	public String getFsort() {
		return fsort;
	}

	public void setFsort(String fsort) {
		this.fsort = fsort;
	}

	public String getDsort() {
		return dsort;
	}

	public void setDsort(String dsort) {
		this.dsort = dsort;
	}

	public int getEmoney() {
		return emoney;
	}

	public void setEmoney(int emoney) {
		this.emoney = emoney;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public String getMulitys() {
		return mulitys;
	}

	public void setMulitys(String mulitys) {
		this.mulitys = mulitys;
	}

	public int check(int flag) {
		 if(GameUtil.canNotUse(getGid())){
			 setBusiErrCode(TradeErrCode.ERR_CHECK);
			 setBusiErrDesc("不支持的彩种");
			 return 0;
		 }
		 
		 if(!CheckUtil.isNullString(name)) {
			 boolean isvalid = name.matches(".*script.*") || name.matches(".*(\\d){5}.*") || name.matches(".*http.*") || name.matches(".*[<>{}].*");
			 System.out.println(isvalid);
			 if(isvalid){
				 setBusiErrCode(TradeErrCode.ERR_CHECK);
				 setBusiErrDesc("方案名称包含非法字符");
				 return 0;
			 }
		 }
		 
		 if(!CheckUtil.isNullString(desc)) {
			 boolean isvalid = desc.matches(".*script.*") || desc.matches(".*(\\d){5}.*") || desc.matches(".*http.*") || desc.matches(".*[<>{}].*");
			 System.out.println(isvalid);
			 if(isvalid){
				 setBusiErrCode(TradeErrCode.ERR_CHECK);
				 setBusiErrDesc("方案描述包含非法字符");
				 return 0;
			 }
		 }

		String gid = this.getGid();
		String pid = this.getPid();

		setBusiErrCode(0);
		setBusiErrDesc("检查通过");
		
		if (flag == CAST_HM) {
			if (!(gid.equalsIgnoreCase("90") || gid.equalsIgnoreCase("91") || gid.equalsIgnoreCase("92") || gid.equalsIgnoreCase("93") || gid.equalsIgnoreCase("94")
					|| gid.equalsIgnoreCase("95") || gid.equalsIgnoreCase("96") || gid.equalsIgnoreCase("97") || gid.equalsIgnoreCase("70") || gid.equalsIgnoreCase("71") || gid.equalsIgnoreCase("72"))) {
				if (CheckUtil.isNullString(pid)) {
					setBusiErrCode(TradeErrCode.ERR_CHECK);
					setBusiErrDesc("期号指定不明确");
				}
			}
			if (bnum < 0) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("认购份数不符合要求");
			}

			if (bnum > tnum) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("认购份数不能超过总份数");
			}

			if (bnum + pnum > tnum) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("购买份数和保底份数不能超过总份数");
			}

			if (type == 0) {
				if (CheckUtil.isNullString(codes)) {
					setBusiErrCode(TradeErrCode.ERR_CHECK);
					setBusiErrDesc("代购必须有投注号码");
				}
			} else {
				if (money / tnum != 1) {
					setBusiErrCode(TradeErrCode.ERR_CHECK);
					setBusiErrDesc("每份必须是1元");
				}

				if (pnum > 0 && (pnum * 100.0 / tnum < 5)) {
					setBusiErrCode(TradeErrCode.ERR_CHECK);
					setBusiErrDesc("保底比率必须超过5%");
				}

				if (bnum > 0 && (bnum * 100.0 / tnum < 5)) {
					setBusiErrCode(TradeErrCode.ERR_CHECK);
					setBusiErrDesc("自购比率必须超过5%");
				}
			}

			if (wrate < 0 || wrate > 10) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("提成比率不能超过10%");
			}

		} else if (flag == CAST_BUY) {
			if (CheckUtil.isNullString(gid)) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("彩种指定不明确");
			}
			if (bnum <= 0) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("认购份数不符合要求");
			}
		} else if (flag == CAST_ZH) {
			if (CheckUtil.isNullString(gid)) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("彩种指定不明确");
			}
			if (money <= 0) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("追号金额不符合要求");
			}
			// if(pid.split(",").length != pnum){
			// setErrCode(TradeErrCode.ERR_CHECK);
			// setErrDesc("追号期次不符合要求");
			// }
			// if(mulitys.split(",").length != pnum){
			// setErrCode(TradeErrCode.ERR_CHECK);
			// setErrDesc("追号倍数不符合要求");
			// }
		} else if (flag == CANCEL_HM) {
			if (CheckUtil.isNullString(gid)) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("彩种指定不明确");
			}
			if (CheckUtil.isNullString(hid)) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("撤销方案指定不明");
			}
		} else if (flag == CANCEL_BUY) {
			if (CheckUtil.isNullString(gid)) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("彩种指定不明确");
			}
			if (CheckUtil.isNullString(bid)) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("撤销认购指定不明");
			}
		} else if (flag == CANCEL_ZH) {
			if (CheckUtil.isNullString(gid)) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("彩种指定不明确");
			}
			if (CheckUtil.isNullString(zid)) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("撤销追号指定不明");
			}
		} else if (flag == UPLOAD) {
			if (CheckUtil.isNullString(gid)) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("彩种指定不明确");
			}
			if (CheckUtil.isNullString(codes)) {
				setBusiErrCode(TradeErrCode.ERR_CHECK);
				setBusiErrDesc("上传号码不能为空");
			}
		}
		return 0;
	}

	public String getAwardMatch() {
		return awardMatch;
	}

	public void setAwardMatch(String awardMatch) {
		this.awardMatch = awardMatch;
	}
}
