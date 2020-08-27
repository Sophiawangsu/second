class Goods {
    //构造方法
    constructor() {
        //调用获取列表方法
        //获取商品列表方法调用
        Goods.list();
        //给登录按钮绑定事件login
        $("#login").addEventListener("click", Goods.login);
        //给退出按钮绑定事件exit
        $("#exit").addEventListener("click",  Goods.exit);
    }


    /******1.实现商品列表****** */
    static list(tmpPage = 1) {
        //发送ajax请求获取数据
        ajax.get("./goods.php", { fn: "lst", page: tmpPage }).then(res => {
            //console.log(res);/后台数据调出来但是只需要使用stateCode和data两个数据
            //解构赋值，将stateCode和data字符串数据转化为json数据
            let { stateCode, data, count } = JSON.parse(res);
            //判断stateCode的状态，获取data的数据
            if (stateCode == 200) {
                //状态码显示成功状态，循环数据，拼接追加
                //先声明一个空值变量，便于保存数据
                let str = "";
                //data数据的遍历
                data.forEach(ele => {
                    // console.log(ele);//{id: "2", goodsName: "李宁闪击篮球鞋驭帅10镭射队尚4男韦德之道空袭中高帮队尚3.5球鞋", price: "499.1", goodsDesc: "描述", size: "35-45", …}
                    //先拼接st的内容然后追加到class=“divs”的div标签中
                    str += `<div class="goodsCon"><a target = "_blank" href="http://127.0.0.1/suxiaomi/step/detail/goodDetail.html">
            <img src="${ele.goodsImg}" class="icon"><h4 class="title">${ele.goodsName}</h4>
            <div class="info">限时抢购3只</div></a><div class="priceCon">
            <span class="price">￥${ele.price}</span>
            <span class="oldPrice">￥${(ele.price * 1.2).toFixed(2)}</span>
            <div><span class="soldText">已售${ele.num}%</span>
            <span class="soldSpan"><span style="width: 87.12px;">
            </span></span></div>
            <a class="button" target="_blank" onclick="Goods.addCart(${ele.id},1)">立即抢购</a></div></div >`;
                });
                //获取新增的div节点，libs是对获取节点的封装，可以直接使用$(".divs")
                //获取节点，追加到页面
                $(".divs").innerHTML = str;
                //页显示商品列表静态页面的的形式
            }
             //渲染分页的页码
             let pageStr = "";
             for (var i = 1; i <=count; i++) {
                 pageStr += `<li ><a href="#" onclick="Goods.list(${i})">${i}</a></li>`;
             }
             //追加到页面
             document.querySelector(".pagination").innerHTML = pageStr;
        });
    }


    /*******2.数据加入购物车************ */
    static addCart(goodsId, goodsNum) {
        //1.判断当前用户是否登录
        if (localStorage.getItem("userId")) {
            //登录则存入数据库(见2-1静态函数setDataBase方法)
            Goods.setDataBase(goodsId, goodsNum);
        } else {
            //未登录则存入浏览器中(见2-2静态函数setLocal方法)
            Goods.setLocal(goodsId, goodsNum);
        }
    }

    /**********2-2.存数据库的方法**************在application的localstorage中显示 */
    //验证方法就是点击登录，application会显示"user","zs"和"userId",1
    //数据库中的所有用户的公用表格cart表格中的userId，每一个用户有一个用户名不重复
    static setDataBase(goodsId, goodsNum) {
        //1.获取当前用户的id
        let userId = localStorage.getItem("userId");
        //2.发送ajax请求，进行存储（牵扯用户用post，安全性能高）
        ajax.post('./goods.php?fn=add', { userId: userId, gId: goodsId, gNum: goodsNum }).then(res => {
            //点击立即抢购后，数据库后台会显示你选中的商品信息
            //在php中添加On duplicate Key update num=num+$gNum,可以使得数据库中有重复用户名的用户添加同一商品的数量时，可以在num上增加，而不是新增用户名
            //alter table cart add unique index(productId,userId);务必现在数据库运行一下
            //php中goods.php27行echo $sql;die;然后再实时下面的语句，数据库cart表中的num数据，运营一次就会执行一次累加
            // $sql = "insert into cart(userId,productId,num,size) values('$userId','$gId','$gNum',40) on duplicate key update num=num+$gNum";//console.log(res);//goods.js:69 {"stateCode":200,"state":"success","data":""}
            //注释goods.php27行echo $sql;die;然后选中立即抢购，数据库刷新页面就可以看到上传的数据

        })
    }


    /************2-3存浏览器方法*************在application的localstorage中显示 */
    //存数据库中的验证方法就是在未登录的状态下，application中点击立即抢购，后台中values中显示id和点击的数量
    static setLocal(goodsId, goodsNum) {
        //1.取出local中的数据,carts只是命名
        let carts = localStorage.getItem("carts");
        //2.判断是否有数据，存在则判断当前商品是否存在
        if (carts) {
            // console.log(carts);//application中显示{2: 6, 3: 4, 4: 1, 5: 1, 7: 2, 8: 1, 9: 1
            //2-1转化为对象
            carts = JSON.parse(carts);
            //2-2判断商品是否存在 存在则增加数量
            //遍历carts对象(使用for in 遍历数量)
            for (let gId in carts) {
                if (gId == goodsId) {//判断当前添加的商品和正在循环的商品是否一致
                    goodsNum = carts[gId] - 0 + goodsNum;//此时可以写+1，但是写goodsNum更科学
                }
            }
            //2-3商品不存在则新增商品，存在就重新给数量
            //此处一语双关。goodsId存在，则重新赋值，不存在则carts[goodsId]则是属性
            carts[goodsId] = goodsNum;

            //2-4存到local中
            localStorage.setItem('carts', JSON.stringify(carts));


        } else {
            //3.没有数据就新增保存商品id和数量
            //商品id可以找到商品的其他信息，数量是用户采购数量可能不一致
            let goodsCart = { [goodsId]: goodsNum };//把goodsCart看成变量k，把goodsNum看成变量v
            //转化为json进行存储
            goodsCart = JSON.stringify(goodsCart);
            localStorage.setItem("carts", goodsCart);
        }
    }


    /**********2-1登录的方法******** */
    // login() {
    //     //发送ajax请求 让后台验证用户名和密码
    //     //验证成功则登录，将用户名存到数据库中
    //     //设置用户名
    //     localStorage.setItem("user", "zs")
    //     //设置用户id
    //     localStorage.setItem("userId", 1)
    // }

    // exit() {
    //     localStorage.removeItem("user");
    //     localStorage.removeItem("userId");
    // }

    /*****用户登陆后，将浏览器数据添加到数据库中******/












}
new Goods;