export default {
	onNewCatalogClick:async()=>{
		if(!await Init.sessionCheck()) navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await Init.permissionsCheck(Configs.permissions.VIEW,true)) return;
		removeValue(Configs.editProductCatalog,true).then(() => {
			navigateTo('Manage Product Catalog', {}, 'SAME_WINDOW');
		});
	},
	onEditCatalogClick:async()=>{
		if(!await Init.sessionCheck()) navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await Init.permissionsCheck(Configs.permissions.VIEW,true)) return;
		storeValue(Configs.editProductCatalog, PMS_PRODUCT_CATALOG_LM.selectedRow,true).then(() => {
			navigateTo('Manage Product Catalog', {}, 'SAME_WINDOW');
		});
	},
	onSearchClick:async()=>{
		if(!await Init.sessionCheck()) navigateTo('Login', {}, 'SAME_WINDOW');
		if(!await Init.permissionsCheck(Configs.permissions.VIEW,true)) return;
		await resetWidget(PMS_PRODUCT_CATALOG_LM.widgetName);
		await SP_SER_SEARCH_FOR_PRODUCT_CATA.run();				

	}

}