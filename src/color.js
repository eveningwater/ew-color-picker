import util from './util';
// HEX color 
export const colorRegExp = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
// RGB color 
export const colorRegRGB = /[rR][gG][Bb][Aa]?[\(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?[\s]*(0\.\d{1,2}|1|0)?[\)]{1}/g;
// RGBA color
export const colorRegRGBA = /^[rR][gG][Bb][Aa][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){3}[\\s]*(1|1.0|0|0?.[0-9]{1,2})[\\s]*[\)]{1}$/;
// hsl color
export const colorRegHSL = /^[hH][Ss][Ll][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*)[\)]$/;
// HSLA color
export const colorRegHSLA = /^[hH][Ss][Ll][Aa][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,){2}([\\s]*(1|1.0|0|0?.[0-9]{1,2})[\\s]*)[\)]$/;
/**
 * hex to rgba
 * @param {*} hex 
 * @param {*} alpha 
 */
export function colorHexToRgba(hex, alpha) {
    let a = alpha || 1, hColor = hex.toLowerCase(), hLen = hex.length, rgbaColor = [];
    if (hex && colorRegExp.test(hColor)) {
        //the hex length may be 4 or 7,contained the symbol of #
        if (hLen === 4) {
            let hSixColor = '#';
            for (let i = 1; i < hLen; i++) {
                let sColor = hColor.slice(i, i + 1);
                hSixColor += sColor.concat(sColor);
            }
            hColor = hSixColor;
        }
        for (let j = 1, len = hColor.length; j < len; j += 2) {
            rgbaColor.push(parseInt('0X' + hColor.slice(j, j + 2), 16));
        }
        return util.removeAllSpace(("rgba(" + rgbaColor.join(",") + ',' + a + ")"));
    } else {
        return util.removeAllSpace(hColor);
    }
}
/**
 * rgba to hex
 * @param {*} rgba 
 */
export function colorRgbaToHex(rgba) {
    const hexObject = { 10: 'A', 11: 'B', 12: 'C', 13: 'D', 14: 'E', 15: 'F' },
        hexColor = function (value) {
            value = Math.min(Math.round(value), 255);
            const high = Math.floor(value / 16), low = value % 16;
            return '' + (hexObject[high] || high) + (hexObject[low] || low);
        }
    const value = '#';
    if (/rgba?/.test(rgba)) {
        let values = rgba.replace(/rgba?\(/, '').replace(/\)/, '').replace(/[\s+]/g, '').split(','), color = '';
        values.map(function (value, index) {
            if (index <= 2) {
                color += hexColor(value);
            }
        })
        return util.removeAllSpace(value + color);
    }
}
/**
 * hsb to rgba
 * @param {*} hsb 
 * @param {*} alpha 
 */
export function colorHSBaToRgba(hsb, alpha) {
    let r, g, b, a = hsb.a;//rgba(r,g,b,a)
    let h = hsb.h, s = hsb.s * 255 / 100, v = hsb.b * 255 / 100;//hsv(h,s,v)
    if (s === 0) {
        r = g = b = v;
    } else {
        let t = v, p = (255 - s) * v / 255, q = (t - p) * (h % 60) / 60;
        if (h === 360) {
            r = t; g = b = 0;
        } else if (h < 60) {
            r = t; g = p + q; b = p;
        } else if (h < 120) {
            r = t - q; g = t; b = p;
        } else if (h < 180) {
            r = p; g = t; b = p + q;
        } else if (h < 240) {
            r = p; g = t - q; b = t;
        } else if (h < 300) {
            r = p + q; g = p; b = t;
        } else if (h < 360) {
            r = t; g = p; b = t - q;
        } else {
            r = g = b = 0;
        }
    }
    if (alpha >= 0 || alpha <= 1) a = alpha;
    return util.removeAllSpace(('rgba(' + Math.ceil(r) + ',' + Math.ceil(g) + ',' + Math.ceil(b) + ',' + a + ')'));
}
/**
 * hsla to rgba
 * 换算公式:https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4#%E4%BB%8EHSL%E5%88%B0RGB%E7%9A%84%E8%BD%AC%E6%8D%A2
 * @param {*} hsla 
 */
