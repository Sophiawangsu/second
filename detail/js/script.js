$(function(){
	top_tab();//导航栏效果
    magnifier();//放大镜
    changeImg ();//点击放大镜下面的进行切换
    nextOrPrev();//左右按钮展示商品
    address();//三级地址分配
    goodsCart();//商品的选择及购物车
    // addGoods();//获取评论
    // 单击图片然后再显示详情
    $('.preview-wrap .samll-box').click(function(){
        $('.ui-mask').show();
        $('.ui-dialog').show();
        $('.ui-dialog-close').click(function(){
            $('.ui-mask').hide();
            $('.ui-dialog').hide();           
        });
    });
    // 商品详情tab卡的切换显示 
    $('#detail .tab-con .item').eq(1).hide();  
    $('#detail .tab-main li').click(function(){
        if(dom.scrollTop()>=fixed){
            window.scrollTo(0,1199);//每次点击都返回对应的顶部
        }
        $(this).addClass('current').siblings().removeClass('current');
        var index = $(this).index();
        $('#guarantee').show();//让消失的售后保障重现
        $('#comment').show();//让消失的评论重现
        $('#detail .tab-con .item').eq(index).show().siblings().hide();
    });
    // 点击商品评价的时候，让售后保障消失
    $('#detail .tab-main li').eq(3).click(function(){
        $('#guarantee').hide();
        $('#comment').css("margin-top","20px");
    });
    // 点击社区互动的时候，让售后保障和商品评价消失
    $('#detail .tab-main li').eq(4).click(function(){
        $('#guarantee').hide();
        $('#comment').hide();
    });
    // 轮播之后的视口固定
    var fixed=$('.aside').offset().top;
    var dom=$(document);//得到document文档对象
    $(window).scroll(function(){
        if(dom.scrollTop()>=fixed){
            $('.aside .popbox-inner').addClass("pro-detail-hd-fixed");
            $('#detail .tab-main').addClass("pro-detail-hd-fixed");
            $('.popbox-inner .mc').hide();
            $('.popbox-inner .mt').hover(function(){
                $('.popbox-inner .mc').show();
            },function(){
                $('.popbox-inner .mc').hide();
            });
        }else{
            $('.aside .popbox-inner').removeClass("pro-detail-hd-fixed");
            $('#detail .tab-main').removeClass("pro-detail-hd-fixed");
            $('.popbox-inner .mc').show();
            $('.popbox-inner .mt').hover(function(){
                $('.popbox-inner .mc').show();
            })           
        }
    });
})

