export default {
	onClick_Bttn_ClearImage:()=>{
		Default_ProductCatalog.IMAGE.data = "";
		resetWidget(FP_CATALOG_PICTURE.widgetName);
		resetWidget(PV_CATALOG_PICTURE.widgetName);
	},
	isValid_CATALOG_PICTURE:async()=>{
		if(FP_CATALOG_PICTURE.isValid){
			return true;
		}else{
			showAlert("Invalid image file.","info")
			return false;
		}
	},
	onSaveClick:async(confirm)=>{
		if(!GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false))return;
		if(!confirm){
			let alertWidget = await GlobalFunctions.manualValidateV2(Default_ProductCatalog,ProductCatalogWidget);
			console.log(alertWidget)
			let isImageValid = await this.isValid_CATALOG_PICTURE();
			if(alertWidget.length > 0 || !isImageValid){
				showAlert(`Some field is required or invalid.`)
			}else{
				showModal(Modal_SAVE.name);
			}
		}else{
			if(appsmith.store[Configs.editProductCatalog]=== undefined){
				//new
				if(FP_CATALOG_PICTURE.files.length>0)
					await _1_INSERT_CATALOG.run({IMAGE_DATA:FP_CATALOG_PICTURE.files[0].data});
				else	
					await _1_INSERT_CATALOG.run();

				if(_1_INSERT_CATALOG.data !== undefined && _1_INSERT_CATALOG.data.length !== 0){
					if(_1_INSERT_CATALOG.data[0].RESULT_CODE === "DONE"){
						showAlert( "Save success","success");
						await closeModal(Modal_SAVE.name);
						await showModal(Modal_ADD_NEXT.name);
						//return 0;
					}
					else{ 
						showAlert(_1_INSERT_CATALOG.data[0].RESULT_MESSAGES ,"error")
						//return 1;
					}
				}

			}
			else{
				//edit
				console.log("editting")
				let setup = {}
				if(FP_CATALOG_PICTURE.files.length>0)
					setup.IMAGE_DATA = FP_CATALOG_PICTURE.files[0].data;
				if(PV_CATALOG_PICTURE.image == "" && FP_CATALOG_PICTURE.files.length === 0){
					setup.DELETE_IMAGE = "1";
					//Default_ProductCatalog.CATALOG_PICTURE.data = null;
				}
				await _2_UPDATE_CATALOG.run(setup);

				if(_2_UPDATE_CATALOG.data !== undefined && _2_UPDATE_CATALOG.data.length !== 0){
					if(_2_UPDATE_CATALOG.data[0].RESULT_CODE === "DONE"){
						showAlert( "Save success","success");
						await closeModal(Modal_SAVE.name);
						await removeValue(Configs.editProductCatalog);
						navigateTo('Product Catalog Dashboard', {}, 'SAME_WINDOW')
						//return 0;
					}
					else{ 
						showAlert(_2_UPDATE_CATALOG.data[0].RESULT_MESSAGES ,"error")
						//return 1;
					}
				}
			}

		}


	},
	onAddNextClick:async ()=>{
		//await Init.pageLoad();
		await closeModal(Modal_ADD_NEXT.name);
		navigateTo(appsmith.URL.fullPath, {}, 'SAME_WINDOW')
	},
	onNotAddNextClick:async ()=>{
		await closeModal(Modal_ADD_NEXT.name);
		await removeValue(Configs.editProductCatalog);
		navigateTo('Product Catalog Dashboard', {}, 'SAME_WINDOW')

	},
	onDeleteClick:async (confirm)=>{
		if(!GlobalFunctions.permissionsCheck(Configs.permissions.EDIT,false))return;
		if(!confirm){
			showModal(Modal_ConfirmDelete.name);
		}else{
			await _3_DELETE_CATALOG.run()
			if(_3_DELETE_CATALOG.data !== undefined && _3_DELETE_CATALOG.data.length !== 0){
				if(_3_DELETE_CATALOG.data[0].RESULT_CODE === "DONE"){
					await closeModal(Modal_ConfirmDelete.name);
					await removeValue(Configs.editProductCatalog);
					navigateTo('Product Catalog Dashboard', {}, 'SAME_WINDOW');

				}
				else showAlert(_3_DELETE_CATALOG.data[0].RESULT_MESSAGES ,"error")
			}
		}
	},
	onCancelClick:async ()=>{
		await removeValue(Configs.editProductCatalog);
		navigateTo('Product Catalog Dashboard', {}, 'SAME_WINDOW');
	}
}