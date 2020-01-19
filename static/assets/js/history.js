var cao_history_data={};
cao_history_data_curr_jobid=0;


//提交前的检查
function cao_history_checkSearchSubmit(){
	var radioChoice=$('input[name="jobQueryRN"]:checked').val();
	if(radioChoice=="jobid"){
		var jobidstrs=$("#inputJobID").val();
		if(jobidstrs==null || jobidstrs.length==0){
			alert("作业号不能为空 ” ！");
			$("#inputJobID").focus();
			return false;
		}
	}else{
		//检查日期是否合法
		var startTime=$("#inputStartTime").val();
		var startInt=0;
		if(startTime!=null || startTime.length>0){
			startInt=parseInt(startTime)
		}
		var endTime=$("#inputEndTime").val();
		var endInt=0;
		if(endTime!=null || endTime.length>0){
			endInt=parseInt(endTime)
		}
		if(startInt!=0 && endInt<startInt){
			alert("作业查询的“结束时间 ”不能早于“开始时间 ” ！");
			$("#inputStartTime").focus();
			return false;
		}
	}
	return true;
}

function one2two(strin){
	var strOut=strin.toString();
	if(strOut.length==1){
	strOut="0"+strOut;
	}
	return strOut;
}

function formatTime(seconds){
	 var timesub=new Date();
	 var currY=timesub.getFullYear();
	 timesub.setTime((parseInt(seconds))*1000)//strbegtm可能是秒，不是毫秒
	 var strbegt="";
	 var month=timesub.getMonth()+1
	 if(timesub.getFullYear()==currY){//"MM-DD hh:mm"
	 strbegt=one2two(month)+"-"+one2two(timesub.getDate())+" "
	 +one2two(timesub.getHours())+":"+one2two(timesub.getMinutes())
	 }else{
	 strbegt=one2two(month)+"-"+one2two(timesub.getDate())+ " "+timesub.getFullYear()
	 }
	 return strbegt;
}
function getStatusNameFromInt(status,jobgid,jobujid) {
	var id=arguments[1]?arguments[1]:0;
	var ujid=arguments[2]?arguments[2]:0;
	var statusName = "";
	switch (status) {
	case 1:
		statusName = "SUBMITTED";
		break;
	case 2:
		statusName = "STAGINGIN";
		break;
	case 4:
		statusName = "SCHEDULING";
		break;
	case 8:
		statusName = "SCHEDULED";
		break;
	case 16:
		statusName = "PENDING";
		break;
	case 17:
		statusName = "RUNNING";
		break;
	case 18:
		statusName = "STAGINGOUT";
		break;
	case 20:
		//2015422修改
		statusName = "RUNNING";
		var t=readychartdata(id,ujid)
		break;
	case 24:
		statusName = "FAILED";
		break;
	case 32:
		statusName = "TERMINATED";
		break;
	case 33:
		statusName = "NET_DELAY";
		break;
	case 34:
		statusName = "SUB_ERROR";
		break;
	case 38:
		statusName = "EXIT";
		break;
	default:
		statusName = "ENDED";
		break;
	}
	return statusName;
}

//请求准备画图数据
function readychartdata(id,ujid){
    $.get('/jobfarm/readychartdata?jobgid='+id,function(data,status){
    	var mytime=new Date()
   	    var formattime=formatTime(mytime.getTime()/1000)
		 if(status=="success"){

		     if(data=="readychartdata"){

		    	 $("th#status_"+ujid).text("FINISHED:"+formattime)
		     }
		     else{
		    	 formattime=$("th#status_"+ujid).text().substr(8)

		    	 $("th#status_"+ujid).text("FINISHED:"+formattime)
		     }
		  }
		  else{
			  $("th#status_"+ujid).text("ERROR:"+formattime)
		  }
		 })
	return 1
}
function getStatusColor(status){
	var colorName="info";
	switch(status){
		case 16://PENDING
			colorName="warning";
			break;
		case 17://running
			colorName="success";
			break;
	}
	if(status>=20){
		colorName=""
	}
	return 	colorName;
}

function getKillJobAction(status,num){
	var str="";
	if(status==16 || status==17){
		str="<a href=\"javascript:killJob("+num+")\">终止</a>";
	}else{
		str="<span>终止</span>";
	}
	return str;
}

