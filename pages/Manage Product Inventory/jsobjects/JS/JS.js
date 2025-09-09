export default {
	onClick_Bttn_ClearSubMeter:()=>{
		DefaultInventory.SUB_INVENTORY.data = "";
		SUB_INVENT_DETAIL.setValue("")
	},
	onClick_BUTTON_ADD_SUB_METER:async()=>{
		await resetWidget(TABLE_SearchForParentMeter.widgetName);
		await Master_List_METER_TYPE.setSelectedOption(SelectedProduct.PRODUCT_TYPE.data);
		_1_SP_SEARCH_FOR_PARENT_METER.run();
		showModal(MODAL_SELECT_SUB_METER.name);
	},
	onClick_Bttn_ClearImage:()=>{
		DefaultInventory.IMAGE.data = "";
		resetWidget(FP_INVENTORY_PICTURE.widgetName);
		resetWidget(PV_INVENTORY_PICTURE.widgetName);
	},
	onClick_Cancel:async ()=>{
		await removeValue(Configs.EditInventory);
		navigateTo('Product Inventory Dashboard', {}, 'SAME_WINDOW');

	},
	onClick_SelectParentMeter:async(INVENTORY_ID)=>{
		if(!_1_SP_SEARCH_FOR_PARENT_METER.data)
			await _1_SP_SEARCH_FOR_PARENT_METER.run();
		console.log(INVENTORY_ID)
		DefaultInventory.SUB_INVENTORY.data = INVENTORY_ID;
		let detail =_1_SP_SEARCH_FOR_PARENT_METER.data.filter((row)=>row.INVENTORY_ID===INVENTORY_ID);
		if(detail.length>0)
			//SUB_INVENT_DETAIL.setValue(detail[0]?.INVENTORY_NAME);
			DefaultInventory.SUB_INVENT_DETAIL.data = detail[0]?.INVENTORY_NAME;
		else
			SUB_INVENT_DETAIL.setValue("");
	},
	onClick_SearchParentMeter:async()=>{
		await resetWidget(TABLE_SearchForParentMeter.widgetName);
		_1_SP_SEARCH_FOR_PARENT_METER.run();
	},
	setPageType:(PRODUCT_TYPE)=>{
		PRODUCT_TYPE = PRODUCT_TYPE!==undefined?PRODUCT_TYPE:Table_Catalog_Results.selectedRow.PRODUCT_TYPE;
		let identifyText = PRODUCT_TYPE;
		if(identifyText !== undefined && identifyText !== ""){
			if(_.lowerCase(identifyText).includes("space")) storeValue(Configs.PageType, PageTypes.Space);
			if(_.lowerCase(identifyText).includes("meter")) storeValue(Configs.PageType, PageTypes.Meter);

		}
	},
	selectedProductButtonClick:async ()=>{
		if(Table_Catalog_Results.selectedRow!=undefined && _.trim(Table_Catalog_Results.selectedRow.PRODUCT_ID)!="" && Table_Catalog_Results.selectedRow.PRODUCT_ID != undefined){
			await SP_SELECTPRODUCTCATALOG.run();
			if(SP_SELECTPRODUCTCATALOG.data && SP_SELECTPRODUCTCATALOG.data.length>0){
				await GlobalFunctions.setAttributes(SelectedProduct,SP_SELECTPRODUCTCATALOG.data[0],"data");
				await GlobalFunctions.setAttributes(DefaultInventory,{FLOOR_NO: SP_SELECTPRODUCTCATALOG.data[0].FLOOR_NO},"data");
				this.setPageType();
				await closeModal(Modal_SelectProduct.name);
			}
			resetWidget(SHARED.widgetName,true);
			return;			
		}
	},
	isValid_PICTURE:async()=>{
		if(FP_INVENTORY_PICTURE.isValid){
			return true;
		}else{
			showAlert("Invalid image file.","info")
			return false;
		}
	},
	onSaveClick:async()=>{
		if(GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			let alertWidget = await GlobalFunctions.manualValidateV2(DefaultInventory,ProductInventoryWidget);
			console.log(alertWidget)
			let isImageValid = await this.isValid_PICTURE();
			if(alertWidget.length > 0 || !isImageValid){
				showAlert(`Some field is required or invalid.`)
			}else{
				showModal(Modal_SAVE.name);
			}
		}
	},
	onSaveConfirmClick:async()=>{
		if(GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			await this.confirmButtonClick();
		}
	},	
	onAddNextClick:async ()=>{
		//await Init.PageLoad();
		navigateTo(appsmith.URL.fullPath,{}, 'SAME_WINDOW');
		closeModal(Modal_ADD_NEXT.name);
	},
	onNotAddNextClick:async ()=>{
		await closeModal(Modal_ADD_NEXT.name);
		await	removeValue(Configs.EditInventory);
		navigateTo('Product Inventory Dashboard', {}, 'SAME_WINDOW');

	},
	onDeleteClick:async ()=>{
		if(GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			showModal(Modal_ConfirmDelete.name);
		}
	},
	onConfirmDeleteClick:async ()=>{
		if(GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false)){
			this.deleteButtonClick();
		}
	},
	onClick_BUTTON_SEARCH:async()=>{
		await resetWidget(Table_Catalog_Results.widgetName)
		SP_SER_SEARCH_FOR_PR_CATALOG.run();
	},
	onSearchProductClick:async ()=>{
		this.onClick_BUTTON_SEARCH();
		showModal(Modal_SelectProduct.name);
	},

	confirmButtonClick:async()=>{
		if(appsmith.store[Configs.EditInventory]===undefined){
			//add
			if(FP_INVENTORY_PICTURE.files.length>0)
				await _2_SP_INSERT_INVENTORY.run({IMAGE_DATA:FP_INVENTORY_PICTURE.files[0].data});
			else
				await _2_SP_INSERT_INVENTORY.run();

			if(_2_SP_INSERT_INVENTORY.data !== undefined && _2_SP_INSERT_INVENTORY.data.length === 1){
				if( _2_SP_INSERT_INVENTORY.data[0].RESULT_CODE === "ERROR"){
					await showAlert( _2_SP_INSERT_INVENTORY.data[0].RESULT_MESSAGES,"error");
					//Init.PageLoad();
				}else{
					showAlert( "Save success","success");
					await closeModal(Modal_SAVE.name)
					showModal(Modal_ADD_NEXT.name);
				}// finallyDone();
			}

		}else{
			//edit
			let setup = {}
			if(FP_INVENTORY_PICTURE.files.length>0)
				setup.IMAGE_DATA = FP_INVENTORY_PICTURE.files[0].data;
			if(DefaultInventory.IMAGE.data == "" && DefaultInventory.INVENTORY_PICTURE.data != ""){
				setup.DELETE_IMAGE = DefaultInventory.INVENTORY_PICTURE.data;
				DefaultInventory.INVENTORY_PICTURE.data = null;
			}
			await _3_SP_UPDATE_INVENTORY.run(setup);
			
			if(_3_SP_UPDATE_INVENTORY.data !== undefined && _3_SP_UPDATE_INVENTORY.data.length === 1){
				if( _3_SP_UPDATE_INVENTORY.data[0].RESULT_CODE === "ERROR"){
					await showAlert( _3_SP_UPDATE_INVENTORY.data[0].RESULT_MESSAGES,"error");
				}else{
					await showAlert( "save success","success");
					await removeValue(Configs.EditInventory);
					await closeModal(Modal_SAVE.name)
					navigateTo('Product Inventory Dashboard', {}, 'SAME_WINDOW');
				}


			}
		}

	},
	deleteButtonClick:()=>{
		const finallyDone = async ()=>{
			await closeModal(Modal_ConfirmDelete.name);
			await removeValue(Configs.EditInventory);
			navigateTo('Product Inventory Dashboard', {}, 'SAME_WINDOW');
		}
		_4_SP_DELETE_INVENTORY.run().then(()=>{
			if(_4_SP_DELETE_INVENTORY.data !== undefined && _4_SP_DELETE_INVENTORY.data.length === 1){
				if( _4_SP_DELETE_INVENTORY.data[0].RESULT_CODE === "ERROR"){
					showAlert( _4_SP_DELETE_INVENTORY.data[0].RESULT_MESSAGES,"error");
					//Init.PageLoad();
					//Init.LoadDefaultProductCatalog();
					//Init.LoadDefaultProductInventory();
				}else finallyDone();
			}
		})
	},
	test:()=>{
		//console.log(parseFloat(AVAILABLE_UNIT.text)+parseFloat(DefaultInventory.UNIT.data||0))
	}
}