/**
  * app.js
  * Function/Utilities for managing Reports 
  *
  * @package    PropDispatch - Realtime, Data-Driven Proppant Logistics Management
  * @subpackage Reports
  * @author     __ <__@propdispatch.com>
  * @version    <>
  * @Created on <>
  */
  
(function ($) {
	'use strict';
	$.fn.dataTable.ext.errMode = 'none';
	
	if($( ".select2-multiple" ).length>0){$( ".select2-multiple" ).select2({
		theme: "bootstrap"
	});}

	  window.app = {
      name: 'aside',
      setting: {
        folded: true,
        container: false,
        color: 'primary',
        bg: ''
      }
    };

    var setting = 'jqStorage-'+app.name+'-Setting',
        storage = $.localStorage,
        color;
    
    /* if( storage.isEmpty(setting) ){
        storage.set(setting, app.setting);
    }else{
        app.setting = storage.get(setting);
    }
    var v = window.location.search.substring(1).split('&');
    for (var i = 0; i < v.length; i++)
    {
        var n = v[i].split('=');
        app.setting[n[0]] = (n[1] == "true" || n[1]== "false") ? (n[1] == "true") : n[1];
        storage.set(setting, app.setting);
    } */

    setTheme();

    // init
    function setTheme(){

      $('body').removeClass($('body').attr('ui-class')).addClass(app.setting.bg).attr('ui-class', app.setting.bg);
      app.setting.folded ? $('#aside').addClass('folded') : $('#aside').removeClass('folded');
      $('#aside').length == 0 && (app.setting.container ? $('.app-header .navbar, .app-content').addClass('container') : $('.app-header .navbar, .app-content').removeClass('container'));

      $('.switcher input[value="'+app.setting.color+'"]').prop('checked', true);
      $('.switcher input[value="'+app.setting.bg+'"]').prop('checked', true);

      $('[data-target="folded"] input').prop('checked', app.setting.folded);
      $('[data-target="container"] input').prop('checked', app.setting.container);
      
   
    }

    // click to switch
    $(document).on('click.setting', '.switcher input', function(e){
      var $this = $(this), $target;
      $target = $this.closest('[data-target]').attr('data-target');
      app.setting[$target] = $this.is(':checkbox') ? $this.prop('checked') : $(this).val();
      storage.set(setting, app.setting);
      setTheme();
    });
	
 
	$( document ).ready(function() {
		$(".footer-icon").click(function(){ 
			$("#aside").toggleClass("folded");
				
		});
	});
	 

})(jQuery);
var lastloadstate=new Array();
var googleMapsstyles = [
			{
			  "featureType": "poi",
			  "stylers": [
				{ "visibility": "off" }
			  ]
			}
		  ];
 
function getColumnWidth(columnClass,text) { 
    tempSpan = $('<span id="tempColumnWidth" class="'+columnClass+'" style="display:none">' + text + '</span>')
          .appendTo($('body'));
    columnWidth = tempSpan.width();
    tempSpan.remove();
	return columnWidth;
}
var clustermarkers=null;
var reference=new Array(); 
var markerlabelArray=new Array(); 
var markerclusterArray=new Array(); 
var allusersRef=new Array(); 
var usersRef=null;
var map = null;
var bounds = null;
var boundspolygon = null;
var infowindow ='';
var joblistingref=new Array();
var jobchangedlistineer=false;
var activejobid=0;
var jobremoveactive=1;
var activeloadid=0;
var joadrefreshfirebase=false;
var childjoadrefreshfirebase=true;
var jobloadref=new Array();
var companydriversloaded=false;
var companydriversref=null; 
var currentdriverid=0;
var AllCarrierdrivers=new Array();
var newjobs=null;
var incompletejobref=null;
var drivertrackingref=null;
var overlayspider = null;
function unloadrefrences(){
	if(typeof newjobs !='undefined' && newjobs!=null){
		newjobs.off();
	} 
	if(typeof reference !='undefined' && reference!=null){
		$.each(reference, function(i, item) {
			if(reference[i]){reference[i].off(); }
		}); 
	}  	
	if(typeof allusersRef !='undefined' && allusersRef!=null){ 
		$.each(allusersRef, function(i, item) {
			if(allusersRef[i]){allusersRef[i].off(); }
		}); 
	}
	if(typeof usersRef !='undefined' && usersRef!=null){  
		usersRef.off();
	}
	if(typeof incompletejobref !='undefined' && incompletejobref!=null){
		incompletejobref.off();
	}
	if(typeof driverref !='undefined' && driverref!=null){ 
		$.each(driverref, function(i, item) {
			if(driverref[i]){driverref[i].off(); }
		}); 
		
	} 
	if(typeof joblistingref !='undefined' && joblistingref!=null){  
		$.each(joblistingref, function(i, item) {
			if(joblistingref[i]){joblistingref[i].off(); }
		});
	}
	if(companydriversref!=null){
		companydriversref.off();
	}
	if(typeof jobloadref !='undefined' && jobloadref!=null){ 
		$.each(jobloadref, function(i, item) {
			if(jobloadref[i]){jobloadref[i].off(); }
		}); 
	} 
	
	if (clustermarkers) {
		clustermarkers.clearMarkers();
	}
}
function opencustomers(custype){
	
	if(custype==1){
		changecompanytype(1,'Operator');
	}
	if(custype==3){
		changecompanytype(3,'Service Company');
	}
	if(custype==4){
		changecompanytype(4,'Logistic Company');
	}
	$('#addcompanyusertype').val(custype);
	
	
}

function formatNumber (num) {
	 
	var inD='.';
	var outD='.';
	var sep=',';
	num += '';
	var dpos = num.indexOf(inD);
	var nStrEnd = '';
	if (dpos != -1) {
		nStrEnd = outD + num.substring(dpos + 1, num.length);
		num = num.substring(0, dpos);
	}
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(num)) {
		num = num.replace(rgx, '$1' + sep + '$2');
	}
	return num + nStrEnd; 
}
function phoneformat(phonenum){
	 var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (regexObj.test(phonenum)) {
        var parts = phonenum.match(regexObj);
        var phone = "";
        if (parts[1]) { phone += "" + parts[1] + "-"; }
        phone += parts[2] + "-" + parts[3];
        return phone;
    }else { 
        return phonenum;
    } 
}
function isphone(phonenum){
	 var regexObj = /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (regexObj.test(phonenum)) {
        return true;
    }else {
         return false;
    } 
}
function isnumericwithdashonly(phonenum){
	if(phonenum!=''){
		phonenum=phonenum.replace('-','');
	}
	 var regexObj = /^[0-9 ]+$/;
    if (regexObj.test(phonenum)) {
        return true;
    }else {
         return false;
    } 
}
function isalphabatics(phonenum){
	 var regexObj = /^[A-Za-z ]+$/;
    if (regexObj.test(phonenum)) {
        return true;
    }else {
         return false;
    } 
}
function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

