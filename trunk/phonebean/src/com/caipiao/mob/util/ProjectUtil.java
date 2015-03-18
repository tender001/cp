package com.caipiao.mob.util;

import java.io.File;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map.Entry;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.caipiao.game.cacher.util.FileUtil;
import com.caipiao.mob.match.Match;
import com.mina.rbc.util.DateUtil;
import com.mina.rbc.util.StringUtil;

public class ProjectUtil {
	
	private static String[] spfstr=new String[]{"3","1","0"};
	private static String[] jqsstr=new String[]{"0","1","2","3","4","5","6","7"};
	private static String[] bqcstr=new String[]{"3-3","3-1","3-0","1-3","1-1","1-0","0-3","0-1","0-0"};
	private static String[] cbfstr=new String[]{"1:0","2:0","2:1","3:0","3:1","3:2","4:0","4:1","4:2","5:0","5:1","5:2","9:0","0:0","1:1","2:2","3:3","9:9","0:1","0:2","1:2","0:3","1:3","2:3","0:4","1:4","2:4","0:5","1:5","2:5","0:9"};
	private static String[] sfstr=new String[]{"0","3"};
	private static String[] rfsfstr=new String[]{"0","3"};
	private static String[] dxfstr=new String[]{"3","0"};
	private static String[] sfcstr=new String[]{"11","12","13","14","15","16","01","02","03","04","05","06"};
	private static String[] klpkstr=new String[]{"A","2","3","4","5","6","7","8","9","10","J","Q","K"};
	private static String[] klpksz=new String[]{"A 2 3","2 3 4","3 4 5","4 5 6","5 6 7","6 7 8","7 8 9","8 9 10","9 10 J","10 J Q","J Q K","Q K A"};
	private static String[] klpktp=new String[]{"黑桃","红桃","梅花","方块","","","同花","同花顺","顺子","豹子","对子"};
	
	public static String getResult(int state,int award,double tax){
		if(state > 2){
			return "作废";
		}
		if(award == 2){
			if(tax == 0){
				return "未中奖";
			} else {
				return "已中奖";
			}
		}
		return"未开奖";
	}
	
	public static String getStatus(int cast){
		if(cast == 3){
			return "已出票";
		} else if(cast == 2) {
			return "出票中";
		}
		return "未出票";
	}
	
	public static String getWinMoney(int cast, String money){
		if(cast == 3){
			return money;
		}
		return "0";
	}
	
	public static String getCastType(String casttype){
		String cast = "";
		if(GameUtil.CastType.CASTTYPE_BAOHAO.equals(casttype.trim())){
			cast = "包号";
		} else if(GameUtil.CastType.CASTTYPE_HESHU.equals(casttype.trim())){
			cast = "和值";
		} 
//		else if(GameUtil.CastType.CASTTYPE_SINGLE.equals(casttype.trim())){
//			cast = "单式";
//		}else if(GameUtil.CastType.CASTTYPE_MULTI.equals(casttype.trim())){
//			cast = "复式";
//		} 
		else if(GameUtil.CastType.CASTTYPE_DANTUO.equals(casttype.trim())){
			cast = "胆拖";
		}
		return cast;
	}
	