export function colorHslaToRgba(hsla) {
    let h = hsla.h, s = hsla.s / 100, l = hsla.l / 100, a = hsla.a;
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    } else {
        let compareRGB = (p, q, t) => {
            if (t > 1) t = t - 1;
            if (t < 0) t = t + 1;
            if (t < 1 / 6) return p + ((q - p) * 6 * t);
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + ((q - p) * 6 * (2 / 3 - t));
            return p;
        }
        let q = l >= 0.5 ? l + s - l * s : l * (1 + s),
            p = 2 * l - q,
            k = h / 360;
        r = compareRGB(p, q, k + 1 / 3);
        g = compareRGB(p, q, k);
        b = compareRGB(p, q, k - 1 / 3);
    }
    return util.removeAllSpace(`rgba(${Math.ceil(r * 255)},${Math.ceil(g * 255)},${Math.ceil(b * 255)},${a})`);
}
/**
 * rgba to hsla
 * 换算公式:https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4#%E4%BB%8EHSL%E5%88%B0RGB%E7%9A%84%E8%BD%AC%E6%8D%A2
 * @param {*} rgba 
 */
export function colorRgbaToHsla(rgba) {
    const rgbaArr = rgba.slice(rgba.indexOf('(') + 1, rgba.lastIndexOf(')')).split(',');
    let a = rgbaArr.length < 4 ? 1 : parseInt(rgbaArr[3]);
    let r = parseInt(rgbaArr[0]) / 255,
        g = parseInt(rgbaArr[1]) / 255,
        b = parseInt(rgbaArr[2]) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g >= b ? 0 : 6);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
    }
    return {
        colorStr: util.removeAllSpace(('hsla(' + Math.ceil(h * 60) + ',' + Math.ceil(s * 100) + '%,' + Math.ceil(l * 100) + '%,' + a + ')')),
        colorObj: {
            h: h,
            s: s,
            l: l,
            a: a
        }
    };
}
/**
 * rgba to hsb
 * @param {*} rgba 
 */
export function colorRgbaToHSBa(rgba) {
    const rgbaArr = rgba.slice(rgba.indexOf('(') + 1, rgba.lastIndexOf(')')).split(',');
    let a = rgbaArr.length < 4 ? 1 : parseInt(rgbaArr[3]);
    let r = parseInt(rgbaArr[0]) / 255,
        g = parseInt(rgbaArr[1]) / 255,
        b = parseInt(rgbaArr[2]) / 255;
    let h, s, v;
    let min = Math.min(r, g, b);
    let max = v = Math.max(r, g, b);
    let diff = max - min;
    if (max === 0) {
        s = 0;
    } else {
        s = 1 - min / max;
    }
    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r:
                h = (g - b) / diff + (g < b ? 6 : 0);
                break;
            case g:
                h = 2.0 + (b - r) / diff;
                break;
            case b:
                h = 4.0 + (r - g) / diff;
                break;
        }
        h = h * 60;
    }


    s = s * 100;
    v = v * 100;
    return {
        h: h,
        s: s,
        b: v,
        a: a
    }
}
/* 
* 任意色值（甚至是CSS颜色关键字）转换为RGBA颜色的方法
* 此方法IE9+浏览器支持，基于DOM特性实现 
* @param {*} color 
*/
export function colorToRgba(color) {
    const div = document.createElement('div');
    util.setCss(div, 'backgroundColor', color);
    document.body.appendChild(div);
    const c = util.getCss(div, 'backgroundColor');
    document.body.removeChild(div);
    let lastValue = c.slice(c.lastIndexOf(',') + 1, c.lastIndexOf(')')).trim();
    let isAlpha = lastValue.indexOf('.') > -1;
    let result = isAlpha ? c : c.slice(0, 2) + 'ba' + c.slice(3, c.length - 1) + ', 1)';
    return util.removeAllSpace(result);
};
/**
 * 判断是否是合格的颜色值
 * @param {*} color 
 */
export function isValidColor(color) {
    return colorRegExp.test(color) || colorRegRGB.test(color) || colorRegRGBA.test(color) || colorRegHSL.test(color) || colorRegHSLA.test(color);
}