export default {
	pageSize:10,
	expiredColor:(currentRow)=>{
		if(moment( currentRow).format()=="Invalid date") return;
		else if( moment( currentRow).isBefore(moment())) return "#ef4444"; 
		else return;
	}
}