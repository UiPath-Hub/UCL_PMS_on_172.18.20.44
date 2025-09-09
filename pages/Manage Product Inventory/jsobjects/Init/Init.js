export default {
	PageLoad:async ()=>{
		Configs.forceKick=false;
		Configs.forceLogin=false;
		Configs.startBody = "LOADING"
		closeModal(Modal_Session_detail.name);
		closeModal(Modal_ErrorAlert.name);
		if(!await GlobalFunctions.sessionCheck())return navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await GlobalFunctions.permissionsCheck(Configs.permissions.VIEW,true))return;
		
		if(appsmith.store[Configs.EditInventory]!==undefined){
			console.log("Edit");
			//load product catalog
			await SP_SELECTPRODUCTCATALOG.run(appsmith.store[Configs.EditInventory]);
			if(SP_SELECTPRODUCTCATALOG.data && SP_SELECTPRODUCTCATALOG.data.length>0){
				let InitializationEntityList = [{ENTITY:SelectedProduct,DATA: SP_SELECTPRODUCTCATALOG.data[0]}];
				await GlobalFunctions.initDefault(InitializationEntityList);
				resetWidget(Modal_SelectProduct.name,true);
				//storeValue("defaultProductCatalog",SP_SELECTPRODUCTCATALOG.data[0]);
				JS.setPageType(SP_SELECTPRODUCTCATALOG.data[0].PRODUCT_TYPE_TH+SP_SELECTPRODUCTCATALOG.data[0].PRODUCT_TYPE_EN);
			}
			//load Inventory
			await SP_SELECTPRODUCTINVENTORY.run();
			if(SP_SELECTPRODUCTINVENTORY.data && SP_SELECTPRODUCTINVENTORY.data.length>0){
				let InitializationEntityList = [{ENTITY:DefaultInventory,DATA: SP_SELECTPRODUCTINVENTORY.data[0]}];
				await GlobalFunctions.initDefault(InitializationEntityList);
				VerifyButton1.onClick();
				await _5_SELECT_IMAGE.run();
				if(_5_SELECT_IMAGE.data && _5_SELECT_IMAGE.data.length>0){
					DefaultInventory.IMAGE.data = _5_SELECT_IMAGE.data[0].PICTURE_INVENTORY_FILE
				}
				JS.onClick_SelectParentMeter(DefaultInventory.SUB_INVENTORY.data);
				Configs.startBody="VIEW"
			}

		}else{
			console.log("new");
			let InitializationEntityList = [{ENTITY:DefaultInventory,DATA: {}}];
			await GlobalFunctions.initDefault(InitializationEntityList);
			Configs.startBody="VIEW"
			removeValue(Configs.PageType);
		}
		resetWidget(BODY.widgetName,true);
	}
}