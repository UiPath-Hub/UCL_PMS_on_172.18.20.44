export default {
	returnn:async ()=>{
		console.log("time");
		await storeValue(Init.SINGLE_PAGE,{...appsmith.store[Init.SINGLE_PAGE],"forceLogin":true},false);
		return appsmith.store[Init.SINGLE_PAGE]?.recentPage && _.last(appsmith.store[Init.SINGLE_PAGE]?.recentPage)===Configs.pageName&&
			 appsmith.store[Init.SINGLE_PAGE]?.forceLogin===true
	},
	checkMissingLabel:()=>{
		return Object.keys(Widgets_Ref.PMS_PROSPECTS_LM).filter((key)=>!Widgets_Ref.PMS_PROSPECTS_LM[key].widget.label);
	}
}