/*******获取购物车数据进行渲染*********/
class Cart {
    constructor() {
        this.list();
        //给全选按钮绑定事件
        All('.check-all')[0].addEventListener('click', this.checkAll);
        All('.check-all')[1].addEventListener('click', this.checkAll);
    }

    /*****实现购物车列表的方法****** */
    list() {
        //1.根据登录的状态，获取商品id
        let userId = localStorage.getItem("userId");
        //声明保存购物车商品id的变量
        let cartGoodsId = "";
        if (userId) {
            //存在去数据库cart表中获取数据
            ajax.get("./cart.php", { fn: 'getgoodsId', userId: userId }).then(res => {
                //console.log(res);
                let { data, stateCode } = JSON.parse(res);
                if (stateCode == 200) {
                    //console.log(data);//[{…}]
                    //购物车数据为空则停止
                    if (!data) return;
                    // 将商品id和数量保存为对象
                    let cartIdNum = {};
                    data.forEach(ele => {
                        cartGoodsId += ele.productId + ","
                        cartIdNum[ele.productId] = ele.num;
                    });
                    //console.log(cartIdNum);//{2: "2"}
                    //console.log(cartGoodsId);//可以打印出值“2,”
                    Cart.getCartGoods(cartGoodsId, cartIdNum);
                }

            })
        } else {
            // 未登录去浏览器获取数据
            let cartGoods = localStorage.getItem("carts");
            //3-1为空则停止
            if (!cartGoods) return;//如果价格不存在
            //3-2不为空转化成json，循环遍历获取商品Id
            cartGoods = JSON.parse(cartGoods);
            //console.log(cartGoods);//{2: 1, 3: 1, 4: 1, 5: 1, 7: 1}
            for (let gId in cartGoods) {
                cartGoodsId += gId + ",";
                //console.log(gId);//2  3  4  5  7  
            }
            //console.log(cartGoodsId);//2,3,4,5,7,
            Cart.getCartGoods(cartGoodsId);

        }
        // console.log(cartGoodsId);//打印为空，ajax为异步请求，所以没有值
    }

    /*********根据购物车商品ID去商品表获取商品信息********** */
    static getCartGoods(gId, cartIds = "") {
        //如果是登录状态,商品数量从cartIds获取,未登录从浏览器获取
        cartIds = cartIds || JSON.parse(localStorage.getItem("carts"))
        // console.log(cartIds);
        //{2: "2"登陆时显示状态
        //{2: 1, 3: 1, 4: 1, 5: 1, 7: 1}未登陆时显示状态
        ajax.post('./cart.php?fn=lst', { goodsId: gId }).then(res => {
            // console.log(res);
            //1.转化数据，获取data
            let { data, stateCode } = JSON.parse(res);
            if (stateCode == 200) {
                let str = "";
                data.forEach(ele => {
                    //console.log(ele);
                    //{id: "2", goodsName: "李宁闪击篮球鞋驭帅10镭射队尚4男韦德之道空袭中高帮队尚3.5球鞋", price: "499.1", goodsDesc: "描述", size: "35-45", …}
                    //将数据循环到页面中去
                    str += `<tr>
                <td class="checkbox"><input class="check-one check" type="checkbox"/ onclick="Cart.goodsCheck(this)"></td>
                <td class="goods"><img src="${ele.goodsImg}" alt=""/><span>${ele.goodsName}</span></td>
                <td class="price">${ele.price}</td>
                <td class="count">
                    <span class="reduce"  onclick="Cart.minusGoodsNum(this,${ele.id})">-</span>
                    <input class="count-input" type="text" value="${cartIds[ele.id]}"/>
                    <span class="add" onclick="Cart.addGoodsNum(this,${ele.id})">+</span></td>
                <td class="subtotal">${(ele.price * cartIds[ele.id]).toFixed(2)}</td>
                <td class="operation"><span class="delete" onclick='Cart.delGoods(this,${ele.id})'>删除</span></td>
            </tr>`
                    $("tbody").innerHTML = str;
                })
            }
        })
    }
    /********商品的删除**** */
    static delGoods(eleObj, gId) {
        let userId = localStorage.getItem('userId');
        if (userId) {
            ajax.get('./cart.php', { fn: 'delete', goodsId: gId, userId: userId }).then(res => {
                //  console.log(res);//{"stateCode":200,"state":"success","data":""}
            })
        } else {
            // 从浏览器取出购物车数据
            let cartGoods = JSON.parse(localStorage.getItem('carts'));
            //console.log(cartGoods);
            // delete删除指定的属性
            delete cartGoods[gId];//gId是变量 加中括号
            //console.log(cartGoods);
            localStorage.setItem('carts', JSON.stringify(cartGoods));
        }
        // 把当前商品对应的tr删除
        eleObj.parentNode.parentNode.remove();
        // 计算价格和数量
        Cart.cpCount();

    }
    /******价格和数量计算********/
    static cpCount() {
        //1获取页面中所有是check-onec
        let checkOne = All('.check-one');
        //保存选中商品的价格和数量
        let count = 0;
        let xj = 0;
        //2遍历找选中的
        checkOne.forEach(ele => {
            if (ele.checked) {
                // console.log(ele);//获取input
                //3找到当前input对应的tr
                let trObj = ele.parentNode.parentNode;
                //4获取数量和小计
                let tmpCount = trObj.getElementsByClassName('count-input')[0].value;
               // console.log(tmpCount);
                let tmpXj = trObj.getElementsByClassName('subtotal')[0].innerHTML;
                // console.log(tmpCount, tmpXj);//10 4991.00显示选中的总数量和总价格
                count = tmpCount - 0 + count;
                xj = tmpXj - 0 + xj;
            }
        })
        // console.log(count, xj);显示选中合计的总数量和总价格
        //放到页面中 
        $('#selectedTotal').innerHTML = count;
        $('#priceTotal').innerHTML = parseInt(xj * 100) / 100;
    }

