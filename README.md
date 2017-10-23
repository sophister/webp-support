# webp-check
checking webp image support in browser

本来想用 `webp-support` 这个名字，结果 `npm` 上已经被占用了……只能改用 **webp-check** 这个名字了

## 安装

```shell
npm install webp-check
```

由于整个检测过程，是 **异步** 的，因此，我在第一次检测之后，会尝试将检测结果，保存到 `localStorage` 里，以便下次读取的时候，能 **同步** 的获得结果。

如果当前浏览器不支持 `localStorage`，也支持将检测结果，保存到 `cookie` 里，可以在 `init(config)` 方法里，传入一个 `config.cookieName` 来表示，存储在 `cookie` 里的名字。

## 使用方法

注意：**由于webp图片的检测，是通过`Image`来加载不同格式的webp，因此是一个 异步 的过程，如果是第一次执行 init 方法，不能在方法执行后，立即获取结果！**

```javascript
const webpCheck = require('web-check');

//初始化
var config = {
    //如果 `localStorage` 不可用，是否要将检测结果，保存到 `cookieName` 值对应的 `cookie` 里，默认 **不会** 保存到cookie
    cookieName : ''
};
webpCheck.init( config );

//获取是否检测完成. true 检测完成，可以读取检测结果；false 检测还未完成
var isDone = webpCheck.isDone();

//获取检测结果。必须要等上述的 isDone() 返回  true 才能获取！！
var result = webpCheck.webp;

//下面4个属性，都是 boolean 格式的，表示当前浏览器，是否支持该格式的 webp 图片
result.lossy;
result.lossless;
result.alpha;
result.animation;


//也可以主动调用检测方法，该方法，在 **异步** 执行结束后，也会把检测结果保存到 `localStorage`
webpCheck.check()

```


## 说明

具体的 `webp` 各个格式检测代码，是来自 [google webp faq官方网站](https://developers.google.com/speed/webp/faq) 的。

 