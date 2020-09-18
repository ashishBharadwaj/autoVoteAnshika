const chromeLauncher = require("chrome-launcher");
const CDP = require("chrome-remote-interface");

function launchChrome(headless = true) {
    return chromeLauncher.launch({
        // port: 9222, // Uncomment to force a specific port of your choice.
        chromeFlags: [headless ? "--headless" : ""]
    });
}

init(`http://mycutebaby.in/contest/participant/?n=5f60434bef20c&utm_source=wsapp_share_status&utm_campaign=September_2020&utm_medium=shared&utm_term=wsapp_shared_5f60434bef20c&utm_content=participant`);

async function init(url){

    const chrome = await launchChrome(false);
    while(true){
        await navigate(chrome, url);        
        await sleep(1800000);
    }
    
}

async function navigate(chrome, url) {
    try {
      const protocol = await CDP({ port: chrome.port});
  
      // Extract the DevTools protocol domains we need and enable them.
      // See API docs: https://chromedevtools.github.io/devtools-protocol/
      const { Page, Runtime } = protocol;
      await Promise.all([Page.enable(), Runtime.enable()]);
  
      await Page.navigate({ url: url });
  
      // Wait for window.onload before doing stuff.
      await Page.loadEventFired();    
      const query = `document.getElementById('vote_btn').click();`;
          // Evaluate the JS expression in the page.
      const result = await Runtime.evaluate({ expression: query });
      console.log(result);
      protocol.close();
    } catch (error) {
      console.log(error);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}   
