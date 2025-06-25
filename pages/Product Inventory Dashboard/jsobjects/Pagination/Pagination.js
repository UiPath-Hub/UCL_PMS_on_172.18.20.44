export default {
	pageSize:10,
	expiredColor:(currentRow)=>{
		if(moment( currentRow).format("DD MMM YYYY")=="Invalid date") return "#f4f4f5";
		else if( moment( currentRow).isBefore(moment())) return "#ef4444"; 
		else return;
	}
}