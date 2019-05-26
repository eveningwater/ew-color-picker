import css from 'raw-loader!./colorpicker.css';
import { createElement } from '../util/util'
const style = createElement('style');
style.textContent = css;
export default style;