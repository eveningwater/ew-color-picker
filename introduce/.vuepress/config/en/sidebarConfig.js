const introduceSideBars = [
    {
        collapsable: false,
        sidebarDepth:2,
        children:[
            {
                path:"introduce",
                title:"introduce"
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
                title:"guide"
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
                title:"demo"
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
                title:"api"
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