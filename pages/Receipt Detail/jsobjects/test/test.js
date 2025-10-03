export default {
	report:()=>{
			removeValue("INIT");
			return Boolean(appsmith.store.INIT && appsmith.store.INIT[Configs.IDParameterName])
		//return typeof ['test']
	},
}