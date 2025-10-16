export default {
	myVar1: ()=>{
		return  _.pickBy(Profile_Widgets, function(value, key) {if(value.page === "T3") return value;})
	}
}