class ajax {
  static get (url, obj) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      let param = '';
      if (obj) {
        for (let attr in obj) {
          param += attr + '=' + obj[attr] + '&'
        }
      }
      xhr.open('get', url + '?' + param);
      // 监听状态,接收返回值
      xhr.onreadystatechange = function () {
        // ajax状态为4,服务器状态为200
        if (xhr.readyState == 4) {
          // console.log(xhr.response);
          if (xhr.status == 200) {
            resolve(xhr.response)
          } else {
            reject('error')
          }

        }
      }
	  xhr.send();

    })

  }


  static post (url, obj) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open('post', url);
      // 设置头部信息
      let param = '';
      if (obj) {
        for (let attr in obj) {
          param += attr + '=' + obj[attr] + '&'
        }
      }
      //console.log(data);
      // 监听状态接收返回值
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(xhr.response)
          } else {
            reject('error')
          }


        }
      }
	  xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
	  xhr.send(param);
    });
  }
}