function confirmpackageAlert(msg, success, failure){
	 (new PNotify({
		title: 'PropDispatch',
		text: msg,
		icon: 'fa fa-question-circle',
		hide: false,
		confirm: {
			confirm: true
		},
		buttons: {
			closer: false,
			sticker: false
		},
		history: {
			history: false
		}
	})).get().on('pnotify.confirm', function() {
		success();
	}).on('pnotify.cancel', function() {
		failure();
	});
	 
};
function confirmAlert(msg, success, failure){
	var stack_bar_top = {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0,'modal': true, "spacing2": 0};
  (new PNotify({
		title: 'PropDispatch',
		text: msg,
		icon: 'fa fa-question-circle',
		hide: false,
		addclass: 'pnotify-center',
		stack: stack_bar_top,		
		confirm: {
			confirm: true,
			buttons: [{
				text: 'Confirm',
				addClass: 'btn-primary',
				hide: true,
				confirm: {
					confirm: false
				},
				buttons: {
					closer: true,
					sticker: true
				},
				click: function(notice) {
					PNotify.removeAll();
					success(); 
				}
			}]
		},
		buttons: {
			closer: false, 
			sticker: false
		},
		history: {
			history: false
		}
	})).get().on('pnotify.confirm', function() {
		success();
	}).on('pnotify.cancel', function() {
		failure();
	});
	 
		
};

function progress_load(){
    var cur_value = .5,
        progress;

   
    var loader = new PNotify({
        title: "Upload in progress",
        text: '<div class="progress active" style="margin:0">\
  <div class="progress-bar warning" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0">\
    <span class="sr-only">0%</span>\
  </div>\
</div>',
        icon: 'fa fa-cog fa-spin',
        hide: false,
        buttons: {
            closer: false,
            sticker: false
        },
        history: {
            history: false
        },
        before_open: function(notice) {
            progress = notice.get().find("div.progress-bar");
            progress.width(cur_value + "%").attr("aria-valuenow", cur_value).find("span").html(cur_value + "%");
            // Pretend to do something.
            var timer = setInterval(function() { 
                if (cur_value >= 100) { 
                    window.clearInterval(timer);
                    //loader.remove(); 
                    return;
                }
                cur_value += .5;
                progress.width(cur_value + "%").attr("aria-valuenow", cur_value).find("span").html(cur_value + "%");
            }, 65);
        }
    });
} 
function confirmAlertJob(msg, success, failure){
	var stack_bar_top = {"dir1": "down", "dir2": "right", "push": "top", "spacing1": 0,'modal': true, "spacing2": 0};
  (new PNotify({
		title: 'PropDispatch',
		text: msg,
		icon: 'fa fa-question-circle',
		hide: false,
		addclass: 'pnotify-center',
		stack: stack_bar_top,		
		confirm: {
			confirm: true,
			buttons: [{
				text: 'Yes', 
				hide: true,
				confirm: {
					confirm: false
				},
				buttons: {
					closer: true,
					sticker: true
				},
				click: function(notice) {
					PNotify.removeAll();
					success(); 
				}
			},{
				text: 'No', 
				buttons: {
					closer: true,
					sticker: false
				},
				click: function(notice) {
					PNotify.removeAll();
					failure(); 
				}
			}]
		},
		buttons: { 
			closer: false, 
			sticker: false
		},
		history: {
			history: false
		}
	})).get().on('pnotify.confirm', function() {
		success();
	}).on('pnotify.cancel', function() {
		failure();
	});
	 
		
};
function confirmNotince(msg, success, failure){
	 
	(new PNotify({
		title: 'PropDispatch',
		text: msg,
		icon: 'fa fa-question-circle',
		hide: false,
		confirm: {
			confirm: true
		},
		buttons: {
			closer: false,
			sticker: false
		},
		history: {
			history: false
		}
	})).get().on('pnotify.confirm', function() {
		success();
	}).on('pnotify.cancel', function() {
		failure();
	});
	 
};
function failureAlert(msg){
	new PNotify({
		title: 'PropDispatch',
		text: msg,
		type: 'error',
		delay: 2500,
		history: {
			history: false
		}
	});
	 
};
function warningAlert(msg){
	new PNotify({
		title: 'PropDispatch',
		text: msg,
		delay: 2500,		
		history: {
			history: false
		}
	});
	 
};
function successAlert(msg){
	
	new PNotify({
		title: 'PropDispatch',
		text: msg,
		delay: 2500,	
		type: 'success',
		history: {
			history: false
		}
	});
 
};
function successalert(msg){
	
	new PNotify({
		title: 'PropDispatch',
		text: msg,
		delay: 2500,	
		type: 'success',
		history: {
			history: false
		}
	});
 
};




function successaalert(message){
	
	new PNotify({
		title: 'PropDispatch',
		text: message,
		delay: 2500,
		type: 'success',
		history: {
			history: false
		}
	}); 
}

function dangeralert(message){
	new PNotify({
		title: 'PropDispatch',
		text: message,
		delay: 2500,
		type: 'error',
		history: {
			history: false
		}
	}); 
}
function warningsalert(message){
	new PNotify({
		title: 'PropDispatch',
		text: message, 
		delay: 2500,
		history: {
			history: false
		}
	}); 
}

function makePDF(elementid,pdffilename) {

    var quotes = $(elementid)[0]; 

    html2canvas(quotes, {
        onrendered: function(canvas) {

        //! MAKE YOUR PDF
        var pdf = new jsPDF('p', 'pt', 'letter');

        for (var i = 0; i <= quotes.clientHeight/980; i++) {
            //! This is all just html2canvas stuff
            var srcImg  = canvas;
            var sX      = 0;
            var sY      = 980*i; // start 980 pixels down for every new page
            var sWidth  = 900;
            var sHeight = 980;
            var dX      = 0;
            var dY      = 0;
            var dWidth  = 900;
            var dHeight = 980;

            window.onePageCanvas = document.createElement("canvas");
            onePageCanvas.setAttribute('width', 900);
            onePageCanvas.setAttribute('height', 980);
            var ctx = onePageCanvas.getContext('2d');
            // details on this usage of this function: 
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
            ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

            // document.body.appendChild(canvas);
            var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

            var width         = onePageCanvas.width;
            var height        = onePageCanvas.clientHeight;

            //! If we're on anything other than the first page,
            // add another page
            if (i > 0) {
                pdf.addPage(612, 791); //8.5" x 11" in pts (in*72)
            }
            //! now we declare that we're working on that page
            pdf.setPage(i+1);
            //! now we add content to that page!
            pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width*.62), (height*.62));

        }
        //! after the for loop is finished running, we save the pdf.
        pdf.save(pdffilename);
    }
  });
}

