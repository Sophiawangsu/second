class Login{
	constructor() {
		$(".login").addEventListener("click",this.login)
		$(".zhuce").addEventListener("click",this.zhuCe)
		$("#user").addEventListener("blur",Login.checkUser)
		$("#pass").addEventListener("blur",Login.checkPasd)
		$(".luyou").addEventListener("click",this.see)
	}
	static checkUser(){
		let userId = $("#user").value;
		let span = $("#user").nextElementSibling;
		//1.用户名 用户名仅支持中文、字母、数字、“-”“_”的组合，4-8个字符
		var reg = /^[\-\_\d\w\u4E00-\u9FA5]{4,8}[^0]$/;
		var res = reg.test(userId);
		if(!res){
			span.innerHTML = '请输入4至8位用户名 ! ! !';
			span.style.color= "rgb(255,110,200)"
			$("#user").style.background= "rgb(255,110,200)"
			return false;
		}else{
			$("#user").style.background= "greenyellow"
			span.innerHTML = '';
			return true;
		}
		
	}
	static checkPasd(){
		let pasd = $("#pass").value;
		let span = $("#pass").nextElementSibling;
		// 2.密码的规则  数字字母特殊字符，一种类型，弱。两种类型为中，三种类型为强,6个字符
		var reg = /^.{6}$/;
		var res = reg.test(pasd);
		if(!res){
			span.innerHTML = '请输入6位密码 ! ! !';
			span.style.color= "rgb(255,110,200)"
			$("#pass").style.background= "rgb(255,110,200)"
			return false;
		}else{
			$("#pass").style.background = "greenyellow";
			span.style.color= "greenyellow";
			var x = /[a-zA-Z]+/.test(pasd) ? 1 :0;
			var y = /\d+/.test(pasd) ? 1 :0;
			var z = /[^a-zA-Z\d]+/.test(pasd) ? 1 :0;
			switch(x+y+z){
				case 1 :span.innerHTML = '密码强度弱 ! ! !';break;
				case 2 :span.innerHTML = '密码强度中 ! !';break;
				case 3 :span.innerHTML = '密码强度强 ! ';break;
			}
			return true;
		}
	}
	
	login(){
		let resUser = Login.checkUser();
		let resPasd = Login.checkPasd();
		if( resUser && resPasd){
			let userId = $("#user").value;
			let pasd = $("#pass").value;
			let obj ={userId:""}
			console.log(userId,pasd)
			ajax.get("./login.php",{fn:"login",userId:userId,pasd:pasd}).then(res=>{
				var { stateCode,data} = JSON.parse(res)
				console.log(data)
				if(stateCode == 200){
					if(data.length === 0){
						this.nextElementSibling.innerHTML= "-- __-- !"
						this.nextElementSibling.style.color = 'red'
						$("#pass").style.background= "rgb(255,110,200)"
						$("#pass").nextElementSibling.style.color = "red"
						$("#user").style.background= "rgb(255,110,200)"
						$("#user").nextElementSibling.innerHTML= "该用户名不存在！请注册"
						$("#user").nextElementSibling.style.color = 'red'
						
					}
					if(data.length > 0){
						var data = data[0];
						if(data.userId === userId && data.pasd === pasd){
								localStorage.setItem("userId",userId);
								location.assign("http://localhost:8887")
							}else{
						this.nextElementSibling.innerHTML= "请核实用户名/密码！"
						this.nextElementSibling.style.color = 'red'
						}
					}
				}
			})
		}else{
			this.nextElementSibling.innerHTML= "请核实用户名/密码！"
			this.nextElementSibling.style.color = 'red'
		}
	}
	zhuCe(){
		let res = Login.checkUser();
		let resPasd = Login.checkPasd();
		let userId = $("#user").value;
		let pasd = $("#pass").value;
		if(res && resPasd){
			Login.checkUser()
			ajax.get("./login.php",{fn:"chkUser",userId:userId}).then(res=>{
				let { stateCode,data} = JSON.parse(res)
				if(stateCode == 200){
					if(data.length > 0){
						$("#user").nextElementSibling.innerHTML = '被人捷足先登';
						$("#user").style.background= "rgb(255,110,200)"
						$("#user").nextElementSibling.style.color = 'red';
					}else{
						$("#user").nextElementSibling.innerHTML = '正在注册，请稍等。。。';
						$("#user").style.background= "greenyellow"
						$("#user").nextElementSibling.style.color = 'gold';
						ajax.get("./login.php",{fn:"addUser",userId:userId,pasd:pasd}).then(res=>{
							let { stateCode,state} = JSON.parse(res)
							if(stateCode == 200 && state == "success"){
								alert("注册成功")
								localStorage.setItem("userId",userId)
								location.assign("http://localhost:8887")

							}else{
								alert("注册失败")
							}
						})
					}
				}
			})
		}
	}
	see(){
		localStorage.clear()
	}
	
	
	
	
	
}
new Login;