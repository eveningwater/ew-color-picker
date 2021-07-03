const introduceSideBars = [
    {
        collapsable: false,
        sidebarDepth:2,
        children:[
            {
                path:"introduce",
                title:"介绍"
            }
        ]
    }
];
const getStartedSideBars = [
    {
        sidebarDepth:2,
        collapsable:false,
        children:[
            {
                path:"start",
                title:"指南"
            }
        ]
    }
]
const demoSideBars = [
    {
        sidebarDepth:2,
        collapsable:false,
        children:[
            {
                path:"demo",
                title:"示例"
            }
        ]
    }
]
const apiSideBars = [
    {
        collapsable: false,
        sidebarDepth:2,
        children:[
            {
                path:'api',
                title:"接口详解"
            }
        ]
    }
]
module.exports = {
    introduceSideBars,
    getStartedSideBars,
    demoSideBars,
    apiSideBars
};