	public static String getCode(String gameid, String code){
		String [] parts = StringUtil.splitter(code, ":");
		StringBuffer sb = new StringBuffer();
		if(GameUtil.GameContains.FC_SSQ.equals(gameid)
				|| GameUtil.GameContains.TC_DLT.equals(gameid)){
			sb.append(parts[0].replaceAll(",", " ").replaceAll("\\|", "+"));
		} else if (GameUtil.GameContains.FC_3D.equals(gameid)
				|| GameUtil.GameContains.TC_PL3.equals(gameid)){
			String prefix = "";
			if(GameUtil.CastType.CASTTYPE_BAOHAO.equals(parts[2].trim())){
				if("1".equals(parts[1].trim())){
					prefix = "1|";
				} else if("2".equals(parts[1].trim())){
					prefix = "F3|";
				}  else if("3".equals(parts[1].trim())){
					prefix = "F6|";
				}
			} else if(GameUtil.CastType.CASTTYPE_HESHU.equals(parts[2].trim())){
				if("1".equals(parts[1].trim())){
					prefix = "S1|";
				} else if("2".equals(parts[1].trim())){
					prefix = "S3|";
				} else if("3".equals(parts[1].trim())){
					prefix = "S6|";
				} else if("4".equals(parts[1].trim())){
					prefix = "S9|";
				}
			} else if(GameUtil.CastType.CASTTYPE_SINGLE.equals(parts[2].trim()) 
					|| GameUtil.CastType.CASTTYPE_MULTI.equals(parts[2].trim())){
				if("1".equals(parts[1].trim())){
					prefix = "1|";
				} else if("2".equals(parts[1].trim()) || "3".equals(parts[1].trim())){
					prefix = "6|";
				}
			}
			sb.append(prefix).append(parts[0].trim());
		} else if (GameUtil.GameContains.KP_CQ_SSC.equals(gameid)){
			sb.append("[");
			if("1".equals(parts[1].trim())){
				sb.append("五星");
			} else if("3".equals(parts[1].trim())){
				sb.append("三星");
			} else if("4".equals(parts[1].trim())){
				sb.append("两星");
			} else if("5".equals(parts[1].trim())){
				sb.append("一星");
			} else if("6".equals(parts[1].trim())){
				sb.append("大小单双");
				parts[1] = parts[1].trim().replaceAll("2", "大").replaceAll("1", "小").replaceAll("5", "单").replaceAll("4", "双");
			} else if("7".equals(parts[1].trim())){
				sb.append("二星组选");
			} else if("12".equals(parts[1].trim())){
				sb.append("五星通选");
			} else if("13".equals(parts[1].trim())){
				sb.append("五星复选");
			} else if("15".equals(parts[1].trim())){
				sb.append("三星复选");
			} else if("16".equals(parts[1].trim())){
				sb.append("两星复选");
			}
			sb.append(getCastType(parts[2]));
			sb.append("]").append(parts[0].trim());
		} else if (GameUtil.GameContains.FC_QLC.equals(gameid)){
			String [] balls = StringUtil.splitter(parts[0], "$");
			if(balls.length > 1){
				sb.append("[胆]").append(balls[0]).append("[拖]").append(balls[1]);
			} else {
				sb.append(parts[0].trim());
			}
		} else if (GameUtil.GameContains.KP_JX_SSC.equals(gameid)){
			sb.append("[");
			if("1".equals(parts[1].trim())){
				sb.append("一星");
			} else if("2".equals(parts[1].trim())){
				sb.append("两星");
			} else if("3".equals(parts[1].trim())){
				sb.append("三星");
			} else if("4".equals(parts[1].trim())){
				sb.append("四星");
			} else if("5".equals(parts[1].trim())){
				sb.append("五星");
			} else if("6".equals(parts[1].trim())){
				sb.append("二星复选");
			} else if("7".equals(parts[1].trim())){
				sb.append("三星复选");
			} else if("8".equals(parts[1].trim())){
				sb.append("四星复选");
			} else if("9".equals(parts[1].trim())){
				sb.append("五星复选");
			} else if("10".equals(parts[1].trim())){
				sb.append("二星组选");
			} else if("11".equals(parts[1].trim())){
				sb.append("大小单双");
				parts[1] = parts[1].trim().replaceAll("2", "大").replaceAll("1", "小").replaceAll("5", "单").replaceAll("4", "双");
			} else if("12".equals(parts[1].trim())){
				sb.append("五星通选");
			} else if("13".equals(parts[1].trim())){
				sb.append("任选一");
			} else if("14".equals(parts[1].trim())){
				sb.append("任选二");
			} else if("15".equals(parts[1].trim())){
				sb.append("三星组选三");
			} else if("16".equals(parts[1].trim())){
				sb.append("三星组选六");
			}
			sb.append(getCastType(parts[2]));
			sb.append("]").append(parts[0].trim());
		} else if (GameUtil.GameContains.TC_QXC.equals(gameid)){
			sb.append(parts[0].trim());
		} else if (GameUtil.GameContains.TC_PL5.equals(gameid)){
			sb.append(parts[0].trim());
		} else if (GameUtil.GameContains.KP_JX_11C5.equals(gameid)
				|| GameUtil.GameContains.KP_GD_11C5.equals(gameid)
				|| GameUtil.GameContains.KP_SD_11C5.equals(gameid)){
			String prefix = "";
			if("1".equals(parts[1].trim())){
				prefix = "R1|";
			} else if("2".equals(parts[1].trim())){
				prefix = "R2|";
			} else if("3".equals(parts[1].trim())){
				prefix = "R3|";
			} else if("4".equals(parts[1].trim())){
				prefix = "R4|";
			} else if("5".equals(parts[1].trim())){
				prefix = "R5|";
			} else if("6".equals(parts[1].trim())){
				prefix = "R6|";
			} else if("7".equals(parts[1].trim())){
				prefix = "R7|";
			} else if("8".equals(parts[1].trim())){
				prefix = "R8|";
			} else if("9".equals(parts[1].trim())){
				prefix = "Q2|";
			} else if("10".equals(parts[1].trim())){
				prefix = "Q3|";
			} else if("11".equals(parts[1].trim())){
				prefix = "Z2|";
			} else if("12".equals(parts[1].trim())){
				prefix = "Z3|";
			}
			sb.append(prefix).append(parts[0].replaceAll(",", " "));
		}else if (GameUtil.GameContains.KP_KLPK.equals(gameid)){
			String prefix = "";
			if(0<Integer.valueOf(parts[1].trim())&&Integer.valueOf(parts[1].trim())<7){
				if("01".equals(parts[1].trim())){
					prefix = "R1|";
				} else if("02".equals(parts[1].trim())){
					prefix = "R2|";
				} else if("03".equals(parts[1].trim())){
					prefix = "R3|";
				} else if("04".equals(parts[1].trim())){
					prefix = "R4|";
				} else if("05".equals(parts[1].trim())){
					prefix = "R5|";
				} else if("06".equals(parts[1].trim())){
					prefix = "R6|";
				} 
				sb.append(prefix).append(getKlpkCastInfo(klpkstr,parts[0].trim()));
			}else if("07".equals(parts[1].trim())){
				sb.append("同花"+getKlpkCastInfo(klpktp,parts[0].trim()));
			}else if("08".equals(parts[1].trim())){
				sb.append("同花顺"+getKlpkCastInfo(klpkstr,parts[0].trim()));
			}else if("09".equals(parts[1].trim())){
				sb.append("顺子"+getKlpkCastInfo(klpksz,parts[0].trim()));
			}else if("10".equals(parts[1].trim())){
				sb.append("豹子"+getKlpkCastInfo(klpkstr,parts[0].trim()));
			}else if("11".equals(parts[1].trim())){
				sb.append("对子"+getKlpkCastInfo(klpkstr,parts[0].trim()));
			}else if("12".equals(parts[1].trim())){
				sb.append("包选"+klpktp[Integer.valueOf(parts[0].trim())-1]);
			}
			
		}
		return sb.toString();
	}

	private static String getKlpkCastInfo(String[] str,String code){
		String f = ",";
		if(code.indexOf("|")>0){
			f = "|";
		}
		String[] codes =  StringUtil.splitter(code, f);
		String info = "";
		for (int i = 0; i < codes.length; i++) {
			info+=str[Integer.valueOf(codes[i])-1]+",";
		}
		info = info.substring(0,info.lastIndexOf(","));
		return info;
	}
	
