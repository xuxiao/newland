$.define("cookie", function(){
    //从cookie中取得加密了的sessionID的值,然后去掉过期时间,转换成一个对象
    //https://github.com/caolan/cookie-sessions/blob/master/lib/cookie-sessions.js
    //缺点是,可以储存的东西太少了
    return function( flow ){
        flow.bind("get_cookie", function( ){
            var s = $.config.session
            var sval = flow.cookies[ s.sid ]
            var data = sval ? JSON.parse(sval) : {}
            flow.session.open( s.life, data )
            flow.bind("header", function(){
                flow.addCookie( s.sid, JSON.stringify(flow.session.data) )
            })
        })
    }
});