## SubregionLayout 组件说明

`左右分区布局实现组件` 该组件支持左右分栏布局 侧边栏 sidebar 支持展开收起

|参数|类型|说明|
|-----|---------|----|
|Sidebar|React.ReactNode(必选参数)|侧边栏内容|
|Content|React.ReactNode(必选参数)|主q区域内容|
|sidebarType|string(可选参数)|布局方式，可选参数为 'left' 或 'right':默认值为'left'即 Slider 部分在左,Content 部分在右,'right' 则相反|
|mode|string(可选参数)|侧边栏模式，可选参数为 'min', 'middle', 'max':默认值为'middle'即 侧边栏宽度为中号, 'min' 为最小化, 'max' 为最大化|


## 使用示例

```javascript
/** 写法1 */
<SubregionLayout Sidebar={<ComSidebar/>} sidebarType = 'left' Content={<ComContent/>}  mode = 'middle'/>
/** 
 * 写法2 
 * 注意该写法一定要将 ComSidebar 组件放在 content 组件之前
*/
<SubregionLayout sidebarType='left' mode='middle'>
    {
        <React.Fragment>
            <ComSidebar/>
            <ComContent/>
        </React.Fragment>
    }
</SubregionLayout>

```