	//TODO号码释义
	public static JSONArray getCodes(String gameid, String codes, HashMap<String, Match> maps, JSONObject json) throws Exception{
		JSONArray array = new JSONArray();
		String [] _codes = StringUtil.splitter(codes, ";");
		HashMap<String, Long> match = new HashMap<String, Long>();
		HashMap<String, List<String>> matchInfo = new HashMap<String, List<String>>();
		
		System.out.println(codes);
		
		for(String code : _codes){
			if(!StringUtil.isEmpty(code)){
				String [] parts = StringUtil.splitter(code, ":");
				JSONObject obj = new JSONObject();
				StringBuffer sb = new StringBuffer();
				if(GameUtil.GameContains.ZC_SFC.equals(gameid)
						|| GameUtil.GameContains.ZC_RX9.equals(gameid) 
						|| GameUtil.GameContains.ZC_JQS.equals(gameid)
						|| GameUtil.GameContains.ZC_BQC.equals(gameid)){
					sb.append(parts[0].trim());
				} else if(GameUtil.GameContains.BD_SPF.equals(gameid)
						|| GameUtil.GameContains.BD_CBF.equals(gameid)
						|| GameUtil.GameContains.BD_BQC.equals(gameid)
						|| GameUtil.GameContains.BD_SXP.equals(gameid)
						|| GameUtil.GameContains.BD_JQS.equals(gameid)
						|| GameUtil.GameContains.JCZQ_SPF.equals(gameid)
						|| GameUtil.GameContains.JCZQ_RQSPF.equals(gameid)
						|| GameUtil.GameContains.JCZQ_HH.equals(gameid)
						|| GameUtil.GameContains.JCZQ_CBF.equals(gameid)
						|| GameUtil.GameContains.JCZQ_BQC.equals(gameid)
						|| GameUtil.GameContains.JCZQ_JQS.equals(gameid)
						|| GameUtil.GameContains.JCLQ_HH.equals(gameid)
						|| GameUtil.GameContains.JCLQ_SF.equals(gameid)
						|| GameUtil.GameContains.JCLQ_RFSF.equals(gameid)
						|| GameUtil.GameContains.JCLQ_SFC.equals(gameid)
						|| GameUtil.GameContains.JCLQ_DXF.equals(gameid)){
					String [] tmp = StringUtil.splitter(code, "|");
					System.out.println(tmp[1]);
					if(tmp.length >= 3){
						String items = tmp[1].trim();
						if(items.indexOf("$") != -1){
							String [] tmpcs = StringUtil.splitter(items, "$");
							StringBuffer dsb = new StringBuffer();
							dsb.append(transCode(gameid, tmpcs[0], maps, match,matchInfo,json));
							dsb.append("$");
							dsb.append(transCode(gameid, tmpcs[1], maps, match,matchInfo,json));
							String s = dsb.toString();
							if(s.endsWith(",")){
								s = s.substring(0, s.length() - 1);
							}
							items = s;
						} else {
							items = transCode(gameid, items, maps, match,matchInfo,json);
						}
						sb.append(tmp[0].trim());
						sb.append("|");
						sb.append(items);
						sb.append("|");
						sb.append(tmp[2].trim());
					} else {
						sb.append(code.trim());
					}
				} else if(GameUtil.GameContains.GYJ_GJ.equals(gameid)
						|| GameUtil.GameContains.GYJ_GYJ.equals(gameid)){
					String [] tmp = StringUtil.splitter(parts[0], "|");
					sb.append("[");
					sb.append(GameUtil.getGameName(gameid));
					sb.append("]");
					
					StringBuffer dsb = new StringBuffer();
					String [] items = StringUtil.splitter(tmp[1].trim(), "=");
					dsb.append(items[0].trim()).append("=");
					String [] cs = StringUtil.splitter(items[1].trim(), "/");
					for(String ss : cs){
						String matchID = ss.trim();
						Match m = maps.get(matchID);
						String vs = matchID;
						if(m != null){
							vs = m.getVSTeam(gameid);
						}
						dsb.append(vs).append("/");
					}
					String s = dsb.toString();
					if(s.endsWith("/")){
						s = s.substring(0, s.length() - 1);
					}
					sb.append(s);
				} else {
					sb.append(getCode(gameid, code));
				}
				obj.put("content", sb.toString());
				obj.put("code", sb.toString());
				array.put(obj);
			}
		}
		if(json != null){
			int size = match.size();
			JSONArray arr = new JSONArray();
			if(size > 0){
				String[] weeks = new String[]{"日","一","二","三","四","五","六"};
				for(Iterator<Entry<String, Long>> its = match.entrySet().iterator();its.hasNext();){
					Entry<String, Long> entry = its.next();
					String matchID = entry.getKey();
					Match m = maps.get(matchID);
					if(m != null){
						Long val = entry.getValue();
						JSONObject obj = new JSONObject();
						if(GameUtil.GameContains.JCZQ_SPF.equals(gameid)
								|| GameUtil.GameContains.JCZQ_RQSPF.equals(gameid)
								|| GameUtil.GameContains.JCZQ_HH.equals(gameid)
								|| GameUtil.GameContains.JCZQ_CBF.equals(gameid)
								|| GameUtil.GameContains.JCZQ_BQC.equals(gameid)
								|| GameUtil.GameContains.JCZQ_JQS.equals(gameid)
								|| GameUtil.GameContains.JCLQ_HH.equals(gameid)
								|| GameUtil.GameContains.JCLQ_SF.equals(gameid)
								|| GameUtil.GameContains.JCLQ_RFSF.equals(gameid)
								|| GameUtil.GameContains.JCLQ_SFC.equals(gameid)
								|| GameUtil.GameContains.JCLQ_DXF.equals(gameid)){
							String tDATE="20"+matchID.substring(0,2)+"-"+matchID.substring(2,4)+"-"+matchID.substring(4,6);
							obj.put("week", "周"+weeks[DateUtil.parserDate(tDATE).getDay()]);
						}else{
							obj.put("week", "");
						}
						obj.put("id", matchID);
						obj.put("matchtime", m.getMatchTime());
						obj.put("state", m.getStatus());
						obj.put("home", m.getHomeName());
						List<String> matchInfos = matchInfo.get(matchID);
						List<String> matchSelect = new ArrayList<String>();
						List<String> caiguo = new ArrayList<String>();
//						System.out.println(matchID+"---------------------"+matchInfos.size());
						for (String object : matchInfos) {
							String[] infos = object.split(",");
							if(infos!=null&&infos.length>0){
								for (int i = 0; i < infos.length; i++) {
									if(infos.length==1){
										matchSelect.add(infos[0]);
									}
									if(i==1){
										if(infos[i]!=""){
											matchSelect.add(infos[0]+"("+infos[i]+")");
										}else{
											matchSelect.add(infos[0]);
										}
										
									}
									if(i==2&&infos[i]!=""){
										if(caiguo!=null&&caiguo.size()>0){
											if(!caiguo.contains(infos[i])){
												caiguo.add(infos[i]);
											}
										}else{
											caiguo.add(infos[i]);
										}
									}
								}
							}
						}
						obj.put("matchSelect", matchSelect);
						obj.put("caiguo", caiguo);
						if(GameUtil.isGYJ(gameid)){
							
						} else {
							obj.put("visit", m.getVisitName());
							if(GameUtil.isJCLQ(gameid)){
								obj.put("sum", m.getZlose());
							} else {
								obj.put("half", m.getHalfScore());
							}
							obj.put("score", m.getScore());
							obj.put("point", m.getLose());
						}
						obj.put("ordersum", "[" + m.getSourceEx(val.longValue(), 1, ",") + "]");
						obj.put("opensum", m.getResult());
						arr.put(obj);
					}
				}
			}
			json.put("matchorder", arr);
		}
		return array;
	}
	