function makePDFreport(elementid,pdffilename) {

    var quotes = $(elementid)[0]; 

    html2canvas(quotes, {
        onrendered: function(canvas) {

        //! MAKE YOUR PDF
        var pdf = new jsPDF('l', 'pt', 'legal');

        for (var i = 0; i <= quotes.clientHeight/980; i++) {
            //! This is all just html2canvas stuff
            var srcImg  = canvas;
            var sX      = 0;
            var sY      = 980*i;  
            var sWidth  = 1800;
            var sHeight = 980;
            var dX      = 0;
            var dY      = 0;
            var dWidth  = 1800;
            var dHeight = 980;

            window.onePageCanvas = document.createElement("canvas");
            onePageCanvas.setAttribute('width', 1800);
            onePageCanvas.setAttribute('height', 980);
            var ctx = onePageCanvas.getContext('2d');
            // details on this usage of this function: 
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
            ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

            // document.body.appendChild(canvas);
            var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

            var width         = onePageCanvas.width;
            var height        = onePageCanvas.clientHeight;

            //! If we're on anything other than the first page,
            // add another page
            if (i > 0) {
                pdf.addPage(612, 791); //8.5" x 11" in pts (in*72)
            }
            //! now we declare that we're working on that page
            pdf.setPage(i+1);
            //! now we add content to that page!
            pdf.addImage(canvasDataURL, 'PNG', 10, 10, (width*.62), (height*.62));

        }
        //! after the for loop is finished running, we save the pdf.
        pdf.save(pdffilename);
		
		$(elementid).addClass('hide');
		
    }
  });
}

 
function dateformatlongfield(datestr){ 
	if(datestr!='' && datestr!=null && typeof datestr !='undefined'){
		 datestr=datestr.replace('+00',' ');
		if(parseInt(COMPANYDATEFORMAT)>0){
			 var formatindex=parseInt(COMPANYDATEFORMAT)-1;
			 var dateformat=DATEFORMATLIST[formatindex];
		 }else{
			 var dateformat=DATEFORMATLIST[0];
		 } 
		 if(parseInt(COMPANYTIMEFORMAT)>0){
			 var Tformatindex=parseInt(COMPANYTIMEFORMAT)-1;
			 var timmeformat=TIMEFORMATLIST[Tformatindex];
		 }else{
			 var timmeformat=TIMEFORMATLIST[0];
		 } 
		return $.format.date(new Date(datestr.substr(0, 4), (datestr.substr(5, 2)-1), datestr.substr(8, 2), datestr.substr(11, 2), datestr.substr(14, 2), datestr.substr(17, 2)), dateformat+" "+timmeformat); 
	}else{
		return '';
	} 
} 
function dateformatlong(datestr){ 
	if(datestr!='' && datestr!=null && typeof datestr !='undefined'){
		 datestr=datestr.replace('+00',' ');
		if(parseInt(COMPANYDATEFORMAT)>0){
			 var formatindex=parseInt(COMPANYDATEFORMAT)-1;
			 var dateformat=DATEFORMATLIST[formatindex];
		 }else{
			 var dateformat=DATEFORMATLIST[0];
		 } 
		if(parseInt(COMPANYTIMEFORMAT)>0){
			 var Tformatindex=parseInt(COMPANYTIMEFORMAT)-1;
			 var timmeformat=TIMEFORMATLIST[Tformatindex];
		 }else{
			 var timmeformat=TIMEFORMATLIST[0];
		 }	
		return $.format.date(new Date(datestr.substr(0, 4), (datestr.substr(5, 2)-1), datestr.substr(8, 2), datestr.substr(11, 2), datestr.substr(14, 2), datestr.substr(17, 2)), dateformat+" "+timmeformat); 
	}else{
		return '';
	} 
} 
function timeformatlong(datestr){ 
	if(datestr!='' && datestr!=null && typeof datestr !='undefined'){
		 datestr=datestr.replace('+00',' '); 
		 if(parseInt(COMPANYTIMEFORMAT)>0){
			 var Tformatindex=parseInt(COMPANYTIMEFORMAT)-1;
			 var timmeformat=TIMEFORMATLIST[Tformatindex];
		 }else{
			 var timmeformat=TIMEFORMATLIST[0];
		 }
		 
		return $.format.date(new Date(datestr.substr(0, 4), (datestr.substr(5, 2)-1), datestr.substr(8, 2), datestr.substr(11, 2), datestr.substr(14, 2), datestr.substr(17, 2)), timmeformat); 
	}else{
		return '';
	} 
}
function dateformatshort(datestr){ 
	if(datestr!='' && datestr!=null && typeof datestr !='undefined'){ 
		 if(parseInt(COMPANYDATEFORMAT)>0){
			 var formatindex=parseInt(COMPANYDATEFORMAT)-1;
			 var dateformat=DATEFORMATLIST[formatindex];
		 }else{
			 var dateformat=DATEFORMATLIST[0];
		 }
		return $.format.date(new Date(datestr.substr(0, 4), (datestr.substr(5, 2)-1), datestr.substr(8, 2)), dateformat); 
	}else{
		return '';
	} 
}
function dateformatshortfield(datestr){ 
	if(datestr!='' && datestr!=null && typeof datestr !='undefined'){ 
		 if(parseInt(COMPANYDATEFORMAT)>0){
			 var formatindex=parseInt(COMPANYDATEFORMAT)-1;
			 var dateformat=DATEFORMATLIST[formatindex];
		 }else{
			 var dateformat=DATEFORMATLIST[0];
		 }
		return $.format.date(new Date(datestr.substr(0, 4), (datestr.substr(5, 2)-1), datestr.substr(8, 2)), dateformat); 
	}else{
		return '';
	} 
}
var POCARRIERCOUNTRY=0;
function getcompanytypedropdown(drodownid){
	
	$.ajax({
				
		type : 'GET',
		url  : APIURL+'listings/company_type',
		 data:{ 
		  'X-API-KEY': APIKEY
		},
		headers: {"token": APITOKEN}, 
		success :  function(response)
		   {	
			 
				if(response.status == true){
					items=response.data;
					$(drodownid).html('');
					$(drodownid).html('<option value="">Select company type</option>');
					$.each(items, function (i, item) {
						$(drodownid).append($('<option>', { 
							value: item.id,
							text : item.name 
						}));
					});   
				}else{
					$(drodownid).html('');
					$(drodownid).html('<option value="">Select company type</option>');
				}
		  },
		  error: function (xhr, ajaxOptions, thrownError) {
				var messages=xhr.responseJSON.error.message;
					if(messages=='AccessToken Error'){
						window.location.href=MAINURL+"lockme";
						return;
					}else{
						/* if(typeof messages =='string'){
							failureAlert(messages); 
						}else{
							$.each(messages, function(i, item) { 
								
								failureAlert(item); 
							});  
						} */
						
					}
		  }
		});
}

