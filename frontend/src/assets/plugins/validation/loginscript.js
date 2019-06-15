/*
Author: Pradeep Khodke
URL: http://www.codingcage.com/
*/

$('document').ready(function()
{ 
     /* validation */
	 $("#login-form").validate({
      rules:
	  {
			password: {
			required: true,
			},
			email: {
            required: true,
            email: true
            },
	   },
       messages:
	   {
            password:{
                      required: "please enter your password"
                     },
            email: "please enter your email address",
       },
	   submitHandler: submitForm	
       });  
	   /* validation */
	   
	   /* login submit */
	   function submitForm()
	   {		
			var data = $("#login-form").serialize();
				
			$.ajax({
				
			type : 'POST',
			url  : APIURL+'user/login',
			data : data,
			headers: {"pd-utype": 1},
			beforeSend: function()
			{	
				$("#error").fadeOut();
				$("#btn-login").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; sending ...');
			},
			success :  function(response)
			   {	
					console.log(response);
					if(response.status == true){
						var userroleid=response.data.role_id;
						$.ajax({
				
							type : 'POST',
							url  : MAINURL+'login/auth',
							data : response.data, 
							success :  function(response)
						   {
							$("#btn-login").html('<span class="glyphicon glyphicon-transfer"></span> &nbsp; Signing In ...');
							if(userroleid==1){
								setTimeout(' window.location.href = "'+MAINURL+'admin/dashboard"; ',4000);
							}else{
								setTimeout(' window.location.href = "'+MAINURL+'dashboard"; ',4000);
							}	
							
					
						   }
						});
						
					}
					else{
									
						$("#error").fadeIn(1000, function(){						
							$("#error").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; '+response.message+' !</div>');
							$("#btn-login").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
						});
					}
			  },
			  error: function (xhr, ajaxOptions, thrownError) {
				 
				  $("#error").fadeIn(1000, function(){						
						$("#error").html('<div class="alert alert-danger"> <span class="glyphicon glyphicon-info-sign"></span> &nbsp; User Authentication Failed</div>');
						$("#btn-login").html('<span class="glyphicon glyphicon-log-in"></span> &nbsp; Sign In');
					});
			  }
			});
				return false;
		}
	   /* login submit */
});