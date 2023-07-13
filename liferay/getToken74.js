#!/usr/local/bin/node

const puppeteer = require('puppeteer');

const user=`${process.argv[2]}`;
const password=`${process.argv[3]}`;
//console.log(`user=${user} and password=${password}`);
const baseUrl=`${process.argv[4]?process.argv[4]:"http://localhost:8080"}`;

async function run () {

	//const browser = await puppeteer.launch();
	const browser = await puppeteer.launch({headless:true,defaultViewport: null, devtools:false, args: ['--start-maximized'], userDataDir: './cache',ignoreHTTPSErrors: true });
	const page = await browser.newPage();
	page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');
	let url0=`${baseUrl}/c/portal/login`;
	let url1=`${baseUrl}/group/guest/~/control_panel/manage?p_p_id=com_liferay_portal_search_admin_web_portlet_SearchAdminPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_portal_search_admin_web_portlet_SearchAdminPortlet_tabs1=index-actions`;
	
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
		await page.waitForSelector('input[type=text][name$=login]');
		await page.evaluate( (u) => document.querySelector('input[type=text][name$=login]').value = u, user)
  		await page.type('input[type=password]', password);
		await page.waitForSelector('button[type=submit]');
		await Promise.all([
  			page.waitForNavigation(),
			page.click('button[type=submit]')
		]);
	}catch(err){
		console.error("login failed, probably already logged in?!!");
		console.log(err);
	}

	let cookies = await page.cookies();
	let jsessionid=cookies.filter(x=>x.name.match(/JSESSIONID/i)).find(x=>true).value;
	let token= await page.evaluate(() => Liferay.authToken );
	console.log(token,jsessionid);

	setTimeout(() => process.exit(0),2000);//close everything after a few ms


}

run();
