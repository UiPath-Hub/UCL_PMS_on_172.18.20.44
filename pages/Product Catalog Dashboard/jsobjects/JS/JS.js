export default {
	onNewCatalogClick:()=>{
		removeValue(Configs.editProductCatalog,true).then(() => {
			navigateTo('Manage Product Catalog', {}, 'SAME_WINDOW');
		});
	},
	onEditCatalogClick:()=>{
		storeValue(Configs.editProductCatalog, PMS_PRODUCT_CATALOG_LM.selectedRow,true).then(() => {
			navigateTo('Manage Product Catalog', {}, 'SAME_WINDOW');
		});
	},
	onSearchClick:async()=>{
		await resetWidget(PMS_PRODUCT_CATALOG_LM.widgetName);
		await SP_SER_SEARCH_FOR_PRODUCT_CATA.run();
	}

}