export const NOT_DOM_ELEMENTS = ['html','head','body','meta','title','link','style','script'];
export const ERROR_VARIABLE = {
    PICKER_OBJECT_CONFIG_ERROR:'you should pass a param which is el and el must be a string or a dom element!',
    PICKER_CONFIG_ERROR:'you should pass a param that it must be a string or a dom element!',
    DOM_OBJECT_ERROR:'can not find the element by el property,make sure to pass a correct value!',
    DOM_ERROR:'can not find the element,make sure to pass a correct param!',
    CONFIG_SIZE_ERROR:'the value must be a string which is one of the normal,medium,small,mini,or must be an object and need to contain width or height property!',
    DOM_NOT_ERROR:'Do not pass these elements: ' + NOT_DOM_ELEMENTS.join(',') + ' as a param,pass the correct element such as div!',
    PREDEFINE_COLOR_ERROR:'PredefineColor is a array that is need to contain color value!',
    CONSTRUCTOR_ERROR:'ewColorPicker is a constructor and should be called with the new keyword!',
    DEFAULT_COLOR_ERROR:'the "defaultColor" is not a invalid color,make sure to use the correct color!'
};