	private static int getSub(String[] spfstr,String result){
		for(int i=0;i<spfstr.length;i++){
			if(spfstr[i].equals(result.trim())){return i;}
		}
		return -1;
	}
	private static List<String> getSp(Match match,String lotid,String expect,String projid,String cid,String playty){
	  	
		File file = new File("/opt/export/cpdata/guoguan/" + lotid + "/" + expect + "/proj/"+ projid.toLowerCase() + ".json");
		//System.out.println("----获取sp值文件"+file.getAbsolutePath());
		if(file.exists()){
			String strJson = FileUtil.getFileContent(file, null);
			if(StringUtil.isEmpty(strJson)){
				System.out.println("----获取sp值文件内容为空"+file.getAbsolutePath());
				return null;
			} else {
				try {
					JSONObject obj = new JSONObject(strJson);
					JSONObject items = obj.getJSONObject("items");
					JSONArray itemArr = items.getJSONArray("item");
					for (int i = 0; i < itemArr.length(); i++) {
						String id = itemArr.getJSONObject(i).getString("id");
						if(id.equals(cid)){
							if(lotid.equals("70")||lotid.equals("72")||lotid.equals("90")||lotid.equals("91")||lotid.equals("92")||lotid.equals("93")
									||lotid.equals("85")||lotid.equals("86")||lotid.equals("87")||lotid.equals("88")||lotid.equals("89")){
								return handleJson(match,lotid, expect, projid, cid, playty,itemArr.getJSONObject(i));
							}else if(lotid.equals("71")||lotid.equals("94")||lotid.equals("95")||lotid.equals("96")||lotid.equals("97")){
								return handleJclqJson(match,lotid, expect, projid, cid, playty,itemArr.getJSONObject(i));
							}
						}
					}
				} catch (JSONException e) {
					System.out.println("----获取sp值文件无数组，解析json对象");
					try {
						JSONObject obj = new JSONObject(strJson);
						JSONObject items = obj.getJSONObject("items");
						if(lotid.equals("70")||lotid.equals("72")||lotid.equals("90")||lotid.equals("91")||lotid.equals("92")||lotid.equals("93")
								||lotid.equals("85")||lotid.equals("86")||lotid.equals("87")||lotid.equals("88")||lotid.equals("89")){
							return handleJson(match,lotid, expect, projid, cid, playty,items.getJSONObject("item"));
						}else if(lotid.equals("71")||lotid.equals("94")||lotid.equals("95")||lotid.equals("96")||lotid.equals("97")){
							return handleJclqJson(match,lotid, expect, projid, cid, playty,items.getJSONObject("item"));
						}
					} catch (JSONException e1) {
						System.out.println("----获取sp值文件解析json对象出错");
						e1.printStackTrace();
					}
				}
				return null;
				
			}
		}else{
			System.out.println("----文件不存在"+file.getAbsolutePath());
			return null;
		}
	}
	