function getproductsubtypedropdown(typeid,dropdownid){
	$.ajax({ 	
		type : 'GET',
		url  : APIURL+'product_type?parent_id='+typeid,
		 data:{ 
		  'X-API-KEY': APIKEY
		},
		headers: {"token": APITOKEN}, 
		success :  function(response)
		   {	
			 
				if(response.status == true){
					items=response.data;
					$(dropdownid).html('');
					$(dropdownid).append('<option value="">Select Equipment Type</option>');
					$.each(items, function (i, item) { 
						$(dropdownid).append('<option value="'+item.id+'">'+item.name+'</option>');
						 
					});   
				}else{
					$(dropdownid).html('');
					$(dropdownid).append('<option value="">Select Equipment Type</option>');
				}
		  },
		  error: function (xhr, ajaxOptions, thrownError) {
				var messages=xhr.responseJSON.error.message;
					if(messages=='AccessToken Error'){
						window.location.href=MAINURL+"lockme";
						return;
					}else{
						/* if(typeof messages =='string'){
							failureAlert(messages); 
						}else{
							$.each(messages, function(i, item) { 
								
								failureAlert(item); 
							});  
						} */
						
					}
		  }
		});
	
}
function getproductsdropdown(companyid,dropdownid){
	$.ajax({ 	
		type : 'GET',
		url  : APIURL+'company/product/'+companyid,
		 data:{ 
			'is_linked':1,
			'is_po_master': 1,
			'X-API-KEY': APIKEY
		},
		headers: {"token": APITOKEN}, 
		success :  function(response)
		   {	
			 
				if(response.status == true){
					items=response.data;
					$(dropdownid).html('');
					$(dropdownid).append('<option value="" unit="">Select Product</option>');
					$.each(items, function (i, item) { 
						$(dropdownid).append('<option value="'+item.id+'" unit="'+item.unit_type_name+'">'+item.name+'</option>');
					});   
				}else{
					$(dropdownid).html('');
					$(dropdownid).append('<option value="" unit="">Select Product</option>');
				}
		  },
		  error: function (xhr, ajaxOptions, thrownError) {
				$(dropdownid).html('');
				$(dropdownid).append('<option value="" unit="">Select Product</option>');
				var messages=xhr.responseJSON.error.message;
					if(messages=='AccessToken Error'){
						window.location.href=MAINURL+"lockme";
						return;
					}else{
						/* if(typeof messages =='string'){
							failureAlert(messages); 
						}else{
							$.each(messages, function(i, item) { 
								
								failureAlert(item); 
							});  
						} */
						
					}
		  }
		});
	
}
function getmasterproductsdropdown(companyid,dropdownid){
	$.ajax({ 	
		type : 'GET',
		url  : APIURL+'company/product/'+companyid,
		 data:{ 
			'is_linked':1, 
			'X-API-KEY': APIKEY
		},
		headers: {"token": APITOKEN}, 
		success :  function(response)
		   {	
			 
				if(response.status == true){
					items=response.data;
					$(dropdownid).html('');
					$(dropdownid).append('<option value="" unit="">Select Product</option>');
					$.each(items, function (i, item) { 
						$(dropdownid).append('<option value="'+item.id+'" unit="'+item.unit_type_name+'">'+item.name+'</option>');
					});   
				}else{
					$(dropdownid).html('');
					$(dropdownid).append('<option value="" unit="">Select Product</option>');
				}
		  },
		  error: function (xhr, ajaxOptions, thrownError) {
				$(dropdownid).html('');
				$(dropdownid).append('<option value="" unit="">Select Product</option>');
				var messages=xhr.responseJSON.error.message;
					if(messages=='AccessToken Error'){
						window.location.href=MAINURL+"lockme";
						return;
					}else{
						/* if(typeof messages =='string'){
							failureAlert(messages); 
						}else{
							$.each(messages, function(i, item) { 
								
								failureAlert(item); 
							});  
						} */
						
					}
		  }
		});
	
}
function getterminalsdropdown(companyid,dropdownid){
	$.ajax({ 	
		type : 'GET',
		url  : APIURL+'company/terminal/'+companyid,
		 data:{ 
			'is_linked':1, 
			'X-API-KEY': APIKEY
		},
		headers: {"token": APITOKEN}, 
		success :  function(response)
		   {	
			 
				if(response.status == true){
					items=response.data;
					$(dropdownid).html('');
					$(dropdownid).append('<option value="">Select Terminal</option>');
					$.each(items, function (i, item) { 
						$(dropdownid).append('<option value="'+item.id+'">'+item.name+'</option>');
						 
					});   
				}else{
					$(dropdownid).html('');
					$(dropdownid).append('<option value="">Select Terminal</option>');
				}
		  },
		  error: function (xhr, ajaxOptions, thrownError) {
				var messages=xhr.responseJSON.error.message;
					if(messages=='AccessToken Error'){
						window.location.href=MAINURL+"lockme";
						return;
					}else{
						/* if(typeof messages =='string'){
							failureAlert(messages); 
						}else{
							$.each(messages, function(i, item) { 
								
								failureAlert(item); 
							});  
						} */
						
					}
		  }
		});
	
}
function getponotes(companyid){
	$.ajax({ 	
		type : 'GET',
		url  : APIURL+'po_notes?company_id='+companyid,
		 data:{ 
			'is_linked':1,
			'X-API-KEY': APIKEY
		},
		headers: {"token": APITOKEN}, 
		success :  function(response)
		   {	
			 
				if(response.status == true){
					items=response.data;
					 $('#special_notes').val(items.special_notes); 
					 $('#accepted_notes').val(items.accepted_notes); 
					 $('#loader_notes').val(items.loader_notes); 
					 $('#intransit_notes').val(items.intransit_notes); 
					 $('#atdestination_note').val(items.atdestination_note); 
					 $('#notesid').val(items.id);  
				}else{
					 
				}
		  },
		  error: function (xhr, ajaxOptions, thrownError) {
			var messages=xhr.responseJSON.error.message;
					if(messages=='AccessToken Error'){
						window.location.href=MAINURL+"lockme";
						return;
					}else{
						if(typeof messages =='string'){
							failureAlert(messages); 
						}else{
							$.each(messages, function(i, item) { 
								
								failureAlert(item); 
							});  
						}
						
					}	
		  }
		});
	
}
function getpoaddnotes(companyid){
	$.ajax({ 	
		type : 'GET',
		url  : APIURL+'po_notes?company_id='+companyid,
		 data:{  
			'X-API-KEY': APIKEY
		},
		headers: {"token": APITOKEN}, 
		success :  function(response)
		   {	
			 
				if(response.status == true){
					items=response.data;
					 
					 $('#job-notes-form #special_notes').val(items.special_notes); 
					 $('#job-notes-form #accepted_notes').val(items.accepted_notes); 
					 $('#job-notes-form #loader_notes').val(items.loader_notes); 
					 $('#job-notes-form #intransit_notes').val(items.intransit_notes); 
					 $('#job-notes-form #atdestination_note').val(items.atdestination_note);  
				} 
		  },
		  error: function (xhr, ajaxOptions, thrownError) {
			var messages=xhr.responseJSON.error.message;
					if(messages=='AccessToken Error'){
						window.location.href=MAINURL+"lockme";
						return;
					}else{
						if(typeof messages =='string'){
							failureAlert(messages); 
						}else{
							$.each(messages, function(i, item) { 
								
								failureAlert(item); 
							});  
						}
						
					}	
		  }
		});
	
}
function getcompanyroledropdown(typeid,dropdownid,company_type_id){
	$.ajax({ 	
		type : 'GET',
		url  : APIURL+'listings/company_role/'+typeid+'/?company_type='+company_type_id,
		 data:{ 
		  'X-API-KEY': APIKEY
		},
		headers: {"token": APITOKEN}, 
		success :  function(response)
		   {	
			 
				if(response.status == true){
					items=response.data;
					$(dropdownid).html('');
					$(dropdownid).append('<option value="">Select User Group</option>'); 
					$.each(items, function (i, item) { 
						$(dropdownid).append('<option value="'+item.id+'">'+item.name+'</option>'); 
					});   
				}else{
					$(dropdownid).html('');
					$(dropdownid).append('<option value="">Select User Group</option>');
				}
		  },
		  error: function (xhr, ajaxOptions, thrownError) {
				var messages=xhr.responseJSON.error.message;
					if(messages=='AccessToken Error'){
						window.location.href=MAINURL+"lockme";
						return;
					}else{
						/* if(typeof messages =='string'){
							failureAlert(messages); 
						}else{
							$.each(messages, function(i, item) { 
								
								failureAlert(item); 
							});  
						} */
						
					}
		  }
		});
	
}
function addproductchange(ele,companyid){
	var isprivate=$(ele).find("option:selected").attr('hassubtype');
	var typeid=$(ele).find("option:selected").val();
	 
	if(isprivate==1){
		/* addnewproduct-form */
		var typename=$(ele).find("option:selected").text();
		
		$('.producttype').html('<span class="infotype"><i class="material-icons">info</i> Please enter the '+typename+' information.</span>');
		$('.producttype').show();
		
		$('#steponeform').addClass('hide');
		$('#addnewproduct-form').removeClass('hide');
		getproductsubtypedropdown(typeid,'#addnewproduct_type_id');
		
		
	}else{
		 if ( $.fn.DataTable.isDataTable('#productsunlinklisting') ) {
		  $('#productsunlinklisting').DataTable().destroy();
		}
		var typename=$(ele).find("option:selected").text();
		$('.producttype').html('<span class="typeinfo"><i class="material-icons">info</i> Please select the product(s) from the list.</span>');
		$('.producttype').show();
		
		$.fn.dataTable.ext.errMode = 'none';
		$("#productsunlinklisting").dataTable({
					bProcessing: true, 
					"dom": "t",
					"lengthChange": false, 
					paging: false,
					info:     false,
					sServerMethod: "GET",
					"ajax": {
						"url": APIURL+"company/product/"+companyid+"?X-API-KEY="+APIKEY+"&is_linked=0&product_type_id="+typeid, 
						"contentType": "application/json",
						"type": "GET",
						headers: {"token": APITOKEN},
						dataFilter: function(data){
							var json = jQuery.parseJSON( data );
							var myjson = jQuery.parseJSON( data );
							if(json.status==true){
								myjson.recordsTotal = json.data.length;
								myjson.recordsFiltered = json.data.length;
								myjson.data = json.data; 
								return JSON.stringify( myjson ); 
							}else{
								myjson.recordsTotal = 0;
								myjson.recordsFiltered = 0;
								myjson.data = new Array(); 
								return JSON.stringify( myjson ); 
								
							}
						},
						"data": function ( d ) {
						  return JSON.stringify( d.data );
						}
					  }, 
					aoColumns: [
							{
								/* aTargets: [0],  */
								data: "id",	
								sClass:'tableCell text-center',
								mRender: function (o, v) {   
									return '<label class="md-check"><input type="checkbox" name="product_id[]" value="'+o+'" class="has-value checkproduct"><i class="dark"></i></label>';
								}   
							},
							{ data: "name" }/*,
							 { data: "product_number" }, 
							{ data: "unit_type_name" } */
						    
					]
				});
		
		$('#steponeform').addClass('hide');
		$('#addproduct-form').removeClass('hide');
	}
	
}



