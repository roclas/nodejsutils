#!/usr/local/bin/node

const puppeteer = require('puppeteer');
const fs = require('fs');

const user=`${process.argv[2]}`;
const password=`${process.argv[3]}`;
//console.log(`user=${user} and password=${password}`);
const filePath=process.argv[4];
const baseUrl=`${process.argv[5]?process.argv[5]:"http://localhost:8080"}`;
let groovyScript="Please use the path of your groovy script file as the third parameter";
if(filePath) try{groovyScript=fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })}catch(e){console.error(`Could not read script in path ${filePath}`);}; 
//console.log(groovyScript);

async function run () {

	//const browser = await puppeteer.launch();
	//const browser = await puppeteer.launch({headless:false,defaultViewport: null, devtools:false, args: ['--start-maximized'], userDataDir: './cache',ignoreHTTPSErrors: true });
	const browser = await puppeteer.launch({headless:false,defaultViewport: null, devtools:false, args: ['--start-maximized'], ignoreHTTPSErrors: true });
	const page = await browser.newPage();
	page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');
	//let url0=`${baseUrl}/c/portal/login`;
	let url0=`${baseUrl}/admin`;
	let url1=`${baseUrl}/group/guest/~/control_panel/manage?p_p_id=com_liferay_server_admin_web_portlet_ServerAdminPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_server_admin_web_portlet_ServerAdminPortlet_mvcRenderCommandName=%2Fserver_admin%2Fview&_com_liferay_server_admin_web_portlet_ServerAdminPortlet_tabs1=script`;
	
	await page.goto(url0);
	try{
		await page.setDefaultTimeout(600000); //10 minutes
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
		await page.waitForSelector('textarea');
		await page.waitForSelector('.save-server-button');
		await page.$eval('textarea', (el,value) => el.value = value, groovyScript);
		await page.focus('.save-server-button');
		setTimeout(() => page.keyboard.type('\n'),5000);
		await page.waitForSelector('pre');
		const result= await page.$eval('pre', element => element.innerHTML);
		console.log(result);
		process.exit(0);//ALL GOOD!!!
	}catch(err){
		console.log(err);
	}

	setTimeout(() => process.exit(0),600000);//close everything after 10 minutes (if nothing happened before)

}

run();
