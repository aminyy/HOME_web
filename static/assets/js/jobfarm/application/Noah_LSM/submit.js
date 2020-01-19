global_cao_application_data_infiles_num=0;
global_cao_applicaton_data_outfiles_num=3;

function prepareArgument(){	
	var files=$(".filename");
	for(var i=0;i<files.length;i++){
		var index=files[i].value.split(".").length-1
		var extendname=files[i].value.split(".")[index]
		if(extendname==="dat"){
			var arg=files[i].value;
			$("#argumentID").val(arg);
			return(1)
		}
	}
	return(0)
}