	private static List<String> handleJson(Match match,String lotid,String expect,String projid,String cid,String playty,JSONObject object){
		String spInfo ="";
		String result ="";
		List<String> spArr = new ArrayList<String>();
		try {	
			Integer hs = -1;//全场主队进球
			if(object.getString("hs").trim()!=null&&!object.getString("hs").trim().equals("")){
				hs = object.getInt("hs");
			}
			Integer vs = -1;//全场客队进球
			if(object.getString("vs").trim()!=null&&!object.getString("vs").trim().equals("")){
				vs = object.getInt("vs");
			}
			Integer hhs = -1;//半场主队进球
			if(object.getString("hhs").trim()!=null&&!object.getString("hhs").trim().equals("")){
				hhs=object.getInt("hhs");
			}
			Integer hvs = -1;//半场客队进球
			if(object.getString("hvs").trim()!=null&&!object.getString("hvs").trim().equals("")){
				hvs=object.getInt("hvs");
			}
			String spvalue = object.getString("spvalue");//出票参考SP
			spArr.add(spvalue);
			Integer cancel = object.getInt("cancel");//场次是否取消
			Double lose = object.getDouble("lose");
			String id = object.getString("id");
			String kjResult = object.getString("result");
			if(id.equals(cid)){
				String[] spvalues = StringUtil.splitter(spvalue,"|");
				if(lotid.equals("70")){
					if(playty.equals("SPF")){
						String[] spvalueArr = StringUtil.splitter(spvalues[0],",");
						if(cancel==0){
							if(hs.toString().length()>0&&hs>-1){
								Integer rt=(hs-vs)*1;
								if(rt*1>0){result="3";}else if(rt*1==0){result="1";}else{result="0";}
								spInfo =spvalueArr[getSub(spfstr,result)];
								if(result=="3"){
									result="胜";
								}else if(result=="1"){
									result="平";
								}else if(result=="0"){
									result="负";
								}
							}else{
								spInfo ="";
							}
						}
					}
					if(playty.equals("RSPF")){
						String[] spvalueArr = StringUtil.splitter(spvalues[4],",");
						if(cancel==0){
							if(hs.toString().length()>0&&hs>-1){
								Double rt=(hs-vs)*1+(lose)*1;
								if(rt*1>0){result="3";}else if(rt*1==0){result="1";}else{result="0";}
								spInfo =spvalueArr[getSub(spfstr,result)];
								if(result=="3"){
									result="胜";
								}else if(result=="1"){
									result="平";
								}else if(result=="0"){
									result="负";
								}
							}else{
								spInfo ="";
							}
						}
						match.setLose(lose);
					}
					if(playty.equals("CBF")){
						String[] spvalueArr = StringUtil.splitter(spvalues[1],",");
						if(cancel==0){
							if(hs.toString().length()>0&&hs>-1){
								result=hs+":"+vs;
								int ii=100;
								for(int r=0;r<31;r++){
									if(cbfstr[r]==result){ii=r;}
								}
								if(ii==100){
									if(hs>vs){result="9:0";}else if(hs==vs){result="9:9";}else{result="0:9";}
								}
								spInfo =spvalueArr[getSub(cbfstr,result)];
								result = result.replace("9:0","胜其它").replace("9:9","平其它").replace("0:9","负其它");
							}else{
								spInfo ="";
							}
						}
					}	
					
					if(playty.equals("JQS")){
						String[] spvalueArr = StringUtil.splitter(spvalues[3],",");
						if(cancel==0){
							if(hs.toString().length()>0&&hs>-1){
								int rt=(hs+vs)*1;
								if(rt>=7){result="7";}else{result=rt+"";}
								spInfo =spvalueArr[getSub(jqsstr,result)];
							}else{
								spInfo ="";
							}
						}
					}
					
					if(playty.equals("BQC")){
						String[] spvalueArr = StringUtil.splitter(spvalues[2],",");
						if(cancel==0){
							if(hs.toString().length()>0&&hs>-1){
								int hrt=(hhs-hvs)*1;
								int rt=(hs-vs)*1;
								if(hrt*1>0){result="3";}else if(hrt*1==0){result="1";}else{result="0";}
								if(rt*1>0){result=result+"-3";}else if(rt*1==0){result=result+"-1";}else{result=result+"-0";}
								spInfo =spvalueArr[getSub(bqcstr,result)];
							}else{
								spInfo ="";
							}
						}
					}
				}
				if(spvalues.length >=1){
					String[] ststr=StringUtil.splitter(kjResult,";");
					if(lotid.equals("90")){
						if(spvalues.length > 1){
							spvalue = spvalues[0];
						}
						if(hs>-1){
							int _rt=(hs-vs)*1;
							if(_rt*1>0){result="3";}else if(_rt*1==0){result="1";}else{result="0";}
							String[] spstr=StringUtil.splitter(spvalue,",");
							if(result.equals("3")){
								spInfo =spstr[0];
								result="胜";
							}else if(result.equals("1")){
								spInfo =spstr[1];
								result="平";
							}else if(result.equals("0")){
								spInfo =spstr[2];
								result="负";
							}
						}
					}else if(lotid.equals("72")){
						if(spvalues.length > 1){
							spvalue = spvalues[4];
						}
						if(hs>-1){
							Double _rt=(hs-vs)*1+(lose)*1;
							if(_rt*1>0){result="3";}else if(_rt*1==0){result="1";}else{result="0";}
							String[] spstr=StringUtil.splitter(spvalue,",");
							if(result.equals("3")){
								spInfo =spstr[0];
								result="胜";
							}else if(result.equals("1")){
								spInfo =spstr[1];
								result="平";
							}else if(result.equals("0")){
								spInfo =spstr[2];
								result="负";
							}
						}
						match.setLose(lose);
					}else if(lotid.equals("91")){
						if(spvalues.length > 1){
							spvalue = spvalues[1];
						}
						if(hs>-1){
							String _rt=hs+""+vs;
							result=hs+":"+vs;
							String[] bfstr=new String[]{"10","20","21","30","31","32","40","41","42","50","51","52","90","00","11","22","33","99","01","02","12","03","13","23","04","14","24","05","15","25","09"};
							int ii=100;
							for(int j=0;j<31;j++){
								if(bfstr[j].equals(_rt)){ii=j;}
							}
							if(ii==12){
								result="胜其它";
							}else if(ii==17){
								result="平其它";
							}else if(ii==30){
								result="负其它";
							}else if(ii==100){
								if(hs>vs){result="胜其它";ii=12;}else if(hs==vs){result="平其它";ii=17;}else{result="负其它";ii=30;}
							}
							String[] spstr=StringUtil.splitter(spvalue,",");
							spInfo =spstr[ii*1];
						}
					}else if(lotid.equals("92")){
						if(spvalues.length > 1){
							spvalue = spvalues[2];
						}
						if(hs>-1){
							int hrt=(hhs-hvs)*1;
							int _rt=(hs-vs)*1;
							if(hrt*1>0){result="3";}else if(hrt*1==0){result="1";}else{result="0";}
							if(_rt*1>0){result=result+"-3";}else if(_rt*1==0){result=result+"-1";}else{result=result+"-0";}
							String[] spstr=spvalue.split(",");
							spInfo =(result=="3-3"?(spstr[0]):result=="3-1"?(spstr[1]):result=="3-0"?(spstr[2]):result=="1-3"?(spstr[3]):result=="1-1"?(spstr[4]):result=="1-0"?(spstr[5]):result=="0-3"?(spstr[6]):result=="0-1"?(spstr[7]):result=="0-0"?(spstr[8]):"--");
						}
					}else if(lotid.equals("93")){
						if(spvalues.length > 1){
							spvalue = spvalues[3];
						}
						if(hs>-1){
							int _rt=(hs+vs)*1;
							if(_rt>=7){result="7";}else{result=_rt+"";}
							String[] spstr=StringUtil.splitter(spvalue,",");
							spInfo =spstr[Integer.valueOf(result)*1];
						}
					}else if(lotid.equals("85")){
						if(ststr!=null&&ststr.length>0){
							result=StringUtil.splitter(ststr[0],":")[0].replaceAll("3", "胜").replaceAll("1", "平").replaceAll("0", "负");
						}
						spInfo =spvalue;
					}else if(lotid.equals("86")){
						if(ststr!=null&&ststr.length>0){
							result=StringUtil.splitter(ststr[1],":")[0];
							if(result=="90"){
								result="胜其它";
							}else if(result=="99"){
								result="平其它";
							}else if(result=="09"){
								result="负其它";
							}else {
								result=result.substring(0,1)+":"+result.substring(1,1);
							}
						}
						spInfo =spvalue;
					}else if(lotid.equals("87")){
						if(ststr!=null&&ststr.length>0){
							result=StringUtil.splitter(ststr[2],":")[0];
							result=result.substring(0,1)+"-"+result.substring(1,1);
						}
						spInfo =spvalue;
					}else if(lotid.equals("88")){
						if(ststr!=null&&ststr.length>0){
							String[] sx= new String[]{"下+双","下+单","上+双","上+单"};
							result=StringUtil.splitter(ststr[3],":")[0];
							result=sx[Integer.valueOf(result)];
						}
						spInfo =spvalue;
					}else if(lotid.equals("89")){
						if(ststr!=null&&ststr.length>0){
							result=StringUtil.splitter(ststr[4],":")[0];
						}
						spInfo =spvalue;
					}
				}
			}
			spArr.add(result);
		}catch(Exception e){
			e.printStackTrace();
		}
		return spArr;
	}
	
