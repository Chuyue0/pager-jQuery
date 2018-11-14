# pager-jQuery
  基于jquery ajax二次修改的一个分页封装js文件~~
  可根据系统自定义自家需要的分页js；
 
## 备注

**jQuery** 引用的是 v2.0.0 
  按需，无要求版本；
 
**jquery.pager.js **
 1. 前台可传入参数：
    `topic_num` （每页显示多少条，整型，默认为10）
    `page` （页数，整型，默认为1，可不传）
    `url` （分页请求地址）
    `type` （分页请求类型）
    `searchParam` （分页请求数据，包含`topic_num`、`page`）
    
 2. 后端接口配合响应参数：   
    `totalCount` （数据总条数，固定字段！）

 3. 页面使用demo：
    ```CSS
    CSS部分自己定制，仅作参考~
    ```
    
    ```HTML
    <div id="pager"></div>
    <input type="text" name="topic_num" id="perPage" value="10" />
    ```
    
    ```javascript
    $('#pager').sjAjaxPager({
        url:'xxx',
        topic_num: $('#perPage').val() || 10,
        page:1,
        searchParam: data || {},
        beforeSend: function () {
          //todo
        },
        success: function (data) {
          //todo
        },
        complete: function () {
          //todo
        }
    });
    ```
