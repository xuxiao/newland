$.define("page_generate","helper, mass/more/ejs, hfs",function(get_hepler){
   $.log("生成页面")
    var url = $.path.join( process.cwd(),"app/views/").replace(/\\/g,"/"),layouts = {};
    $.walk(url, function(files){
        var pending = files.length;
        for(var i = 0; i < pending; i++){
            (function(view_url){

                $.readFile(view_url,"utf-8", function(e, source){
                    var array = get_hepler();
                    var data = array[0]
                    var helpers = array[1]
                    var fn = $.ejs.compile(source, helpers);
                    var html = fn(data, helpers);
                    if( typeof data.layout == "string" ){//如果它需要布局模板
                        data.partial = html;
                        var layout = data.layout;
                        html = layouts[layout]
                        if( !html ){
                            try{
                                var layout_url =  $.path.join(url ,"layout", data.layout);
                                html =  $.readFileSync( layout_url , "utf-8");
                                layouts[layout] = html;
                            }catch(e){
                                $.log('<code style="color:red;">找不到必需的布局模板: ', layout_url, '</code>', true);
                            }
                        }
                      
                        fn = $.ejs.compile(html,array[1]);
                        html = fn(data);
                    }
                    if(html){//必须确保其有内容
                        var page_url = view_url.replace("/views","/pages");
                        if(page_url !== view_url){
                            $.updateFile(page_url, html, function(){
                                $.log(page_url+"  同步完成")
                            },1);
                        }
                        //同步到rubylouvre项目
                        var rubylouvre = view_url.replace("/app/views","").replace("newland","rubylouvre")
                        $.updateFile(rubylouvre, html, function(){
                            $.log(rubylouvre+"  同步完成");
                        },1);
                    }
                });
            })( files[i].replace(/\\/g,"/") );//要处理路径时必须先统一path.sep,因为你不知它是/,还是\

        }
    })
})