function driversmap(driverid){
		
	 
		reference[driverid] = database.ref('drivers/'+driverid);
		 
		reference[driverid].on("value", function(snapshot) {
			var driverdata = snapshot.val();
			if(driverdata){
				if(typeof driverdata.position !='undefined'){
					drivermarker(snapshot.key,driverdata);
				} 
			}else{
				if(typeof markerlabelArray[snapshot.key] !='undefined'){
					markerlabelArray[snapshot.key].setMap(null); 
					delete markerlabelArray[snapshot.key]; 
					markerlabelArray.splice(snapshot.key,1);
				} 
			}
			  
		});
		
		 
		
		reference[driverid].on("child_removed", function(snapshot) {
			var newPost = snapshot.val();
			  
		});
		 
	
}

function drivermarker(id,driverdata){
	/* if(infowindow!='' && infowindow!=null){ 
		infowindow.close();
	} */
	
	
	var driverposision=driverdata.position;
	var labelcalss='';
 
	if(typeof driverdata.load !='undefined'){
		
		if(driverdata.load.las==0 && driverdata.load.cs==0){ 
		
			$('.driverloadstateid'+id).removeClass('lt-bg-notassign');
			$('.driverloadstateid'+id).removeClass('lt-bg-assign'); 
			$('.driverloadstateid'+id).removeClass('lt-bg-accept');
			$('.driverloadstateid'+id).removeClass('lt-bg-terminal');
			$('.driverloadstateid'+id).removeClass('lt-bg-transit');
			$('.driverloadstateid'+id).removeClass('lt-bg-destination'); 
			$('.driverloadstateid'+id).addClass('lt-bg-notassign');
			
			
		}else if(driverdata.load.las==2 && driverdata.load.cs==0){ 
		
			$('.driverloadstateid'+id).removeClass('lt-bg-notassign');
			$('.driverloadstateid'+id).removeClass('lt-bg-assign'); 
			$('.driverloadstateid'+id).removeClass('lt-bg-accept');
			$('.driverloadstateid'+id).removeClass('lt-bg-terminal');
			$('.driverloadstateid'+id).removeClass('lt-bg-transit');
			$('.driverloadstateid'+id).removeClass('lt-bg-destination'); 
			$('.driverloadstateid'+id).addClass('lt-bg-accept');
			
			
		}else if(driverdata.load.las==2 && driverdata.load.cs==1){
			 
			
			
			$('.driverloadstateid'+id).removeClass('lt-bg-notassign');
			$('.driverloadstateid'+id).removeClass('lt-bg-assign'); 
			$('.driverloadstateid'+id).removeClass('lt-bg-accept');
			$('.driverloadstateid'+id).removeClass('lt-bg-terminal');
			$('.driverloadstateid'+id).removeClass('lt-bg-transit');
			$('.driverloadstateid'+id).removeClass('lt-bg-destination'); 
			$('.driverloadstateid'+id).addClass('lt-bg-terminal');
			
			
			
		}else if(driverdata.load.las==2 && driverdata.load.cs==2){
			$('.driverloadstateid'+id).removeClass('lt-bg-notassign');
			$('.driverloadstateid'+id).removeClass('lt-bg-assign'); 
			$('.driverloadstateid'+id).removeClass('lt-bg-accept');
			$('.driverloadstateid'+id).removeClass('lt-bg-terminal');
			$('.driverloadstateid'+id).removeClass('lt-bg-transit');
			$('.driverloadstateid'+id).removeClass('lt-bg-destination'); 
			$('.driverloadstateid'+id).addClass('lt-bg-transit'); 
			
		}else if(driverdata.load.las==2 && driverdata.load.cs==3){
			 $('.driverloadstateid'+id).removeClass('lt-bg-notassign');
			$('.driverloadstateid'+id).removeClass('lt-bg-assign'); 
			$('.driverloadstateid'+id).removeClass('lt-bg-accept');
			$('.driverloadstateid'+id).removeClass('lt-bg-terminal');
			$('.driverloadstateid'+id).removeClass('lt-bg-transit');
			$('.driverloadstateid'+id).removeClass('lt-bg-destination'); 
			$('.driverloadstateid'+id).addClass('lt-bg-destination');
			
		}else{
			$('.driverloadstateid'+id).removeClass('lt-bg-notassign');
			$('.driverloadstateid'+id).removeClass('lt-bg-assign'); 
			$('.driverloadstateid'+id).removeClass('lt-bg-accept');
			$('.driverloadstateid'+id).removeClass('lt-bg-terminal');
			$('.driverloadstateid'+id).removeClass('lt-bg-transit');
			$('.driverloadstateid'+id).removeClass('lt-bg-destination'); 
			$('.driverloadstateid'+id).addClass('lt-bg-notassign');
			
		}
		
		
		
		
		
		if(driverdata.status.onduty==0){ 
			/* var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/truck-6.png'; */
			var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/unavailable-pin.png';
			labelcalss +='gray';
			
			$('.driverstateid'+id).removeClass('lt-bg-available');
			$('.driverstateid'+id).removeClass('lt-bg-haulingdriver');
			$('.driverstateid'+id).removeClass('lt-bg-unavailable');
			$('.driverstateid'+id).addClass('lt-bg-unavailable');
			
			 
			
			if(infowindow!='' && infowindow!=null){ 
				infowindow.close();
			}
		}else if(driverdata.load.las==0){
			/* var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/truck-7.png'; */
			var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/available-pin.png';
			labelcalss +='bg-light-green';
			
			$('.driverstateid'+id).removeClass('lt-bg-available'); 
			$('.driverstateid'+id).removeClass('lt-bg-haulingdriver');
			$('.driverstateid'+id).removeClass('lt-bg-unavailable');
			$('.driverstateid'+id).addClass('lt-bg-available'); 
			
			
		}else if(driverdata.load.las==1){
			/* var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/truck-3.png'; */
			var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/hauling-pin.png';
			labelcalss +=' warning';
			 
			$('.driverstateid'+id).removeClass('lt-bg-available'); 
			$('.driverstateid'+id).removeClass('lt-bg-haulingdriver');
			$('.driverstateid'+id).removeClass('lt-bg-unavailable');
			$('.driverstateid'+id).addClass('lt-bg-haulingdriver'); 
			
			
			
		}else if(driverdata.load.las==2){
			/* var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/truck-1.png'; */
			var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/hauling-pin.png';
			labelcalss +='success';
			
			$('.driverstateid'+id).removeClass('lt-bg-available'); 
			$('.driverstateid'+id).removeClass('lt-bg-haulingdriver');
			$('.driverstateid'+id).removeClass('lt-bg-unavailable');
			$('.driverstateid'+id).addClass('lt-bg-haulingdriver');
			
		}else if(driverdata.load.las==3){
			/* var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/truck-1.png'; */
			var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/hauling-pin.png';
			labelcalss +='success';
			
			$('.driverstateid'+id).removeClass('lt-bg-available'); 
			$('.driverstateid'+id).removeClass('lt-bg-haulingdriver');
			$('.driverstateid'+id).removeClass('lt-bg-unavailable');
			$('.driverstateid'+id).addClass('lt-bg-haulingdriver');
			
		}else{
			/* var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/truck-5.png'; */
			var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/available-pin.png';
			labelcalss +='danger';
			
			$('.driverstateid'+id).removeClass('lt-bg-available'); 
			$('.driverstateid'+id).removeClass('lt-bg-haulingdriver');
			$('.driverstateid'+id).removeClass('lt-bg-unavailable');
			$('.driverstateid'+id).addClass('lt-bg-available');
			
		} 
	}else{
		/* var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/truck-7.png'; */
		var drivericon = MAINURL +'mainassets/images/legends/trucks/drivers-pins/unavailable-pin.png';
			labelcalss +='bg-light-green missingloads';
			
			$('.driverstateid'+id).removeClass('lt-bg-available'); 
			$('.driverstateid'+id).removeClass('lt-bg-haulingdriver');
			$('.driverstateid'+id).removeClass('lt-bg-unavailable');
			$('.driverstateid'+id).addClass('lt-bg-unavailable');
			
	} 
	
	if(typeof AllCarrierdrivers[id] != 'undefined'){ 
		
		if(typeof markerlabelArray[parseInt(id)] != 'undefined'){
			 var marker = markerlabelArray[parseInt(id)];
			 
			$('.drivermarker'+id).removeClass('gray');
			$('.drivermarker'+id).removeClass('warning');
			$('.drivermarker'+id).removeClass('success');
			$('.drivermarker'+id).removeClass('bg-light-green');
			$('.drivermarker'+id).removeClass('missingloads');
			
			
			$('.drivermarker'+id).addClass(labelcalss);
			
 
			
		}else{
			
			if(typeof markerlabelArray[parseInt(id)] != 'undefined'){
				var marker = markerlabelArray[parseInt(id)];
			 
				$('.drivermarker'+id).removeClass('gray');
				$('.drivermarker'+id).removeClass('warning');
				$('.drivermarker'+id).removeClass('success');
				$('.drivermarker'+id).removeClass('bg-light-green');
				$('.drivermarker'+id).removeClass('missingloads');
				
				$('.drivermarker'+id).addClass(labelcalss);
			}else{
				var drivernamewidth=getColumnWidth('my-map-label',avatarwordmap(AllCarrierdrivers[id]));
				if(drivernamewidth>0){
					drivernamewidth=((parseFloat(drivernamewidth)/2)+6.593);
				}else{
					drivernamewidth=0;
				}
				 
				var marker = markerlabelArray[parseInt(id)] =  new google.maps.Marker({
													   position: new google.maps.LatLng(driverposision.lat, driverposision.lng),
													   draggable: false,
													   raiseOnDrag: false,
													   map: firbasemap,  
													   icon:drivericon,
													   id:id,
													   title:id,
													   animation: null,
													   label:{text:avatarwordmap(AllCarrierdrivers[id]),color:"white",fontSize: "12px",fontWeight: "bold"}, 
													   labelClass: 'my-map-label  drivermarker'+id  
													 });
					if (clustermarkers) {
						clustermarkers.clearMarkers();
					}	
					
						 
													 
					if(infowindow!='' && infowindow!=null){ 
						infowindow.close();
					}									 
				 google.maps.event.addListener(marker, 'click', function() {
					if(infowindow!='' && infowindow!=null){
						
						infowindow.close();
					}
					
					
					
					 /* infowindow =  new google.maps.InfoWindow({
											content: '',
											maxWidth: 600
										}); */
						/*
						,pixelOffset: new google.maps.Size(-27, -150)
						*/				
					var myOptions = {
						 content: ''
						,disableAutoPan: false
						,maxWidth: 0
						,pixelOffset: new google.maps.Size(30, -140)
						,zIndex: null
						,boxStyle: { 
						  background: "#fff"
						  ,opacity: 1
						  ,margin: '0px 0px 15px 0px'
						  ,minWidth: "335px"
						  ,maxWidth: "600px"
						 }
						,closeBoxMargin: "10px 10px 0px 0px"
						,closeBoxURL: MAINURL+"mainassets/images/tooltip_close.png"
						,infoBoxClearance: new google.maps.Size(1, 1)
						,isHidden: false
						,pane: "floatPane"
						,enableEventPropagation: false
					};	

					 infowindow = new InfoBox(myOptions);
					google.maps.event.addListener(infowindow,'closeclick',function(){
					   $('.loads-list #driverdetailview .driverlistingview .driverlistitem').removeClass('active');
					});	
					load_content(firbasemap,marker,infowindow);
					
					
					
				});
				if(typeof overlayspider != 'undefined'){
					overlayspider.addMarker(marker); 
				}
				 
				var mcOptions = {gridSize: 50, maxZoom: 17,zoomOnClick: true};
				clustermarkers=new MarkerClusterer(firbasemap, markerlabelArray,mcOptions);	
			}
			
		}
	 
		var icon = {
			url: drivericon, 
			scaledSize:new google.maps.Size(50,55),
			labelOrigin:new google.maps.Point(25,24),
			orgin:new google.maps.Point(0,0),
			anchor:new google.maps.Point(25,52) 
		};
		marker.setPosition(new google.maps.LatLng(driverposision.lat, driverposision.lng));
		marker.setIcon(icon); 
		marker.labelClass='my-map-label  drivermarker'+id+' '+labelcalss; 
		
		/* if(typeof driverdata.load !='undefined'){
			if(typeof lastloadstate[id]!= 'undefined' && lastloadstate[id]!=driverdata.load.las){
				lastloadstate[id]=driverdata.load.las;
				getjobdrivers(0);
			}else if(typeof lastloadstate[id] == 'undefined'){
				lastloadstate[id]=driverdata.load.las;
				getjobdrivers(0);
			}
		} */
			 	
	} 
}