    /******数量的减少****** */
    static minusGoodsNum(eleObj, gId) {
        //console.log("dfsdf")检查绑定节点是否成功
        // console.log(eleObj);//点击加号，获取<span class="add" onclick="Cart.addGoodsNum(this,${ele.id})">+</span>
        //修改input的数量
        // console.log(eleObj);
        let num = eleObj.nextElementSibling.value-0-1;//下一个兄弟节点
        //console.log(num);
        // console.log(inputNumObj);//<input class="count-input" type="text" value="${cartIds[ele.id]}"/>
        if(num<1)   num=1;
        eleObj.nextElementSibling.value=num;
        //判断登陆状态，修改数据库或者浏览器数量
        if (localStorage.getItem('user')) {
            Cart.updateCart(gId, eleObj.nextElementSibling.value);
        } else {
            Cart.updateLocal(gId, eleObj.nextElementSibling.value);
        }
        // 3 实现小计的计算
        //  3-1 获取价格的节点
        let priceObj = eleObj.parentNode.previousElementSibling;//父节点的上一个兄弟节点
        //父节点的下一个兄弟节点
        eleObj.parentNode.nextElementSibling.innerHTML = (priceObj.innerHTML * eleObj.nextElementSibling.value).toFixed(2);
        // 计算价格和数量
        Cart.cpCount();
    }


    /******数量增加*****/
    static addGoodsNum(eleObj, gId) {
        // console.log(eleObj);//点击加号，获取<span class="add" onclick="Cart.addGoodsNum(this,${ele.id})">+</span>
        //修改input的数量
        let inputNumObj = eleObj.previousElementSibling;//上一个兄弟节点
        // console.log(inputNumObj);//<input class="count-input" type="text" value="${cartIds[ele.id]}"/>
        inputNumObj.value = inputNumObj.value - 0 + 1;

        //判断登陆状态，修改数据库或者浏览器数量
        if (localStorage.getItem('user')) {
            Cart.updateCart(gId, inputNumObj.value);
        } else {
            Cart.updateLocal(gId, inputNumObj.value);
        }
        // 3 实现小计的计算
        //  3-1 获取价格的节点
        let priceObj = eleObj.parentNode.previousElementSibling;//父节点的上一个兄弟节点
        //父节点的下一个兄弟节点
        eleObj.parentNode.nextElementSibling.innerHTML = (priceObj.innerHTML * inputNumObj.value).toFixed(2);
        // 计算价格和数量
        Cart.cpCount();
    }

    /***********cart数量的修改********* */
    static updateCart(gId, gNum) {
        let id = localStorage.getItem('userId');
        ajax.get('./cart.php', { fn: 'update', goodsId: gId, goodsNum: gNum, userId: id }).then(res => {
            // console.log(res);
        })
    }
    /************浏览器中数量修改****** */
    static updateLocal(gId, gNum) {
        //取出并且转化
        let cartGoods = JSON.parse(localStorage.getItem('carts'));
        //重新赋值
        cartGoods[gId] = gNum;
        localStorage.setItem('carts', JSON.stringify(cartGoods));
    }
    /************全选的实现********* */
    checkAll() {
        //console.log(this);
        // 1 实现另一个全选按钮选中或者取消
        let state = this.checked;
        //console.log(state);//选中时显示true，取消选中时显示false
        //下面设置让两个全选选中，点击第一个全选，可以选中限免的全选
        All('.check-all')[this.getAttribute('all-key')].checked = state;//
        // 2 让所有的商品选中
        // 2-1 获取单个商品的复选框(html中每一个tr的class名都是check-one
        let checkGoods = All('.check-one');//不能写checkbox,写这个是获取td，我们需要input，而不是td

        //2-2遍历所有商品的单选框设置状态(如遇数组不是遍历就是循环)
        checkGoods.forEach(ele => {
            console.log(ele);//点击全选获取全部的单个复选框input的标签内容
            ele.checked = state;//点击全选，所有的方框都被选中
        })
        // 计算价格和数量
        Cart.cpCount();
    }


    /******单选的实现****** */
    static goodsCheck(eleObj) {
        //console.log(eleObj);//点击单选  选中相应的input
        let state = eleObj.checked;
        //console.log(state);//点击选中为true，点击取消选中为false
        //1 当一件商品取消选中,全选取消
        if (!state) {
            All('.check-all')[0].checked = false;
            All('.check-all')[1].checked = false;
        } else {
            //2 所有单选选中,全选选上
            //2-1 获取所有的单选框
            let checkOne = All('.check-one');
            let len = checkOne.length;

            //2-2计算选中的单选框
            let checkCount = 0;
            checkOne.forEach(ele => {
                //前面为true，后面执行++
                ele.checked && checkCount++
            })
            console.log(checkCount);
            //2-3判断单选商品选中的个数等于len，则全选选中(true)
            if (len == checkCount) {
                All('.check-all')[0].checked = true;
                All('.check-all')[1].checked = true;
            }

        }
        // 计算价格和数量
        Cart.cpCount();
    }


}
new Cart;