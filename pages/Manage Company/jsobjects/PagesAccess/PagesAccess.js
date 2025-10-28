export default {
	Init:()=>{
		//pages access history
		const PAGES_QUEUE = "PAGES_QUEUE"
		let QUEUE = appsmith.store[PAGES_QUEUE]??[];
		if(QUEUE.at(-1)!== appsmith.currentPageName)
			QUEUE.push(appsmith.currentPageName);
		if(QUEUE.length>2)
			QUEUE.shift();
		storeValue(PAGES_QUEUE,QUEUE,true);
	}
}