function getjobsformaindashboard(){
	 $.ajax({ 
			type : 'GET',
			url  : APIURL+'jobs/',
			 data:{ 
			  'list': 1,
			  'X-API-KEY': APIKEY
			},
			headers: {"token": APITOKEN}, 
			success :  function(response)
			   {	 
					$('#maindashboarddesign').removeClass('hide');
					$('#maindashboarddesignempty').removeClass('hide');
					if(response.status == false){ 
						$('.toptoolbar').addClass('hide');
						$('#maindashboarddesign').addClass('hide');
						if (inArray(4, USERPERM) ) {
							  $('#maindashboarddesignempty').html('<div class="empty-box-center"><div class="empty-box dashboard"><div class="box-wrap"><div class="box"><div class="defaultcanvas-text"><i class="fa fa-exclamation-triangle"></i><h3>You do not have any Jobs yet!</h3><p>In order to start generating reports with PropDispatch, start adding your Jobs.</p><br><a ref="#" data-toggle="modal" data-target="#add_job" title="Add Job" class="btn btn-green"><i class="material-icons">add</i> Add Job</a></div></div></div></div></div>');
						  }else{
							  $('#maindashboarddesignempty').html('<div class="empty-box-center"><div class="empty-box dashboard"><div class="box-wrap"><div class="box"><div class="defaultcanvas-text"><i class="fa fa-exclamation-triangle"></i><h3>You do not have any Jobs yet!</h3><p>In order to start generating reports with PropDispatch, start adding your Jobs.</p></div></div></div></div></div>');
						  }  
					}else{
						$('.toptoolbar').removeClass('hide');
						$('#maindashboarddesign').removeClass('hide');
						$('#maindashboarddesignempty').addClass('hide');
						
					} 
			  },
			  error: function (xhr, ajaxOptions, thrownError) {
				  $('.toptoolbar').addClass('hide');
				  $('#maindashboarddesign').addClass('hide');
				  $('#maindashboarddesignempty').removeClass('hide');
				  if (inArray(4, USERPERM) ) {
					  $('#maindashboarddesignempty').html('<div class="empty-box-center"><div class="empty-box dashboard"><div class="box-wrap"><div class="box"><div class="defaultcanvas-text"><i class="fa fa-exclamation-triangle"></i><h3>You do not have any Jobs yet!</h3><p>In order to start generating reports with PropDispatch, start adding your Jobs.</p><br><a ref="#" data-toggle="modal" data-target="#add_job" title="Add Job" class="btn btn-green"><i class="material-icons">add</i> Add Job</a></div></div></div></div></div>');
				  }else{
					  $('#maindashboarddesignempty').html('<div class="empty-box-center"><div class="empty-box dashboard"><div class="box-wrap"><div class="box"><div class="defaultcanvas-text"><i class="fa fa-exclamation-triangle"></i><h3>You do not have any Jobs yet!</h3><p>In order to start generating reports with PropDispatch, start adding your Jobs.</p></div></div></div></div></div>');
				  }
				   
				  
					var messages=xhr.responseJSON.error.message;
					if(messages=='AccessToken Error'){
						window.location.href=MAINURL+"lockme";
						return;
					}
			  }
			});
	return false;
	
}


