package com.caipiao.plugin.lqutil;

import com.caipiao.plugin.helper.CodeFormatException;
import com.caipiao.plugin.helper.CombineUtil;
import com.caipiao.plugin.helper.GameConvertPlugin;
import com.caipiao.plugin.helper.GamePluginAdapter;
import com.caipiao.plugin.helper.PluginUtil;
import com.caipiao.plugin.sturct.GameAwardCode;
import com.caipiao.plugin.sturct.GameCastCode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

public abstract class GamePlugin_lq extends GamePluginAdapter
  implements GameConvertPlugin
{
  static void P1(List<LqItemBean[]> list, LqItemBean[] arr, List<LqItemBean> lst, List<List<LqItemBean>> lstOut)
  {
    if (lst == null) {
      lst = new ArrayList();
    }
    for (int i = 0; i < list.size(); ++i)
      if (i == list.indexOf(arr))
        for (LqItemBean st : arr)
        {
          List lst1;
          int j;
          if (i < list.size() - 1) {
            lst1 = new ArrayList();
            for (j = 0; j < lst.size(); ++j) {
              lst1.add((LqItemBean)lst.get(j));
            }
            lst1.add(st);
            P1(list, (LqItemBean[])list.get(i + 1), lst1, lstOut);
          } else if (i == list.size() - 1) {
            lst1 = new ArrayList();
            for (j = 0; j < lst.size(); ++j) {
              lst1.add((LqItemBean)lst.get(j));
            }
            lst1.add(st);
            lstOut.add(lst1);
          } else {
            lst.add(st);
          }
        }
  }

  public abstract void checkPassType(String paramString)
    throws CodeFormatException;

  public abstract byte getIntPlayType(String paramString)
    throws CodeFormatException;

  public String toPrintCode(GameCastCode gcc)
  {
    StringBuffer sb = new StringBuffer();
    List list = gcc.getCast();
    for (int i = 0; i < list.size(); ++i) {
      LqCastCode cast = (LqCastCode)list.get(i);
      sb.append(cast.toBillCode());
      sb.append(";");
    }
    String code = sb.toString();
    if (code.endsWith(";")) {
      code = code.substring(0, code.lastIndexOf(";"));
    }
    return code;
  }

  public GameAwardCode buildAwardCode(String awardCode) throws CodeFormatException
  {
    return null;
  }

  public int getRealGrade(int awardgrade)
  {
    return 0;
  }

  public GameCastCode parseGameCastCode(String code)
    throws CodeFormatException
  {
    int money = 0;
    GameCastCode gcc = new GameCastCode();
    String matches = ",";
    List items = new ArrayList();

    String[] parts = PluginUtil.splitter(code, "|");

    byte cm = 1;
    byte pm = getIntPlayType(parts[0]);
    boolean mix = false;

    String sep = "=";
    if (pm == 71) {
      if ((parts.length != 3) && (parts.length != 4)) {
        throw new CodeFormatException(5, "格式不符合要求  必须是(HH|号码|过关方式 或 HH|号码|过关方式|1)", code);
      }
      if ((parts.length == 4) && 
        ("1".equals(parts[3]))) {
        mix = true;
      }

      sep = ">";
    }
    else if (parts.length != 3) {
      throw new CodeFormatException(5, "格式不符合要求  必须是(玩法|号码|过关方式)", code);
    }

    String jcode = parts[1];
    String guogu = parts[2];
    if (jcode.indexOf("$") >= 0) {
      String[] cs = PluginUtil.splitter(jcode, "$");
      if (cs.length != 2) {
        throw new CodeFormatException(3, "胆拖号码格式错误", code);
      }
      String[] dans = PluginUtil.splitter(cs[0], ",");
      String[] tuos = PluginUtil.splitter(cs[1], ",");

      String[] passes = PluginUtil.splitter(guogu, ",");
      gcc.setGuoguans(guogu);

      int danlen = dans.length;
      int tuolen = tuos.length;

      List dList = new ArrayList();
      for (int i = 0; i < dans.length; ++i) {
        String[] ccs = PluginUtil.splitter(dans[i], sep);
        if (ccs.length != 2) {
          throw new CodeFormatException(3, "号码格式错误 必须是(场次=选号)", code);
        }
        LqItemBean ib = new LqItemBean();
        ib.setItemid(ccs[0].trim());
        ib.setCode(ccs[1].trim(), pm);

        if (matches.indexOf("," + ccs[0] + ",") >= 0) {
          throw new CodeFormatException(3, "胆码中所选择的场次有重复", code);
        }
        matches = matches + ccs[0] + ",";

        dList.add(ib);
      }
      List tList = new ArrayList();
      for (int i = 0; i < tuos.length; ++i) {
        String[] ccs = PluginUtil.splitter(tuos[i], sep);
        if (ccs.length != 2) {
          throw new CodeFormatException(3, "号码错误 (场次=选号)", code);
        }
        LqItemBean ib = new LqItemBean();

        ib.setItemid(ccs[0].trim());
        ib.setCode(ccs[1].trim(), pm);

        if (matches.indexOf("," + ccs[0] + ",") >= 0) {
          throw new CodeFormatException(3, "拖码中所选择的场次有重复", code);
        }
        matches = matches + ccs[0] + ",";

        tList.add(ib);
      }
      items.addAll(dList);
      items.addAll(tList);

      for (int y = 0; y < passes.length; ++y) {
        String passType = passes[y];

        int endPass = LqPassTypeUtil.getEndPassType(passType);
        int maxPass = LqPassTypeUtil.getMaxPassType(pm);

        checkPassType(passType);

        int max = LqPassTypeUtil.getMaxPassType(passType);
        if (max <= 0) {
          throw new CodeFormatException(2, "选择的过关方式不正确 ", code);
        }

        if ((danlen < 1) || (danlen > max)) {
          throw new CodeFormatException(3, "胆码和拖码与选择的过关方式不符", code);
        }
        if (danlen + tuolen < max) {
          throw new CodeFormatException(3, "胆码和拖码与选择的过关方式不符", code);
        }

        List listCombine = CombineUtil.combine(tuos.length, max - dans.length);
        if (listCombine == null) {
          throw new CodeFormatException(2, "选择的过关方式不正确 ", code);
        }

        for (int i = 0; i < listCombine.size(); ++i) {
          int[] tmp = (int[])listCombine.get(i);

          List list = new ArrayList();
          LqItemBean[] first = null;
          LqItemBean[] jcTmp;
          for (int j = 0; j < dList.size(); ++j) {
            jcTmp = ((LqItemBean)dList.get(j)).getSubJcItem();
            if (first == null) {
              first = jcTmp;
            }
            list.add(jcTmp);
          }

          for (int j = 0; j < tmp.length; ++j) {
            if (tmp[j] > 0) {
              jcTmp = ((LqItemBean)tList.get(j)).getSubJcItem();
              if (first == null) {
                first = jcTmp;
              }
              list.add(jcTmp);
            }
          }

          List lstOut = new ArrayList();
          P1(list, first, null, lstOut);
          for (int j = 0; j < lstOut.size(); ++j) {
            List lst = (List)lstOut.get(j);
            if ((!(mix)) || (isMix(lst))) {
              LqCastCode cc = new LqCastCode();
              cc.setPlaytype(pm);
              cc.setPassType(passType);
              for (int k = 0; k < lst.size(); ++k) {
                cc.addItemBean((LqItemBean)lst.get(k));
                if (pm == 71) {
                  maxPass = Math.min(maxPass, LqPassTypeUtil.getMaxPassType(((LqItemBean)lst.get(k)).getPlayType()));
                }
              }
              money += cc.getBettingnum();
              gcc.putCast(cc);
            }
          }
        }
        if ((pm != 71) || 
          (endPass <= maxPass)) continue;
        throw new CodeFormatException(5, " 过关方式不正确 必须是(2到" + maxPass + "串之间)", passType);
      }
    }
    else
    {
      String[] codes = PluginUtil.splitter(jcode, ",");
      String[] passes = PluginUtil.splitter(guogu, ",");
      gcc.setGuoguans(guogu);

      List itlist = new ArrayList();
      for (int i = 0; i < codes.length; ++i) {
        String[] ccs = PluginUtil.splitter(codes[i], sep);
        if (ccs.length != 2) {
          throw new CodeFormatException(2, "号码格式错误 (场次=选号)", code);
        }

        LqItemBean ib = new LqItemBean();
        ib.setItemid(ccs[0].trim());
        ib.setCode(ccs[1].trim(), pm);

        if (matches.indexOf("," + ccs[0] + ",") >= 0) {
          throw new CodeFormatException(2, "比赛场次重复", code);
        }
        matches = matches + ccs[0] + ",";

        itlist.add(ib);
      }
      items.addAll(itlist);

      for (int y = 0; y < passes.length; ++y) {
        String passType = passes[y];
        checkPassType(passType);

        int endPass = LqPassTypeUtil.getEndPassType(passType);
        int maxPass = LqPassTypeUtil.getMaxPassType(pm);

        int max = LqPassTypeUtil.getMaxPassType(passType);
        if (max <= 0) {
          throw new CodeFormatException(2, "选择的过关方式不正确 ", code);
        }
        List cList = CombineUtil.combine(codes.length, max);
        if ((cList == null) || (cList.size() == 0)) {
          throw new CodeFormatException(2, "选择的过关方式不正确 ", code);
        }
        for (int i = 0; i < cList.size(); ++i) {
          int[] tmp = (int[])cList.get(i);

          List list = new ArrayList();
          LqItemBean[] first = null;
          for (int j = 0; j < tmp.length; ++j) {
            if (tmp[j] > 0) {
              LqItemBean[] jcTmp = ((LqItemBean)itlist.get(j)).getSubJcItem();
              if (first == null) {
                first = jcTmp;
              }
              list.add(jcTmp);
            }
          }

          List lstOut = new ArrayList();
          P1(list, first, null, lstOut);
          for (int j = 0; j < lstOut.size(); ++j) {
            List lst = (List)lstOut.get(j);
            if ((!(mix)) || (isMix(lst))) {
              LqCastCode cc = new LqCastCode();
              cc.setPlaytype(pm);
              cc.setPassType(passType);
              for (int k = 0; k < lst.size(); ++k) {
                cc.addItemBean((LqItemBean)lst.get(k));
                if (pm == 71) {
                  maxPass = Math.min(maxPass, LqPassTypeUtil.getMaxPassType(((LqItemBean)lst.get(k)).getPlayType()));
                }
              }
              money += cc.getBettingnum();
              gcc.putCast(cc);
            }
          }

        }

        if ((pm != 71) || 
          (endPass <= maxPass)) continue;
        throw new CodeFormatException(5, " 过关方式不正确 必须是(2到" + maxPass + "串之间)", passType);
      }

      itlist.clear();
    }

    if (money == 0) {
      throw new CodeFormatException(1, "注数不能为零", code);
    }

    gcc.setSourceCode(code);
    gcc.setCastMethod(cm);
    gcc.setPlayMethod(pm);
    gcc.setCastMoney(2 * money);
    gcc.setCombineNum(gcc.getCast().size());
    gcc.setMatchID(matches);
    gcc.putItems(items);

    return gcc;
  }

  private final boolean isMix(List<LqItemBean> lst) {
    boolean bln = false;
    int play = -1;
    for (int i = 0; i < lst.size(); ++i)
    {
      if (play == -1) {
        play = ((LqItemBean)lst.get(i)).getPlayType();
      }
      else if (play != ((LqItemBean)lst.get(i)).getPlayType()) {
        bln = true;
        break;
      }
    }

    return bln;
  }

  public String convert(GameCastCode gcc) {
    String convert = "";
    if ((gcc.getPlayMethod() == 94) || 
      (gcc.getPlayMethod() == 96) || 
      (gcc.getPlayMethod() == 95) || 
      (gcc.getPlayMethod() == 97)) {
      convert = gcc.getSourceCode() + "|" + gcc.getCastMoney();
    } else if (gcc.getPlayMethod() == 71) {
      StringBuffer sb = new StringBuffer();
      List clist = gcc.getCast();
      for (Iterator localIterator1 = clist.iterator(); localIterator1.hasNext(); ) { Object obj = localIterator1.next();
        LqCastCode lcc = (LqCastCode)obj;
        List<LqItemBean> list = lcc.getLqItemList();
        long lp = 0L;
        int play = -1;
        for (LqItemBean item : list) {
          play = item.getPlayType();
          lp |= 1L << item.getPlayType() - 70;
        }

        int i;
        LqItemBean item;
        if (Long.bitCount(lp) == 1) {
          sb.append(LqItemCodeUtil.getPlayType(play));
          sb.append("|");
          for (i = 0; i < list.size(); ++i) {
            item = (LqItemBean)list.get(i);
            sb.append(item.getItemid()).append("=").append(item.getSourceCode());
            if (i != list.size() - 1) {
              sb.append(",");
            }
          }
          sb.append("|");
          sb.append(lcc.getPassType());
          sb.append("|");
          sb.append(lcc.getBettingnum() * 2);
          sb.append(";");
        } else {
          sb.append(LqItemCodeUtil.getPlayType(gcc.getPlayMethod()));
          sb.append("|");
          for (i = 0; i < list.size(); ++i) {
            item = (LqItemBean)list.get(i);
            sb.append(LqItemCodeUtil.getPlayType(item.getPlayType())).append(">").append(item.getItemid()).append("=").append(item.getSourceCode());
            if (i != list.size() - 1) {
              sb.append(",");
            }
          }
          sb.append("|");
          sb.append(lcc.getPassType());
          sb.append("|");
          sb.append(lcc.getBettingnum() * 2);
          sb.append(";");
        }
      }
      String code = sb.toString();
      if (code.endsWith(";")) {
        code = code.substring(0, code.lastIndexOf(";"));
      }
      convert = code;
    }

    return convert;
  }

  public HashMap<String, String> keyBoardParser(String codes, int muli)
    throws Exception
  {
    return null;
  }

  public int[] bingoMatcher(GameCastCode code, GameAwardCode bingoCode, int gradeNum)
  {
    return null;
  }
}