// 顶部导航栏的悬停函数
function top_tab(){
	$('.dorpdown').hover(function(){
		// 小尖角号的旋转
		$(this).find('.ci-right').css({"transform":"rotate(180deg)","-webkit-transform":"rotate(180deg)","-moz-transform":"rotate(180deg)","-o-transform":"rotate(180deg)","-ms-transform":"rotate(180deg)"});
		// 内容部分的出现
		$(this).find('.dd').css("display","block");
		// 标题转换样式
		$(this).find('.dt').addClass('hover');
		var index=$(this).index();
		// 让悬停和离开之后的padding值进行改变
		switch(index){
			case 0:
			$('.hover').css("padding","0 24px 0 9px");
			break;
			case 10:
			$('.hover').css("padding","0 24px 0 24px");
			break;
			default:
			$(this).find('.hover').css("padding","0 25px 0 7px");
			break;
		}
	},function(){
		$(this).find('.ci-right').css({"transform":"rotate(0deg)","-webkit-transform":"rotate(0deg)","-moz-transform":"rotate(0deg)","-o-transform":"rotate(0deg)","-ms-transform":"rotate(0deg)"});
		$(this).find('.dd').css("display","none");
		$(this).find('.dt').removeClass('hover');
		$('.top_lnav .dt').css("padding","0 25px 0 10px");
		$('.top_nav .fore6 .dt').css("padding","0 25px 0 25px");
		$('.top_nav .fore3 .dt').css("padding","0 26px 0 8px");
		$('.top_nav .fore7 .dt').css("padding","0 26px 0 8px");
		$('.top_nav .fore8 .dt').css("padding","0 26px 0 8px");
		$('.top_nav .fore9 .dt').css("padding","0 26px 0 8px");
	});
	// 鼠标点击地址切换
	$('.address a').click(function(){
	    $(this).addClass("selected").siblings().removeClass("selected");
	    $(".dt-text").html($(this).html());
	});	
}
// 放大镜函数
function magnifier(){
	var floatWidth=$('.float-box').width(),//遮罩层的宽度
	floatHeight = $('.float-box').height(),//遮罩层的高度
	middleWidth = $('.samll-box').width(),//容器的宽度    
    middleHeight = $('.samll-box').height(),//容器的高度  
    bigWidth = $('.big-box').width(),//放大图片盒子的宽度  
    bigHeight = $('.big-box').height(),//放大图片盒子的高度
    rateX = bigWidth / floatWidth,//放大区和遮罩层的宽度比例
    rateY = bigHeight / floatHeight;//放大区和遮罩层的高度比例    
    //当鼠标移入与移出时阴影与放大去显现/消失  
    $('.samll-box').hover(function() {  
        $('.float-box').show();  
        $('.big-box').show();  
    }, function() {  
        $('.float-box').hide();  
        $('.big-box').hide();  
    });
    $('.samll-box').mousemove(function(e) {//当鼠标移动时，阴影和放大区图片进行移动  
        //记录下光标距离页面的距离  
        var x = e.pageX,  
        y = e.pageY;  
        //设置遮罩层的位置  
        $('.float-box').offset({  
            top: y-floatHeight/2,  
            left: x-floatWidth/2  
    	});  
    	//获取遮罩层相对父元素的位置  
    	var cur = $('.float-box').position(),  
        _top = cur.top,  
        _left = cur.left,  
        hdiffer = middleHeight - floatHeight,  
        wdiffer = middleWidth - floatWidth;  
        if (_top < 0){
        	_top = 0
        } 
        else if (_top > hdiffer){
        	_top = hdiffer
        }  
        if (_left < 0){
        	_left = 0
        }  
        else if (_left > wdiffer){
        	_left =wdiffer
        }  
        //判断完成后设置遮罩层的范围  
        $('.float-box').css({  
            top: _top,  
            left: _left  
        }); 
        //设置放大区图片移动  
        $('.big-box img').css({  
            top: - rateY*_top,  
            left: - rateX*_left  
        });    
    });
}
//悬停改变图片显示当前图片的函数  
function changeImg (){  
    $('.spec-items li').hover(function(){  
    	$(this).css("border","2px solid #e53e41").siblings().css("border","2px solid #fff");
    	var index=$(this).index();//获取当前的索引值
    	// 使用开关语句进行图片的切换
		switch(index){
			case 0:
                console.log($('.samll-box img'));
	        $('.samll-box img').attr("src","./imagess/b1.jpg");  
        	$('.big-box img').attr("src","./imagess/c1.jpg");
			break;
			case 1:
	        $('.samll-box img').attr("src","./imagess/b2.jpg");  
        	$('.big-box img').attr("src","./imagess/c2.jpg");
			break;
			case 2:
	        $('.samll-box img').attr("src","./imagess/b3.jpg");  
        	$('.big-box img').attr("src","./imagess/c3.jpg");
			break;
			case 3:
	        $('.samll-box img').attr("src","./imagess/b4.jpg");  
        	$('.big-box img').attr("src","./imagess/c4.jpg");
			break;
			case 4:
	        $('.samll-box img').attr("src","./imagess/b5.jpg");  
        	$('.big-box img').attr("src","./imagess/c5.jpg");
			break;
			case 5:
            $('.samll-box img').attr("src","./imagess/b2.jpg");  
            $('.big-box img').attr("src","./imagess/c2.jpg");
			break;
			case 6:
            $('.samll-box img').attr("src","./imagess/b3.jpg");  
            $('.big-box img').attr("src","./imagess/c3.jpg");
			break;
			case 7:
	        $('.samll-box img').attr("src","image/58f5b749N6e9452ce.jpg");  
        	$('.big-box img').attr("src","image/58f5b749N6e9452ce2.jpg");
			break;
		}
    })
}  
//展示商品缩略图的前一个后一个按钮
function nextOrPrev(){
	// 点击前一个按钮
    $('.arrow-prev').click(function(){
    	$('.spec-items ul').animate({
    		left:"0"
    	},500);
    	// 前一个按钮不可用置成灰色
    	$(this).addClass("disabled");
    	// 把后一个按钮置成可用状态
    	$('.arrow-next').removeClass("disabled");
    })
    // 点击后一个按钮
    $('.arrow-next').click(function(){
    	$('.spec-items ul').animate({
    		left:"-228px"
    	},500);
    	$(this).addClass("disabled");
    	$('.arrow-prev').removeClass("disabled");
    })
} 
// 三级菜单地址分配
function address(){
    $(".tab li").eq(0).show().siblings().hide();//把标题第一个显示出来，其他的隐藏
    // 鼠标悬停显示移除消失
    $(".stock-address").hover(function(){
        $(".stock-address").addClass("hover1");
        $(".hide").show();
        $(".stock-address .arrow").css({"transform":"rotate(180deg)","-webkit-transform":"rotate(180deg)","-moz-transform":"rotate(180deg)","-o-transform":"rotate(180deg)","-ms-transform":"rotate(180deg)"});
    },function(){
        $(".stock-address .arrow").css({"transform":"rotate(0deg)","-webkit-transform":"rotate(0deg)","-moz-transform":"rotate(0deg)","-o-transform":"rotate(0deg)","-ms-transform":"rotate(0deg)"});
        $(".hide").hide();
        $(".stock-address").removeClass("hover1");
    });
    // 每当按顺序选完之后回去点击每个tab标题
    $(".tab li").click(function(){
        // 把在当前的标题加上current的class
        $(this).addClass("current").siblings().removeClass("current");
        var index = $(this).index();
        $(".tab-con div").eq(index).show().siblings().hide();
        var index2 = $(this).index()+1;
        $(".tab-con div").eq(index2).find("a").remove();
        if($(this).index()!=2){
            $(".tab-con div").last().find("a").remove();
        }
        $(".tab-con div").eq(index).click(function(){
            $(".address-tab ul li").eq(index2).html("请选择");
            $(".address-tab ul li").eq(index2+1).hide();
            $(".tab-con div").eq(index2).click(function(){
                $(".address-tab ul li").eq(index2+1).show();
                $(".address-tab ul li").eq(index2+1).html("请选择");
            });
        });
    }); 
    var obj=[];//用来存放从json里获取的数据
    // 加载json数据
    $.ajax({
        type:'get',
        dataType: "json",
        url:'json.json',
        async:false,
        success:function(data){//请求成功 xhr.responseText
            for(var i=0;i<data.length;i++){
                obj.push(data[i]);//把json里的数据加到obj数组里
            }        
        },
        error:function(){//请求失败
            console.log('响应失败');
        }
    });
    var province=obj.slice(0,35);//省份的地址
    var cityJson=obj.slice(35,486);//城市的地址
    var countyJson=obj.slice(486,523);//地区的地址
    // 省份的遍历生成
    $.each(province, function(k, p) {
        var option = "<a date-id='" + p.id + "'>" + p.province + "</a>";
        $("#selProvince").append(option);
    });
    // 点击省份下的地址
    $("#selProvince a").click(function(){
        // 把点击的地址添到tab卡标题里面
        $(".address-tab ul li").eq(0).html($(this).html());
        // 获取点击之后的省份值
        var eq=$(".address-tab ul li").eq(0).html();
        // 点击完成就把省份的地址内容隐藏掉
        $("#selProvince").hide();
        // 把城市的地址显示出来
        $(".hide1").show();
        // 把tab卡标题的样式也添加到城市那个标题
        $(".address-tab ul li").eq(1).addClass("current").siblings().removeClass("current");
        // 把第二个标题显示出来
        $(".address-tab ul li").eq(1).show();
        // 在判断点击的地址索引值
        var selValue = $(this).attr("date-id");
        // 遍历城市的地址
        $.each(cityJson, function(k, p) {
            // 判断省份选中的id和城市的Id是否相等
            if (p.id == selValue) {
                // 进行添加
                var option = "<a date-id='" + p.id1 + "'>" + p.city + "</a>";
                $("#selCity").append(option);
            }
        });
        // 点击城市下的地址
        $("#selCity a").click(function(){
            // 把选中的城市添加到tab卡里
            $(".address-tab ul li").eq(1).html($(this).html());
            // 获取点击之后的地址
            var eq1=$(".address-tab ul li").eq(1).html();
            // 点击完成之后隐藏
            $("#selCity").hide();
            // 第三个地址标题显示出来
            $(".hide2").show();
            // 把第三个标题添加样式
            $(".address-tab ul li").eq(2).addClass("current").siblings().removeClass("current");
            // 让第三个标题显示
            $(".address-tab ul li").eq(2).show();
            // 遍历每个地区的地址
            var selValue = $(this).attr("date-id");
            $.each(countyJson, function(k, p) {
                if (p.id1 == selValue) {
                    var option = "<a date-id='" + p.id1 + "'>" + p.county + "</a>";
                    $("#selDistrict").append(option);
                }
            });
            // 点击地区下的地址页面的改变
            $("#selDistrict a").click(function(){
                $(".address-tab ul li").eq(2).html($(this).html());
                // 获取点击之后的地址
                var eq2=$(".address-tab ul li").eq(2).html();
                // 把点击的之后的地址连接在一起
                var changeAddress = eq+eq1+eq2;
                $(".hide").hide();
                // 把更改之后有的地址填入head下的span标签中
                $(".stock-address .head .text").html(changeAddress);
            });
        });
    });
}
// 商品的选择及购物车
function goodsCart(){
    // 商品的选择
    $('.choose-attrs .li .item').click(function(){
        $(this).addClass("selected").siblings().removeClass("selected");
    });
    // 套装的部分
    $('.choose-suits .item').click(function(e){
        $(this).find('.suits-panel').show();
        $(this).siblings().find('.suits-panel').hide();
        $(this).find('a').css("paddingBottom","2px"); 
        $(this).addClass('clicked').siblings().removeClass('clicked');
        $(this).addClass("selected").siblings().removeClass("selected");
        $('.choose-suits .item').eq(1).find('.suits-panel').css("left","-91px");
        $('.choose-suits .item').eq(2).find('.suits-panel').css("left","-181px");
        $('.choose-suits .item').eq(3).find('.suits-panel').css("left","-271px");
    });
    // 套装点击空白消失
    $(document).click(function(e){
        var _con = $('.choose-suits .item');   // 设置目标区域
        if(!_con.is(e.target) && _con.has(e.target).length === 0){
            _con.find("img").hide();
        }
    });
    // 增值保障悬停效果及点击效果
    $('.choose-service .yb-item-cat').hover(function(){
        var index=$(this).index();
        $('.choose-service .more-item li').hover(function(){
            $(this).find("a").show();
        },function(){
            $(this).find("a").hide();
        });
        $(this).find('.yb-item').css({"paddingBottom":"5px","border":"1px solid #e3393c","borderBottom":"none"});
        $(this).find('.more-item').show();
        $('.choose-service .more-item li').click(function(){
            $(this).find('i').css("backgroundPosition","0 -16px");
            $(this).siblings().find('i').css("backgroundPosition","-16px 0");
            $('.choose-service .yb-item-cat').eq(index).find('.yb-item .name').html($(this).find('.name').html());
            $('.choose-service .yb-item-cat').eq(index).find('.yb-item .price').html($(this).find('.price').html());
            $('.choose-service .yb-item-cat').eq(index).find('.more-item').hide();
            $(this).addClass("selected").siblings().removeClass("selected");
        });
        $('.choose-service .more-item .selected').click(function(){
            $(this).find('i').css("backgroundPosition","-16px 0");
            $(this).removeClass("selected");
        });
    },function(){
        $(this).find('.more-item').hide();
        $(this).find('.yb-item').css({"paddingBottom":"4px","border":"1px solid #ccc","borderBottom":"1px solid #ccc"});
    });
    $('.choose-service .service-tips').hover(function(){
        $('.choose-service .service-tips .tips').show();
    },function(){
        $('.choose-service .service-tips .tips').hide();
    });
    // 白条分期的悬停显示
    $('.choose-baitiao .item').hover(function(){
        $(this).find('.baitiao-tips').show();
        $(this).siblings().find('.baitiao-tips').hide();
    },function(){
        $(this).find('.baitiao-tips').hide();
    });
    var item1=$('.choose-baitiao .item').eq(1).find('span').text();
    var item2=$('.choose-baitiao .item').eq(2).find('span').text();
    var item3=$('.choose-baitiao .item').eq(3).find('span').text();
    // 购物车的输入数字
    var timer;
    $('.choose-btns .buy-num').keyup(function(){
        var num=$(".choose-btns input").val();
        timer=setTimeout(function(){
            if(num==""){
                $(".choose-btns input").val(2);
            }
        },1000);
        $('.choose-btns .buy-num').change(function(){
            clearInterval(timer);
        });
        $('.choose-baitiao .item').eq(1).find('span').text(item1*num);
        $('.choose-baitiao .item').eq(2).find('span').text(item2*num);
        $('.choose-baitiao .item').eq(3).find('span').text(item3*num);
    });
    // 购物车的减按钮
    $('.choose-btns .btn-reduce').click(function(){
        $('.choose-btns .btn-add').removeClass("disabled");
        var num=$(".choose-btns input").val();
        if( num<=1){
            num=1;
            $(".choose-btns input").val(num);
            $('.choose-btns .btn-reduce').addClass("disabled");
        }else{
            num--;
            $(".choose-btns input").val(num);    
        }
        $('.choose-baitiao .item').eq(1).find('span').text(item1*num);
        $('.choose-baitiao .item').eq(2).find('span').text(item2*num);
        $('.choose-baitiao .item').eq(3).find('span').text(item3*num);
    });
    // 购物车的加按钮
    $('.choose-btns .btn-add').click(function(){
        $('.choose-btns .btn-reduce').removeClass("disabled");
        var num=$(".choose-btns input").val();
        if( num>=199){
            alert("最多购买199件");
            num=199;
            $(".choose-btns input").val(num);
            $('.choose-btns .btn-add').addClass("disabled");
        }else{
            num++;
            $(".choose-btns input").val(num);
        }
        $('.choose-baitiao .item').eq(1).find('span').text(item1*num);
        $('.choose-baitiao .item').eq(2).find('span').text(item2*num);
        $('.choose-baitiao .item').eq(3).find('span').text(item3*num);
    });
}