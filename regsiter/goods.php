<?php
// 导入php文件
include('./mysql.php');
// 获取ajax请求的方法
$fn = $_GET['fn'];  // lst
$fn();  // lst()
function lst(){
  //分页的设计
  //设置每一页的长度
  $length=4;
  //当前页码
  $page=$_GET["page"];
  //计算起始位置
  $start=($page-1)*$length;
  //判断后台的总也页数
  $sql1="select count(id) cou from product";
  $cou=select($sql1)[0]["cou"];
  //取整数
  $pCount=round($cou/$length);
  $sql = "select * from product order by id asc limit $start,$length";
  $data = select($sql);

  //print_r($data);
  echo json_encode([
    'stateCode'=>200,
    'state'=>'success',
    'data'=>$data,
    "count"=>$pCount
  ]);
}
//lst();
 // 添加数据的方法
function add(){
 //echo '我是添加';
 $userId = $_POST['userId'];
 $gId = $_POST['gId'];
 $gNum = $_POST['gNum'];
//在cart 后面写上字段可以更容易识别(字段不能加引号)
 $sql = "insert into cart(userId,productId,num,size) values('$userId','$gId','$gNum',40) on duplicate key update num=num+$gNum";
// echo $sql;die;//insert into cart(userId,productId,num,size) values('1','2','1',40) on duplicate key update num=num+1
  $res = query($sql);
  if($res==1){
    echo json_encode([
      'stateCode'=>200,
      'state'=>'success',
      'data'=>''
    ]);
  }else{
    echo json_encode([
      'stateCode'=>201,
      'state'=>'error',
      'data'=>''
    ]);
  }
}

// 删除数据的方法
function del(){
  $id = $_GET['id'];
  $sql = "delete from product where id=$id";
  $res = query($sql);
  if($res==1){
    echo json_encode([
      'stateCode'=>200,
      'state'=>'success',
      'data'=>''
    ]);
  }else{
    echo json_encode([
      'stateCode'=>201,
      'state'=>'error',
      'data'=>''
    ]);
  }
}

// 修改数据的方法
function update(){
  $id    = $_POST['id'];
  $title = $_POST['title'];
  $pos   = $_POST['pos'];
  $idea  = $_POST['idea'];

  $sql = "update product set title='$title',pos='$pos',idea='$idea' where id=$id";

  $res = query($sql);
  if($res==1){
    echo json_encode([
      'stateCode'=>200,
      'state'=>'success',
      'data'=>''
    ]);
  }else{
    echo json_encode([
      'stateCode'=>201,
      'state'=>'error',
      'data'=>''
    ]);
  }
}
?>