	private static List<String> handleJclqJson(Match match,String lotid,String expect,String projid,String cid,String playty,JSONObject object){
		
		String spInfo ="";
		String result ="";
		List<String> spArr = new ArrayList<String>();
		try {	
			Integer hs = -1;//全场主队进球
			if(object.getString("hs").trim()!=null&&!object.getString("hs").trim().equals("")){
				hs = object.getInt("hs");
			}
			Integer vs = -1;//全场客队进球
			if(object.getString("vs").trim()!=null&&!object.getString("vs").trim().equals("")){
				vs = object.getInt("vs");
			}
			String spvalue = object.getString("spvalue");//出票参考SP
			spArr.add(spvalue);
			Integer cancel = object.getInt("cancel");//场次是否取消
			String lose = object.getString("lose");
			String[] loses = StringUtil.splitter(lose,"|");
			String id = object.getString("id");
			if(id.equals(cid)){
				String[] spvalues = StringUtil.splitter(spvalue,"|");
				if(lotid.equals("71")){
					if(playty.equals("SF")){
						String[] spvalueArr = StringUtil.splitter(spvalues[0],",");
						if(cancel==0){
							if(hs.toString().length()>0&&hs>-1){
								Integer rt=(hs-vs)*1;
								if(rt*1>0){result="3";}else{result="0";}
								spInfo =spvalueArr[getSub(sfstr,result)];
								if(result=="3"){
									result="主胜";
								}else if(result=="0"){
									result="主负";
								}
							}
						}
					}
					if(playty.equals("RFSF")){
						String[] spvalueArr = StringUtil.splitter(spvalues[1],",");
						if(cancel==0){
							if(hs.toString().length()>0&&hs>-1){
								Double rt=(hs-vs)*1+(Double.valueOf(loses[1]))*1;
								if(rt*1>0){result="3";}else{result="0";}
								spInfo =spvalueArr[getSub(rfsfstr,result)];
								if(result=="3"){
									result="让分主胜";
								}else if(result=="0"){
									result="让分主负";
								}
							}
						}
						match.setLose(Double.valueOf(loses[1]));
					}
					if(playty.equals("DXF")){
						String[] spvalueArr = StringUtil.splitter(spvalues[3],",");
						if(cancel==0){
							if(hs.toString().length()>0&&hs>-1){
								Double rt=(hs+vs)*1-(Double.valueOf(loses[3]))*1;
								if(rt*1>0){result="3";}else{result="0";}
								spInfo =spvalueArr[getSub(dxfstr,result)];
								result = result.replace("3","大分").replace("0","小分");
							}
						}
						match.setLose(Double.valueOf(loses[3]));
					}	
					
					if(playty.equals("SFC")){
						String[] spvalueArr = StringUtil.splitter(spvalues[2],",");
						if(cancel==0){
							if(hs.toString().length()>0&&hs>-1){
								int rt=(hs-vs)*1;
								if(rt>0&&rt<6){result="01";}
								else if(rt>5&&rt<11){result="02";}
								else if(rt>10&&rt<16){result="03";}
								else if(rt>15&&rt<21){result="04";}
								else if(rt>20&&rt<26){result="05";}
								else if(rt>25){result="06";}
								else if(rt>-6&&rt<0){result="11";}
								else if(rt>-11&&rt<-5){result="12";}
								else if(rt<-10&&rt>-16){result="13";}
								else if(rt<-15&&rt>-21){result="14";}
								else if(rt<-20&&rt>-26){result="15";}
								else if(rt<-25){result="16";}
								spInfo =spvalueArr[getSub(sfcstr,result)];
								result=result.replace("01","主胜a").replace("02","主胜h").replace("03","主胜k").replace("04","主胜m").replace("05","主胜s").replace("06","主胜g").replace("11","客胜a").replace("12","客胜h").replace("13","客胜k").replace("14","客胜m").replace("15","客胜s").replace("16","客胜g").replace("a","1-5").replace("h","6-10").replace("k","11-15").replace("m","16-20").replace("s","21-25").replace("g","26+");
							}
						}
					}
				}
				if(spvalues.length > 1){
					if(lotid.equals("94")){
						if(spvalues.length > 1){
							spvalue = spvalues[0];
						}
						if(hs>-1){
							int _rt=(hs-vs)*1;
							if(_rt*1>0){result="主胜";}else{result="主负";}
							String[] spstr=StringUtil.splitter(spvalue,",");
							spInfo=(_rt*1>0?(spstr[1]):(spstr[0]));
						}
					}else if(lotid.equals("95")){
						if(spvalues.length > 1){
							spvalue = spvalues[1];
						}
						if(loses.length > 1){
							lose = loses[1];
							match.setLose(Double.valueOf(lose));
						}
						if(hs>-1){
							int rt=(hs-vs)*1+(Integer.valueOf(lose))*1;
							if(rt*1>0){result="主胜";}else{result="主负";}
							String[] spstr=StringUtil.splitter(spvalue,",");
							spInfo=(rt*1>0?(spstr[1]):(spstr[0]));
						}
					}else if(lotid.equals("96")){
						if(spvalues.length > 1){
							spvalue = spvalues[2];
						}
						if(hs>-1){
							int rt=(hs-vs)*1;
							String[] spstr=StringUtil.splitter(spvalue,",");
							if(rt>0&&rt<6){result="主胜1-5";spInfo=spstr[6];}
							else if(rt>5&&rt<11){result="主胜6-10";spInfo=spstr[7];}
							else if(rt>10&&rt<16){result="主胜11-15";spInfo=spstr[8];}
							else if(rt>15&&rt<21){result="主胜16-20";spInfo=spstr[9];}
							else if(rt>20&&rt<26){result="主胜21-25";spInfo=spstr[10];}
							else if(rt>25){result="主胜26+";spInfo=spstr[11];}
							else if(rt>-6&&rt<0){result="客胜1-5";spInfo=spstr[0];}
							else if(rt>-11&&rt<-5){result="客胜6-10";spInfo=spstr[1];}
							else if(rt<-10&&rt>-16){result="客胜11-15";spInfo=spstr[2];}
							else if(rt<-15&&rt>-21){result="客胜16-20";spInfo=spstr[3];}
							else if(rt<-20&&rt>-26){result="客胜21-25";spInfo=spstr[4];}
							else if(rt<-25){result="客胜26+";spInfo=spstr[5];}
						}
					}else if(lotid.equals("97")){
						if(spvalues.length > 1){
							spvalue = spvalues[3];
						}
						if(loses.length > 1){
							lose = loses[3];
							match.setLose(Double.valueOf(lose));
						}
						if(hs>-1){
							int rt=(hs+vs)*1-(Integer.valueOf(lose))*1;
							if(rt*1>0){result="大分";}else{result="小分";}
							String[] spstr=spvalue.split(",");
							spInfo=(rt*1>0?(spstr[0]):(spstr[1]));
						}
					}else if(lotid.equals("93")){
						if(spvalues.length > 1){
							spvalue = spvalues[3];
						}
						if(hs>-1){
							int _rt=(hs+vs)*1;
							if(_rt>=7){result="7";}else{result=_rt+"";}
							String[] spstr=StringUtil.splitter(spvalue,",");
							spInfo =spstr[Integer.valueOf(result)*1];
						}
					}
				}
			}
			spArr.add(result);
		}catch(Exception e){
			e.printStackTrace();
		}
		return spArr;
	}
	