//处理响应的消息
function cao_history_respSearch(jsonObj,status){
	var status_code=jsonObj.status_code;
	if(status_code==0){
		var list=jsonObj.jobs_list;
		cao_history_data_jobs_list=list;
		var tbody=$("#jobsQueryInfoTB");
		tbody.html("");
		if(list.length>0){
			for (var i=0;i<list.length;i++){
				var job=list[i];
				//var mytime=new Date();
				//mytime.setTime(api.updateTime);
				var trEle=$("<tr class="+getStatusColor(job.status)+">"+
						"<th><a href=\"javascript:listJobSpace("+i+")\">"+job.ujid+"</a></th>"+
						"<th>"+job.job_name+"</th>"+
						"<th>"+job.queue_name+"@"+job.exec_host+"</th>"+
						"<th>"+job.applicationname+"</th>"+
						"<th>"+formatTime(job.submit_time)+"</th>"+
						"<th id='status_"+job.ujid+"'>"+getStatusNameFromInt(job.status,job.gid,job.ujid)+":"+formatTime(job.update_time)+"</th>"+
						"<th>"+getKillJobAction(job.status,i)+"</th>"+
						"</tr>");
				tbody.append(trEle);
			}
		}
	}
	$("#jobsQueryDiv").show();
}

function history_bind_form_search(){
	var options = {
	  	         target:'#jobQueryForm',    // target element(s) to be updated with server response
	  	         dataType:'json',
	  	         beforeSubmit:cao_history_checkSearchSubmit,   // pre-submit callback 表单提交前被调用的回调函数
	  	         success:cao_history_respSearch   // post-submit callback   表单提交成功后被调用的回调函数
	   	}
	  	$('#jobQueryForm').submit(function() {
	          $(this).ajaxSubmit(options);
	          return false;
	     });
}

function bind_date(){
	$('#inputStartTime').datepicker({
		dateFormat : 'yymmdd',
		weekStart : 1,
		autoclose : true,
		changeMonth: true,
    changeYear: true,
		todayBtn : 'linked',
		language : 'zh-CN'
	});
	$('#inputEndTime').datepicker({
		dateFormat : 'yymmdd',
		weekStart : 1,
		autoclose : true,
	changeMonth: true,
   changeYear: true,
		todayBtn : 'linked',
		language : 'zh-CN'
	});
}

function initHistory(){
	history_bind_form_search();
	bind_date();
	$("#jobSpaceDiv").hide();
	var mytime=new Date()
	var mystr='time='+mytime.getTime();
	var fileURL="/jobfarm/history/query/bjobs?ajax=true&action=bjobs&"+mystr
	$.get(fileURL, cao_history_respSearch,"json");
}

function listJobSpace(num){
	cao_history_data_curr_jobid=0;
	var jobsLen=cao_history_data_jobs_list.length;
	if(jobsLen>0 && num<jobsLen){
		var job=cao_history_data_jobs_list[num]
		var jobid=job.gid
		cao_history_data_curr_jobid=job.gid
		cao_history_data_curr_ujid=job.ujid
		$.get("/jobfarm/history/query/job?ajax=true&action=listJob&jid="+jobid, history_retJobSapce,"json");
	}
}

function getJobAction(finfo,fname){
	var strDown="<span>下载</span>"
	if(finfo[2]==true){//下载
		strDown="<a href=\""+getDownloadFileURL(fname)+"\">下载</a>";
	}
	var strView="<span>查看</span>"
	if(finfo[3]==true){//查看
		strView="<a href=\"javascript:viewFileStart('"+fname+"')\">查看</a>";
	}

	if(finfo[4]==true){//只针对noah的输出文件OUTPUT.txt
		var strChart="<span>绘图</span>"
		if($("th#status_"+cao_history_data_curr_ujid).text().substr(0,8)=="FINISHED"){
		strChart="<a href=\"/jobfarm/chartshow?jid="+cao_history_data_curr_jobid+"\" target=\"_blank\">绘图</a>";}
	}
	if(finfo[4]==true){
	   return strView+"&nbsp;&nbsp;"+strDown+"&nbsp;&nbsp;"+strChart
	}
	else{
		return strView+"&nbsp;&nbsp;"+strDown
	}
}
function getDownloadFileURL(fname){
	 var mytime=new Date()
	 var mystr='time='+mytime.getTime()+'&jid=' + cao_history_data_curr_jobid + "&fname=" + fname;
	 var fileURL="/jobfarm/history/query/job/download?ajax=true&"+mystr
	 return fileURL
}



function history_retJobSapce(jsonObj,status){
	var status_code=jsonObj.status_code;
	var tbody=$("#jobSpaceInfoTB");
	$("#jobidspan").html(cao_history_data_curr_ujid)
	tbody.html("");
	if(status_code==0){
		var list=jsonObj.files;
		cao_history_data_job_files=list;
		var num=1;
		if(jsonObj.total>0){
			for (var fname in list){
				var finfo=list[fname];
				var fileType="file";
				finfo[2]=true
				finfo[3]=true
				if(fname=="OUTPUT.txt"){
					finfo[4]=true
				}
				else{
					finfo[4]=false
				}
				var trEle=$("<tr>"+
						"<th>"+num+"</th>"+
						"<th>"+fname+"</th>"+
						"<th>"+fileType+"</th>"+
						"<th>"+finfo[1]+"</th>"+
						"<th>"+finfo[0]+"</th>"+
						"<th>"+getJobAction(finfo,fname)+"</th>"+
						"</tr>");
				tbody.append(trEle);
				num=num+1
			}
		}else{
			cao_history_data_curr_jobid=0;
		}
	}else{
		cao_history_data_curr_jobid=0;
	}
	$("#jobSpaceDiv").show();
}

