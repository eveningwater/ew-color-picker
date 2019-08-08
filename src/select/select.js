
import style from './css';
function ewSelect(option){
    this.select = option.el;
    this.openFlag = false;
    return this;
}
ewSelect.prototype.hasValue = function(value,attr){
    if (!value) {
        this.select.setAttribute('placeholder', '请选择' + attr);
    } else {
        this.select.removeAttribute('placeholder');
    }
}
ewSelect.prototype.selectHandle = function() {
    if (!this.openFlag) {
        this.select.classList.add('rotateY');
        this.select.firstChild.style.display = 'block';
    } else {
        this.select.classList.remove('rotateY');
        this.select.firstChild.style.display = 'none';
    }
}
ewSelect.prototype.selectBlur = function(){
    this.select.onblur = function () {
        if (this.openFlag) {
            this.select.classList.remove('rotateY');
            this.openFlag = false;
            this.select.firstChild.style.display = 'none';
        }
    };
}