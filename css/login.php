<?php
include("./mysql.php");
@$fn = $_GET["fn"];
@$fn();


function chkUser(){
	$userId = $_GET["userId"];
	$sql = "select userId from cart where userId = $userId";
	$data = select($sql);
	echo json_encode([
		"stateCode"=>200,
		"state"=>"success",
		"data"=>$data
	]);
};
function login(){
	$userId = $_GET["userId"];
	$pasd = $_GET["pasd"];
	$sql = "select userId,pasd from cart where userId = $userId";
	$data = select($sql);
	echo json_encode([
		"stateCode"=>200,
		"state"=>"success",
		"data"=>$data
	]);
	
}

function addUser(){
	$userId = $_GET["userId"];
	$pasd = $_GET["pasd"];
	$sql = "insert into cart (userId,pasd) values('$userId','$pasd')";
	$res = query($sql);
	if($res == 1){
		echo json_encode([
			"stateCode"=> 200,
			"state"=>"success",
			"data"=>''
		]);
	}else{
		echo json_encode([
			"stateCode"=> 201,
			"state"=>"error",
			"data"=>''
		]);
	}
		
	
	
}

?>