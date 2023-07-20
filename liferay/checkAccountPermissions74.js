#!/usr/local/bin/node

const puppeteer = require('puppeteer');
const fs = require('fs');


const user=`${process.argv[2]}`;
const password=`${process.argv[3]}`;
console.log(`user=${user} and password=${password}`);
const baseUrl=`${process.argv[4]?process.argv[4]:"http://localhost:8080"}`;

let sleep = time => new Promise(res => setTimeout(res, time, "done sleeping"));
async function run () {

	//const browser = await puppeteer.launch();
	const browser = await puppeteer.launch({headless:false,defaultViewport: null, devtools:false, args: ['--start-maximized'], userDataDir: './cache',ignoreHTTPSErrors: true });
	const page = await browser.newPage();
	page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36');
	let url0=`${baseUrl}/c/portal/login`;
	url0=`${baseUrl}/admin`;
	let url1=`${baseUrl}/group/control_panel/manage?p_p_id=com_liferay_roles_admin_web_portlet_RolesAdminPortlet&_com_liferay_roles_admin_web_portlet_RolesAdminPortlet_roleType=6`;
	
	await page.goto(url0);
	try{
		await page.setDefaultTimeout(30000);
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

	await page.goto(url1);
	try{
		await page.waitForSelector('div.list-group-title>a');
		let permissionURLs=await page.evaluate( ()=> Array.from(document.querySelectorAll("div.list-group-title>a")).map(x=>x.href) );
		//console.log(permissions);
		permissionURLs.forEach((url,i)=>{
			setTimeout(async ()=>{
				let p= await browser.newPage();
				let url2= new URL(url);
				url2.searchParams.set("_com_liferay_roles_admin_web_portlet_RolesAdminPortlet_tabs1","define-permissions");
				await p.goto(url2.toString());
				let tabs=["define permissions","group scope permissions"];
				for(tab in tabs){try{
				  await p.waitForSelector("li[data-nav-item-index] a");
				  await p.evaluate( t=>{
					let tabRegex=RegExp(`${t}`,"i");
					let l=Array.from(document.querySelectorAll("li[data-nav-item-index] a")).filter(x=>x.innerText.match(tabRegex)).find(x=>true);
					l.href+="&_com_liferay_roles_admin_web_portlet_RolesAdminPortlet_delta=300"; //SMALL HACK, the UI doesn't allow this by default
					//let currentURL=window.location.href;
					l.click();
				  },tabs[tab]);
				  await p.waitForSelector("td > a.permission-navigation-link");
				  await sleep(15000); // just to make sure after the click
				  let permissions=await p.evaluate( ()=>
					Array.from(document.querySelectorAll("td > a.permission-navigation-link")).map(x=>x.parentElement.textContent.trim()).sort().join("\n")
				  );
				  let roleName=await p.evaluate( ()=>document.querySelector("h1").innerText.trim().replaceAll(" ","_"));
				  let permissionsFile=`${baseUrl.replace(/^.*:../,"").replace(/[^a-z]/g,"")}_${roleName}_${tabs[tab].trim().replaceAll(" ","")}`;
				  fs.writeFileSync(`/tmp/${permissionsFile}`, permissions);
				}catch(ex){console.error(`problem with ${tabs[tab]} => ${url2}`)} }
			},i*6000);
		});
	}catch(err){
		console.log(err);
	}

	setTimeout(() => process.exit(0),300000);//close everything after N seconds

}

run();
