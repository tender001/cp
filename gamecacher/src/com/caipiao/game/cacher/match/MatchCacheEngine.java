package com.caipiao.game.cacher.match;

import java.io.File;
import java.util.Arrays;
import java.util.HashMap;

import com.mina.rbc.thread.RbcAbstractThread;
import com.mina.rbc.util.CheckUtil;
import com.mina.rbc.util.xml.JXmlWapper;

public class MatchCacheEngine extends RbcAbstractThread {

	private String jcpath ;
	private String bdpath ;
	private String lqpath;
	private String mcpath;
	
	private MatchCacheManager mcm = MatchCacheManager.getMatchCacheManager();
	private HashMap<String,Long> maps = new HashMap<String,Long>();
	
	
	private final static String[] bdgames = {"85","86","87","88","89","84"};
	private final static String[] bddescs = {"spf","cbf","bqc","sxp","jqs","sfgg"};
	
	private final static String[] lqgames = {"lq"};
	private final static String[] lqdescs = {"hh"};
	
	private final static String[] jcgames = {"jc"};
	private final static String[] jcdescs = {"hh"};
	
	private final static String[] mcgames = {"gj","gyj"};
	private final static String[] mcdescs = {"gj","gyj"};
	
	
	@Override
	public void thread_init(JXmlWapper elmConfig) {
		jcpath = elmConfig.getStringValue("@jcpath","") ;
		lqpath = elmConfig.getStringValue("@lqpath","") ;
		bdpath = elmConfig.getStringValue("@bdpath","") ;
		mcpath = elmConfig.getStringValue("@mcpath","");
	}

	
	@Override
	public void thread_func() {
		try {
			String fileName = "";
			if ( !CheckUtil.isNullString(jcpath)) {
				for (int j=0;j<jcgames.length;j++) {
					fileName = jcpath + File.separator + "jczq_" + jcdescs[j] + ".xml";
					if ( haveChange(fileName)) {
						cacheFileContext(jcgames[j],fileName);
					}
				}				
			}
			
			if ( !CheckUtil.isNullString(lqpath)) {
				for (int j=0;j<lqgames.length;j++) { 
					fileName = lqpath + File.separator + "jclq_" + lqdescs[j] + ".xml";
					if ( haveChange(fileName)) {
						cacheFileContext(lqgames[j],fileName);
					}
				}
				
			}

			if ( !CheckUtil.isNullString(bdpath)) {
				File bdir = new File(bdpath);
				if ( bdir.exists() ) {
					String[] ss = bdir.list();
					Arrays.sort(ss);
					
					int st = ss.length - 20 > 0 ? ss.length - 20:0;
					for (int i=0;i<st;i++) {
						for (int j=0;j<bdgames.length;j++) {
							mcm.removeCache(ss[i] + "_" + bdgames[j]);
						}
					}

					for (int i=st;i<ss.length;i++) {
						for (int j=0;j<bdgames.length;j++) {
							fileName = bdpath + File.separator + ss[i] + File.separator + bddescs[j] +  ".xml";
							if ( haveChange(fileName)) {
								cacheFileContext(ss[i] + "_" + bdgames[j],fileName);
							}
						}
					}
				}
			}
			
			if ( !CheckUtil.isNullString(mcpath)) {
				for (int j=0;j<mcgames.length;j++) {
					fileName = mcpath + File.separator + mcdescs[j] + ".xml";
					if ( haveChange(fileName)) {
						cacheFileContext(mcgames[j],fileName);
					}
				}				
			}
			
		} catch (Exception e) {
			
		}
	}

	private boolean haveChange(String fileName) {
		boolean bln = false ;
		
		File file = new File(fileName);
		if ( file.exists() ) {
			Long lold = maps.get(fileName);
			if ( lold == null || lold.longValue() != file.lastModified() ) {
				maps.put(fileName, file.lastModified());
				bln = true ;
			}
		}
		return bln ;
	}
	
	private void cacheFileContext(String key,String fileName) {
		try {
			JXmlWapper xml = JXmlWapper.parse(new File(fileName));
			mcm.putCache(key, xml);
		} catch (Exception e) {
			maps.clear();
		}
	}

}