function jobsnotexist(responsedetail){
	if (inArray(4, USERPERM) ) {
		$('#jobslisting').html('<div class="empty-box-center"><div class="empty-box nopojobs"><div class="box-wrap"><div class="box"><div class="defaultcanvas-text"><i class="fa fa-exclamation-triangle"></i><h3>You do not have any Jobs yet!</h3><p>In order to start generating reports with PropDispatch, start adding your Jobs.</p><br><a ref="#"  data-toggle="modal" data-target="#add_job" title="Add Job" class="btn btn-green"><i class="material-icons">add</i> Add Job</a></div></div></div></div></div>');
	}else{
		$('#jobslisting').html('<div class="empty-box-center"><div class="empty-box nopojobs"><div class="box-wrap"><div class="box"><div class="defaultcanvas-text"><i class="fa fa-exclamation-triangle"></i><h3>You do not have any Jobs yet!</h3><p>In order to start generating reports with PropDispatch, start adding your Jobs.</p></div></div></div></div></div>');
	}
	
	$('#jobslisting').parent().parent().addClass('norecords');
	 
	
	if(typeof responsedetail.total != 'undefined' && responsedetail.total==0){
		$('.toptoolbar').addClass('hide');
		$('#jobslisting').removeClass('hide');
	}else if(typeof responsedetail.total == 'undefined'){
		$('.toptoolbar').addClass('hide');
		$('#jobslisting').removeClass('hide');
	}else if(typeof responsedetail.total != 'undefined' && responsedetail.total>0){
		$('.toptoolbar').removeClass('hide');
		$('#jobslisting').addClass('hide');
	}else{
		$('.toptoolbar').addClass('hide');
		$('#jobslisting').removeClass('hide');	
	}
	
	
}
function potrackernotexist(responsedetail){
	
		$('#pomasterlisting').html('<div class="empty-box-center"><div class="empty-box nopotracker"><div class="box-wrap"><div class="box"><div class="defaultcanvas-text"><i class="fa fa-exclamation-triangle"></i><h3>You do not have any PO yet!</h3><p class="hide">In order to start generating reports with PropDispatch, start adding your PO.</p><br><a ref="#"  data-toggle="modal" data-target="#add_pomaster" title="Add PO" class="btn btn-green"><i class="material-icons">add</i> Add PO</a></div></div></div></div></div>');
	 
	if(typeof responsedetail.total != 'undefined' && responsedetail.total==0){
		$('.toptoolbar').addClass('hide');
		$('#pomasterlisting').removeClass('hide');
	}else if(typeof responsedetail.total == 'undefined'){
		$('.toptoolbar').addClass('hide');
		$('#pomasterlisting').removeClass('hide');
	}else if(typeof responsedetail.total != 'undefined' && responsedetail.total>0){
		$('.toptoolbar').removeClass('hide');
		$('#pomasterlisting').addClass('hide');
	}else{
		$('.toptoolbar').addClass('hide');
		$('#pomasterlisting').removeClass('hide');	
	}
	/* $('.toptoolbar').addClass('hide'); */
	$('#pomasterlisting').parent().parent().addClass('norecords'); 
	
}
function carriersnotexist(responsedetail){
	var subtitile='';
	if(COMPANY_TYPE_ID==2){
		subtitile=' Sub-';
	}
	if (inArray(60, USERPERM) ) {
		$('#carrierlisting').html('<div class="empty-box-center"><div class="empty-box nopocarrier"><div class="box-wrap"><div class="box"><div class="defaultcanvas-text"><i class="fa fa-exclamation-triangle"></i><h3>You do not have any Carrier yet!</h3><p class="hide">In order to start generating reports with PropDispatch, start adding your '+subtitile+'Carrier.</p><br><a ref="#"  data-toggle="modal" data-target="#add_carrier" title="Add '+subtitile+'Carrier" class="btn btn-green"><i class="material-icons">add</i> Add '+subtitile+'Carrier</a></div></div></div></div></div>');
	}else{
		$('#carrierlisting').html('<div class="empty-box-center"><div class="empty-box nopocarrier"><div class="box-wrap"><div class="box"><div class="defaultcanvas-text"><i class="fa fa-exclamation-triangle"></i><h3>You do not have any '+subtitile+'Carrier yet!</h3><p class="hide">In order to start generating reports with PropDispatch, start adding your '+subtitile+'Carrier.</p></div></div></div></div></div>');
	}
	
	if(typeof responsedetail.total != 'undefined' && responsedetail.total==0){
		$('.toptoolbar').addClass('hide');
		$('#carrierlisting').removeClass('hide');
	}else if(typeof responsedetail.total == 'undefined'){
		$('.toptoolbar').addClass('hide');
		$('#carrierlisting').removeClass('hide');
	}else if(typeof responsedetail.total != 'undefined' && responsedetail.total>0){
		$('.toptoolbar').removeClass('hide');
		$('#carrierlisting').addClass('hide');
	}else{
		$('.toptoolbar').addClass('hide');
		$('#carrierlisting').removeClass('hide');	
	}
	
	$('#carrierlisting').parent().parent().addClass('norecords');
	 
}
function driversnotexist(responsedetail){
	if (inArray(71, USERPERM) ) {
		$('#driverslisting').html('<div class="empty-box-center"><div class="empty-box nopodrivers"><div class="box-wrap"><div class="box"><div class="defaultcanvas-text"><i class="fa fa-exclamation-triangle"></i><h3>You do not have any Drivers yet!</h3><p class="hide">In order to start generating reports with PropDispatch, start adding your Drivers.</p><br><a ref="#"  data-toggle="modal" data-target="#addDriver" title="Add Driver" class="btn btn-green"><i class="material-icons">add</i> Add Driver</a></div></div></div></div></div>');
		
	}else{
		$('#driverslisting').html('<div class="empty-box-center"><div class="empty-box nopodrivers"><div class="box-wrap"><div class="box"><div class="defaultcanvas-text"><i class="fa fa-exclamation-triangle"></i><h3>You do not have any Drivers yet!</h3><p class="hide">In order to start generating reports with PropDispatch, start adding your Drivers.</p></div></div></div></div></div>');
		
	}
	
	if(typeof responsedetail.total != 'undefined' && responsedetail.total==0){
		$('.toptoolbar').addClass('hide');
		$('#driverslisting').removeClass('hide');
	}else if(typeof responsedetail.total == 'undefined'){
		$('.toptoolbar').addClass('hide');
		$('#driverslisting').removeClass('hide');
	}else if(typeof responsedetail.total != 'undefined' && responsedetail.total>0){
		$('.toptoolbar').removeClass('hide');
		$('#driverslisting').addClass('hide');
	}else{
		$('.toptoolbar').addClass('hide');
		$('#driverslisting').removeClass('hide');	
	}
		 
		$('#driverslisting').parent().parent().addClass('norecords');
	
}