	private static String transCode(String gameid, String items, HashMap<String, Match> maps, HashMap<String, Long> match,HashMap<String, List<String>> matchInfo,JSONObject json){
		//131105001>RSPF=3+JQS=1+CBF=1:0,131105002>SPF=3/1+RSPF=1/0+JQS=1
		//131105001=3/1/0,131105002=3/1/0,131105003=3/1/0
		//140716051=1:0,140716052=0:0,140716053=1:0
		String expect="";
		String projid="";
		
		if(json!=null){
			try {
				expect = json.getString("termNo");
				projid = json.getString("projid");
			} catch (JSONException e) {
				e.printStackTrace();
			}
		}
		String [] tmpcs = StringUtil.splitter(items, ",");
		StringBuffer dsb = new StringBuffer();
		for(int i = 0; i < tmpcs.length; i++){
			String item = tmpcs[i].trim();
			//选择的结果
			List<String> select = new ArrayList<String>();
			if(item.indexOf(">") == -1){
				//131105001=3/1/0
				String [] item_parts = StringUtil.splitter(item, "=");
				String matchID = item_parts[0].trim();
				Match m = maps.get(matchID);
				String vs = matchID;
				if(m != null){
					vs = m.getVSTeam(gameid);
					Long val = match.get(matchID);
					if(val == null){
						val = 0L;
					}
					String [] tt = StringUtil.splitter(item_parts[1].trim(), "/");
					List<String> spArr = getSp(m,gameid,expect,projid,matchID,"");
					String spValueStr = "";
					String caiResult ="";
					if(spArr!=null&&spArr.size()>0){
						for (int j = 0; j < spArr.size(); j++) {
							if(j==0){
								spValueStr = spArr.get(j);
							}
							if(j==1){
								caiResult= spArr.get(j);
							}
						}
					}
					String[] spvalues = null;
					if(!spValueStr.equals("")&&spValueStr!=null){
						spvalues = StringUtil.splitter(spValueStr,"|");
					}
					for(String t : tt){
						String result = "";
//						String type = GameUtil.getGamePrefix(gameid);
						if(gameid.equals("85")){//85 SPF
							if(t.trim().equals("3")){
								result = "胜";
							}else if(t.trim().equals("1")){
								result = "平";
							}else if(t.trim().equals("0")){
								result = "负";
							}
							result+=","+spValueStr+","+caiResult;
							
						}else if(gameid.equals("86")){//86 CBF
							result ="比分："+t;
							result+=","+spValueStr+","+caiResult;
							
						}else if(gameid.equals("87")){//87 BQC
							result ="半全场："+t;
							result+=","+spValueStr+","+caiResult;
							
						}else if(gameid.equals("88")){//88 SXP
							if(t.trim().equals("3")){
								result = "上单";
							}else if(t.trim().equals("2")){
								result = "上双";
							}else if(t.trim().equals("1")){
								result = "下单";
							}else if(t.trim().equals("0")){
								result = "下双";
							}
							result+=","+spValueStr+","+caiResult;
						}else if(gameid.equals("89")){//89 JQS
							result ="进球："+t;
							result+=","+spValueStr+","+caiResult;
							
						}else if(gameid.equals("90")){//90 SPF
							if(t.trim().equals("3")){
								result = "胜";
							}else if(t.trim().equals("1")){
								result = "平";
							}else if(t.trim().equals("0")){
								result = "负";
							}
							if(spvalues!=null&&spvalues.length>0){
								String[] spvalue = StringUtil.splitter(spvalues[0],",");
								result+=","+spvalue[getSub(spfstr,t)]+","+caiResult;
							}else{
								result+=",,"+caiResult;
							}
							
						}else if(gameid.equals("72")){//72 RSPF
							if(t.trim().equals("3")){
								result = "让胜";
							}else if(t.trim().equals("1")){
								result = "让平";
							}else if(t.trim().equals("0")){
								result = "让负";
							}
							if(spvalues!=null&&spvalues.length>0){
								String[] spvalue = StringUtil.splitter(spvalues[4],",");
								result+=","+spvalue[getSub(spfstr,t)]+","+caiResult;
							}else{
								result+=",,"+caiResult;
							}
						}else if(gameid.equals("91")){//91 CBF
							result ="比分："+t;
							if(spvalues!=null&&spvalues.length>0){
								String[] spvalue = StringUtil.splitter(spvalues[1],",");
								result+=","+spvalue[getSub(cbfstr,t)]+","+caiResult;
							}else{
								result+=",,"+caiResult;
							}
						}else if(gameid.equals("92")){//92 BQC
							result ="半全场："+t;
							if(spvalues!=null&&spvalues.length>0){
								String[] spvalue = StringUtil.splitter(spvalues[2],",");
								result+=","+spvalue[getSub(bqcstr,t)]+","+caiResult;
							}else{
								result+=",,"+caiResult;
							}
						}else if(gameid.equals("93")){//93 JQS
							result ="进球："+t;
							if(spvalues!=null&&spvalues.length>0){
								String[] spvalue = StringUtil.splitter(spvalues[3],",");
								result+=","+spvalue[getSub(jqsstr,t)]+","+caiResult;
							}else{
								result+=",,"+caiResult;
							}
						}else if(gameid.equals("94")){//94 SF
							if(t.trim().equals("3")){
								result = "主胜";
							}else if(t.trim().equals("0")){
								result = "主负";
							}
							if(spvalues!=null&&spvalues.length>0){
								String[] spvalue = StringUtil.splitter(spvalues[0],",");
								result+=","+spvalue[getSub(sfstr,t)]+","+caiResult;
							}else{
								result+=",,"+caiResult;
							}
						}else if(gameid.equals("95")){//95 RFSF
							if(t.trim().equals("3")){
								result = "让分主胜";
							}else if(t.trim().equals("0")){
								result = "让分主负";
							}
							if(spvalues!=null&&spvalues.length>0){
								String[] spvalue = StringUtil.splitter(spvalues[1],",");
								result+=","+spvalue[getSub(sfstr,t)]+","+caiResult;
							}else{
								result+=",,"+caiResult;
							}
						}else if(gameid.equals("96")){//96 SFC
							result =t.trim().replace("01","主胜a").replace("02","主胜h").replace("03","主胜k").replace("04","主胜m").replace("05","主胜s").replace("06","主胜g").replace("11","客胜a").replace("12","客胜h").replace("13","客胜k").replace("14","客胜m").replace("15","客胜s").replace("16","客胜g").replace("a","1-5").replace("h","6-10").replace("k","11-15").replace("m","16-20").replace("s","21-25").replace("g","26+");
							if(spvalues!=null&&spvalues.length>0){
								String[] spvalue = StringUtil.splitter(spvalues[2],",");
								result+=","+spvalue[getSub(sfcstr,t)]+","+caiResult;
							}else{
								result+=",,"+caiResult;
							}
						}else if(gameid.equals("97")){//97 DXF
							if(t.trim().equals("3")){
								result = "大分";
							}else if(t.trim().equals("0")){
								result = "小分";
							}
							if(spvalues!=null&&spvalues.length>0){
								String[] spvalue = StringUtil.splitter(spvalues[3],",");
								result+=","+spvalue[getSub(dxfstr,t)]+","+caiResult;
							}else{
								result+=",,"+caiResult;
							}
						}
						
//						System.out.println("----------"+result);
						if(matchInfo.get(matchID)!=null&&matchInfo.get(matchID).size()>0){
							if(!matchInfo.get(matchID).contains(result)){
								matchInfo.get(matchID).add(result);
							}
						}else{
							select.add(result);
							matchInfo.put(matchID,select);
						}
						String key = GameUtil.getGamePrefix(gameid) + "=" + t.trim();
						String pos = m.getPosition(key);
						if(pos != null){
							val |= 1L << Integer.parseInt(pos);
						}
					}
					match.put(matchID, val);
				}
				dsb.append(vs).append("=").append(item_parts[1]).append(",");
			} else {
				//131105001>RSPF=3+JQS=1+CBF=1:0
				String [] item_parts = StringUtil.splitter(item, ">");
				String matchID = item_parts[0].trim();
				Match m = maps.get(matchID);
				String vs = matchID;
				if(m != null){
					vs = m.getVSTeam(gameid);
					Long val = match.get(matchID);
					if(val == null){
						val = 0L;
					}
					String [] tt = StringUtil.splitter(item_parts[1].trim(), "+");
					
					for(String t : tt){
						String [] ps = StringUtil.splitter(t, "=");
						List<String> spArr = getSp(m,gameid,expect,projid,matchID,ps[0]);
						String spValueStr = "";
						String caiResult ="";
						if(spArr!=null&&spArr.size()>0){
							for (int j = 0; j < spArr.size(); j++) {
								if(j==0){
									spValueStr = spArr.get(j);
								}
								if(j==1){
									caiResult= spArr.get(j);
								}
							}
						}
						
						String[] spvalues = null;
						if(!spValueStr.equals("")&&spValueStr!=null){
							spvalues = StringUtil.splitter(spValueStr,"|");
						}
						String [] ts = StringUtil.splitter(ps[1].trim(), "/");
						for(String ss : ts){
							String result = "";
							if(ps[0].trim().equals("SPF")){
								if(ss.trim().equals("3")){
									result = "胜";
								}else if(ss.trim().equals("1")){
									result = "平";
								}else if(ss.trim().equals("0")){
									result = "负";
								}
								if(spvalues!=null&&spvalues.length>0){
									String[] spvalue = StringUtil.splitter(spvalues[0],",");
									result+=","+spvalue[getSub(spfstr,ss)]+","+caiResult;
								}else{
									result+=",,"+caiResult;
								}
							}else if(ps[0].trim().equals("RSPF")){
								if(ss.trim().equals("3")){
									result = "让胜";
								}else if(ss.trim().equals("1")){
									result = "让平";
								}else if(ss.trim().equals("0")){
									result = "让负";
								}
								if(spvalues!=null&&spvalues.length>0){
									String[] spvalue = StringUtil.splitter(spvalues[4],",");
									result+=","+spvalue[getSub(spfstr,ss)]+","+caiResult;
								}else{
									result+=",,"+caiResult;
								}
							}else if(ps[0].trim().equals("CBF")){
								result ="比分："+ss;
								if(spvalues!=null&&spvalues.length>0){
									String[] spvalue = StringUtil.splitter(spvalues[1],",");
									result+=","+spvalue[getSub(cbfstr,ss)]+","+caiResult;
								}else{
									result+=",,"+caiResult;
								}
							}else if(ps[0].trim().equals("BQC")){
								result ="半全场："+ss;
								if(spvalues!=null&&spvalues.length>0){
									String[] spvalue = StringUtil.splitter(spvalues[2],",");
									result+=","+spvalue[getSub(bqcstr,ss)]+","+caiResult;
								}else{
									result+=",,"+caiResult;
								}
							}else if(ps[0].trim().equals("JQS")){
								result ="进球："+ss;
								if(spvalues!=null&&spvalues.length>0){
									String[] spvalue = StringUtil.splitter(spvalues[3],",");
									result+=","+spvalue[getSub(jqsstr,ss)]+","+caiResult;
								}else{
									result+=",,"+caiResult;
								}
							}else if(ps[0].trim().equals("SF")){
								if(t.trim().equals("3")){
									result = "主胜";
								}else if(t.trim().equals("0")){
									result = "主负";
								}
								if(spvalues!=null&&spvalues.length>0){
									String[] spvalue = StringUtil.splitter(spvalues[0],",");
									result+=","+spvalue[getSub(sfstr,ss)]+","+caiResult;
								}else{
									result+=",,"+caiResult;
								}
							}else if(ps[0].trim().equals("RFSF")){
								if(ss.trim().equals("3")){
									result = "让分主胜";
								}else if(ss.trim().equals("0")){
									result = "让分主负";
								}
								if(spvalues!=null&&spvalues.length>0){
									String[] spvalue = StringUtil.splitter(spvalues[1],",");
									result+=","+spvalue[getSub(sfstr,ss)]+","+caiResult;
								}else{
									result+=",,"+caiResult;
								}
							}else if(ps[0].trim().equals("SFC")){
								result =ss.trim().replace("01","主胜a").replace("02","主胜h").replace("03","主胜k").replace("04","主胜m").replace("05","主胜s").replace("06","主胜g").replace("11","客胜a").replace("12","客胜h").replace("13","客胜k").replace("14","客胜m").replace("15","客胜s").replace("16","客胜g").replace("a","1-5").replace("h","6-10").replace("k","11-15").replace("m","16-20").replace("s","21-25").replace("g","26+");
								if(spvalues!=null&&spvalues.length>0){
									String[] spvalue = StringUtil.splitter(spvalues[2],",");
									result+=","+spvalue[getSub(sfcstr,ss)]+","+caiResult;
								}else{
									result+=",,"+caiResult;
								}
							}else if(ps[0].trim().equals("DXF")){
								if(ss.trim().equals("3")){
									result = "大分";
								}else if(ss.trim().equals("0")){
									result = "小分";
								}
								if(spvalues!=null&&spvalues.length>0){
									String[] spvalue = StringUtil.splitter(spvalues[3],",");
									result+=","+spvalue[getSub(dxfstr,ss)]+","+caiResult;
								}else{
									result+=",,"+caiResult;
								}
							}
//							System.out.println("============"+result);
							if(matchInfo.get(matchID)!=null){
								if(!matchInfo.get(matchID).contains(result)){
									matchInfo.get(matchID).add(result);
								}
							}else{
								select.add(result);
								matchInfo.put(matchID,select);
							}
							String key = ps[0].trim() + "=" + ss.trim();
							String pos = m.getPosition(key);
							if(pos != null){
								val |= 1L << Integer.parseInt(pos);
							}
						}
					}
					match.put(matchID, val);
				}
				dsb.append(vs).append("=").append(item_parts[1]).append(",");
			}
		}
		String s = dsb.toString();
		if(s.endsWith(",")){
			s = s.substring(0, s.length() - 1);
		}
		return s;
	}
	
}
