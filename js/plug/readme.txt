plug下是通过bens.js 的require函数用ajax同步的方式载入

为了不每次都用ajax，载入后会缓存对象，并返回缓存对象。

因此不要修改require返回的对象的属性和方法，以免其它调用出问题。