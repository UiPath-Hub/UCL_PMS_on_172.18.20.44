export default {
	dateFormat:"D MMM YYYY",
	sqlDataFormat:"YYYY-MM-DD",
	tableDataFormat: "D MMMM, yyyy",
	pageName:"Prospect Detail",
	AllModals:[Modal_Session_detail.name,
						 Modal_ErrorAlert.name,
						 MODAL_SAVE.name,
						 MODAL_QUALIFY_CONFIRM.name,
						 MODAL_REASON_REJECT.name,
						 MODAL_APPROVE_CONFIRM.name],
	permissions:{VIEW:"PROV",EDIT:"PROE",EXEEMAIL:"PROEXE"},
		requiredColorAlert:"#ef4444",
	requiredColorPass:"",
	text_other:"อื่นๆ",
	mailSubject:`รายการ Prospect ที่รอการอนุมัติ ${moment().format("DDMMYYYY")} (${moment().format("HH:mm")})`
}