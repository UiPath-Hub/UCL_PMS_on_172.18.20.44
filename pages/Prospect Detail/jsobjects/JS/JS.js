export default {
	loadTable:async(tableName)=>{
		let data = await TableDisplay[tableName].run();
		if(data[0].TOTAL_RECORDS > 0){
			TableDisplay[tableName].data = await Promise.all(data.map(async(row)=>{
				const displayRow = _.pick(row, Object.keys(TableDisplay[tableName].ColumnsMap));
				TableDisplay[tableName].DataColumns.forEach((DateColumnName)=>{
					if(displayRow[DateColumnName] !== undefined && displayRow[DateColumnName] !== null){
						displayRow[DateColumnName] = moment(displayRow[DateColumnName]).format(Configs.tableDataFormat);
					}
				})
				return _.mapKeys(displayRow, (value, key) => {
					return TableDisplay[tableName].ColumnsMap[key]
				})
			}))
			return true;
		}else return false;
	},
	onEditItemClick:()=>{
		if(!Init.permissionsCheck(Configs.permissions.VIEW,false))return;
		if(!Init.permissionsCheck(Configs.permissions.EDIT,false))return;
		navigateTo('Prospect Dashboard', {}, 'SAME_WINDOW');
	},
	onClick_Close:async()=>{
		if(appsmith.store[Init.SINGLE_PAGE]?.recentPage && _.last(appsmith.store[Init.SINGLE_PAGE]?.recentPage)===Configs.pageName)
		{
			const backTo = appsmith.store[Init.SINGLE_PAGE].recentPage[appsmith.store[Init.SINGLE_PAGE].recentPage.length-2]
			await storeValue(Init.SINGLE_PAGE,{recentPage:_.slice(appsmith.store[Init.SINGLE_PAGE].recentPage,0,appsmith.store[Init.SINGLE_PAGE].recentPage.length-2)},false);
			navigateTo(backTo, {}, 'SAME_WINDOW');
		}else{
			navigateTo('Prospect Dashboard', {}, 'SAME_WINDOW');
		}
	}
}