function newjobcreated(){
	if(newjobs){
		newjobs.off();
	}
	newjobs = database.ref("visibilejobs");
	  	
	if(COMPANY_TYPE_ID==2){
		newjobs.orderByChild("c_"+CURRENT_COMPANY_ID).equalTo(1).on("child_added", function(snapshot) {
			var newPost = snapshot.val();
			if(jobchangedlistineer && jobremoveactive==0){
				jobchangedlistineer	= false;	
				jobremoveactive=1;					
				 activejobid=$('.list#jobslisting .list-item.active .list-left').attr('id'); 
				 getalljobslisting(); 
			} 
		});
		newjobs.orderByChild("c_"+CURRENT_COMPANY_ID).equalTo(1).on("child_removed", function(snapshot) {
			var newPost = snapshot.val();
			if(jobchangedlistineer && jobremoveactive==0){
				jobchangedlistineer	= false;	
				jobremoveactive=1;					
				 activejobid=$('.list#jobslisting .list-item.active .list-left').attr('id'); 
				 getalljobslisting(); 
			} 
		});
	}else{
		newjobs.orderByChild("u_"+CURRENT_M_ID).equalTo(1).on("child_added", function(snapshot) {
			var newPost = snapshot.val();
			 
			if(jobchangedlistineer && jobremoveactive==0){
				jobchangedlistineer	= false;	
				jobremoveactive=1;					
				 activejobid=$('.list#jobslisting .list-item.active .list-left').attr('id'); 
				 getalljobslisting(); 
			} 
		});
		newjobs.orderByChild("u_"+CURRENT_M_ID).equalTo(1).on("child_removed", function(snapshot) {
			var newPost = snapshot.val();
		 
			/* if(jobchangedlistineer && jobremoveactive==0){ */
				jobchangedlistineer	= false;	
				jobremoveactive=1;					
				 activejobid=$('.list#jobslisting .list-item.active .list-left').attr('id'); 
				 getalljobslisting(); 
			/* }  */
		});
	}	  
		 
	
	
}


function changedriveronoffdutymap(elestate,recid,tableid){
		var state=0;
	if($(elestate).is(':checked')){
		 state=1;
	 }else{
		 state=0;
	 }
	
	 $.ajax({
				
			type : 'PUT',
			url  : APIURL+'user/duty_status/'+recid,
			 data:{
			  'on_duty': state,
			  'X-API-KEY': APIKEY
			},
			headers: {"token": APITOKEN}, 
			success :  function(response)
			   {	
				 
					if(response.status == true){
						refreshtable(tableid);
						successAlert(response.message); 
						
						if($('.onoffdutymap').length>0){
							
							
							if(state==1){
								$('.onoffdutymap span').html('Available');
								$('.onoffdutymap').removeClass('offduty');
								$('.onoffdutymap').addClass('onduty');
								$('.onoffdutymap input').attr('checked','checked');
							}else{
								$('.onoffdutymap span').html('Unavailable');
								$('.onoffdutymap').addClass('offduty');
								$('.onoffdutymap').removeClass('onduty');
								$('.onoffdutymap input').removeAttr('checked');
							}
						}
					}else{
						failureAlert(response.message);
					}
			  },
			  error: function (xhr, ajaxOptions, thrownError) {
				  var messages=xhr.responseJSON.error.message;
					if(messages=='AccessToken Error'){
						window.location.href=MAINURL+"lockme";
						return;
					}else{
						if(typeof messages =='string'){
							failureAlert(messages); 
						}else{
							$.each(messages, function(i, item) { 
								
								failureAlert(item); 
							});  
						}
						
					}  
			  }
			});
	return false;
}

function changekeanerule(ele){
	if($('#is_keane_apply').is(':checked')){ 
		$('.applykeaneruleval').removeClass('hide');
		$('.applykeanerulesyesno').removeClass('noselect'); 
		$('.applykeanerulesyesno').addClass('yesselect'); 
		$('.applykeanerulesyesno').html('Yes');
	}else{
		$('.applykeaneruleval').addClass('hide');
		$('.applykeanerulesyesno').addClass('noselect'); 
		$('.applykeanerulesyesno').removeClass('yesselect'); 
		$('.applykeanerulesyesno').html('No');
	}
}
function editchangekeanerule(ele){
	if($('#edit_is_keane_apply').is(':checked')){ 
		$('.editapplykeaneruleval').removeClass('hide');
		$('.editapplykeanerulesyesno').removeClass('noselect'); 
		$('.editapplykeanerulesyesno').addClass('yesselect'); 
		$('.editapplykeanerulesyesno').html('Yes');
	}else{
		$('.editapplykeaneruleval').addClass('hide');
		$('.editapplykeanerulesyesno').addClass('noselect'); 
		$('.editapplykeanerulesyesno').removeClass('yesselect'); 
		$('.editapplykeanerulesyesno').html('No');
	}
}