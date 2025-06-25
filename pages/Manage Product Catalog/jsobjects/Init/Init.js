export default {
	dataDisplayStartTime:moment("2021-01-01","YYYY-MM-DD"), //moment.tz("Asia/Bangkok").format("yyyy-mm-dd"),
	pageLoad:async ()=>{
		console.log("init");
		Configs.startBody = "LOADING"
		Configs.forceKick=false;
		Configs.forceLogin=false;
		closeModal(Modal_Session_detail.name);
		closeModal(Modal_ErrorAlert.name);
		if(!await GlobalFunctions.sessionCheck())return navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.VIEW,true))return;

		await SP_SELECTPRODUCTCATALOG.run();
		if(SP_SELECTPRODUCTCATALOG.data&&SP_SELECTPRODUCTCATALOG.data.length>0){
			console.log("edit");
			let InitializationEntityList = [{ENTITY:Default_ProductCatalog,DATA: SP_SELECTPRODUCTCATALOG.data[0]}];
			await GlobalFunctions.initDefault(InitializationEntityList);
			await _3_SELECT_IMAGE.run();
			if( _3_SELECT_IMAGE.data){
				_3_SELECT_IMAGE.data.map(({PICTURE_CATALOG_FILE})=>{
					Default_ProductCatalog.IMAGE.data = PICTURE_CATALOG_FILE
				})
			}
			VerifyButton1.onClick();
			VerifyButton2.onClick();
			//resetWidget("Form1",true);
			Configs.startBody="VIEW"
		}else{
			console.log("new");
			let InitializationEntityList = [{ENTITY:Default_ProductCatalog,DATA: {}}];
			await GlobalFunctions.initDefault(InitializationEntityList);
			Configs.startBody="VIEW"
		}
		resetWidget(BODY.widgetName);
	}
}