function killJob(num) {
	var jobid = cao_history_data_jobs_list[num].ujid;
	var jobgid = cao_history_data_jobs_list[num].gid
	dalert.confirm("您试图终止作业\"" + jobid + "，\"</br>您确定继续操作吗？", "终止作业提醒!",
			function(result) {
				if (result) {
					var mytime = new Date()
					var mystr = 'time=' + mytime.getTime() + '&jid=' + jobid
					var fileURL = "/jobfarm/history/query/job/kill?ajax=true&"
							+ mystr
					$.get(fileURL, killJob_retStatus, "json");
				} else {
				}
			});
}

function killJob_retStatus(jsonObj,status){
	var status_code=jsonObj.status_code;
	var jobid=jsonObj.jobid
	if (parseInt(jobid)>0){
		if(status_code==0){
			$("#status_"+status_code).html("终止指令已发送")
			$("#status_"+status_code).attr("title","发送成功不代表作业成功终止，请稍后查看作业状态")
		}else{
			$("#status_"+status_code).html("终止指令错误")
			$("#status_"+status_code).attr("title","只有等待和运行状态可以杀掉作业")
		}
	}


}

function startModal(){
	heightAll=$(window).height(); //浏览器当前窗口文档的高度
	widthAll=$(window).width();//浏览器当前窗口文档对象宽度
	mWidth=parseInt(widthAll/2)+"px";
	mHeightInt=parseInt(heightAll/2);
	mHeight=parseInt(heightAll/2)+"px";
	leftInt=parseInt(widthAll/4)+"px";
	heightInt=parseInt(heightAll/3)+"px";

	$('#myModal').modal().css({
	    width: mWidth,
	    left:leftInt,
	    top:heightInt,
	});

	$('#mdialogDiv').css({
		height:mHeight,
		margin:'0px 0px 0px 0px',
	});

	mbodyHeightInt=mHeightInt-$("#mheaderDiv").outerHeight(true)-$("#mfooterDiv").outerHeight(true)-5;
	mbodyOuter=$("#mbodyDiv").outerHeight(true)-$("#mbodyDiv").height();
	mbodyHeightInt=mbodyHeightInt-mbodyOuter
	mbodyHeight=mbodyHeightInt+"px"
	$('#mbodyDiv').css({
	    height:mbodyHeight,
	});
	textHeight=($("#mbodyDiv").height()-10)+'px';
	$('#textlines').css({
		height:textHeight,
	});
}


function viewFileStart(fname){
	viewFile(fname,0,10,true);
}

function viewFileTail(){
	viewFile(cao_history_data_view_file,0,10,true);
}

function viewFileHead(){
	viewFile(cao_history_data_view_file,0,10,true);
}

function viewFileUpPage(){
	viewFile(cao_history_data_view_file,0,-10,false);
}

function viewFileNextPage(){
	viewFile(cao_history_data_view_file,0,10,false);
}

function viewFile(fname,startNum,lengthNum,firstViewFlag){
	startModal();
	if(firstViewFlag==true){
		cao_history_data_view_start=startNum;
		cao_history_data_view_length=lengthNum;
		cao_history_data_view_file=fname;
	}else{
		startNum=cao_history_data_view_start+lengthNum;
		cao_history_data_view_start=startNum;
	}
	$('#viewJobIdSpan').html(cao_history_data_curr_ujid);
	$('#viewFileNameSpan').html(fname);
	var endNum=startNum+lengthNum;
	$('#viweStatusSpan').html('正在查看文件['+startNum+','+endNum+']行');
	$("#textlines").html("");
	var mytime=new Date()
	var mystr='time='+mytime.getTime()+'&start_line='
	+ startNum + "&lines_num=" + lengthNum
	+'&jid=' + cao_history_data_curr_jobid
	+ "&fname=" + fname;
	var fileURL="/jobfarm/history/query/job/view?ajax=true&"+mystr
	$.get(fileURL, viewFile_retTextLines,"json");
}

function viewFile_retTextLines(jsonObj,status){
	var status_code=jsonObj.status_code;
	if(status_code==0){
		lines=jsonObj.items;
		linesLen=lines.length;
		for (var i=1;i<linesLen;i++){
			$("#textlines").append(lines[i]+"\n");
		}
	}
}

