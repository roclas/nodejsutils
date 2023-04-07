#!/usr/local/bin/node

const puppeteer = require('puppeteer');

const user=`${process.argv[2]}`;
const password=`${process.argv[3]}`;

async function run () {

	//const browser = await puppeteer.launch();
	const browser = await puppeteer.launch({headless:false,defaultViewport: null, devtools:true, args: ['--start-maximized'], userDataDir: './cache' });
	const page = await browser.newPage();
	page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');
	let url0="http://localhost:8080/c/portal/login";
	let url1="http://localhost:8080/group/guest/~/control_panel/manage?p_p_id=com_liferay_portal_search_admin_web_portlet_SearchAdminPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_portal_search_admin_web_portlet_SearchAdminPortlet_tabs1=index-actions";
	
	/*
	let authHeader=false;
	page.on('request',r=>{ 
		if(authHeader)return;
		if(!r.url().match(/localhost:8080/))return;
		authHeader=r.headers().authorization;
	});
	*/
	
	await page.goto(url0);
	try{
		await page.setDefaultTimeout(10000);
		await page.waitForSelector('input[type=text]');
		await page.type('input[type=text]', user);
  		await page.type('input[type=password]', password);
		await Promise.all([
  			page.waitForNavigation(),
			page.click('button[type=submit]')
		]);
	}catch(err){
		console.error("login failed, probably already logged in?!!");
		console.log(err);
	}

	await page.goto(url1);
	try{
		await page.setDefaultTimeout(10000);
		await page.$eval('button[data-cmd=reindex]', el => el.click());
		console.log("reindexing...");
	}catch(err){
		console.log(err);
	}

	//process.exit(0);

}

run();
