const picker = require('@ew-color-picker/ewColorPicker')

module.exports = picker && picker.default ? picker.default : picker
module.exports.default = module.exports
module.exports.ewColorPicker = module.exports
