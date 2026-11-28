// 在线 Playground 的示例代码合集。
// 所有示例都通过 CDN 加载已发布的产物，可直接在 ew-iframe-editor 中运行。

const CDN = 'https://unpkg.com'
const STYLE = `${CDN}/@ew-color-picker/style@2/dist`

const helper = `
var FILE_MAP = { 'ew-color-picker': 'index.min.js' };
function fileOf(pkg) {
  return FILE_MAP[pkg] || pkg.split('/').pop() + '.min.js';
}
function loadScripts(pkgs, cb) {
  var left = pkgs.length;
  if (!left) return cb();
  pkgs.forEach(function (pkg) {
    var script = document.createElement('script');
    script.src = '${CDN}/' + pkg + '@2/dist/' + fileOf(pkg);
    script.async = false;
    script.onload = function () { if (--left === 0) cb(); };
    script.onerror = function () {
      var el = document.getElementById('out');
      if (el) el.textContent = '资源加载失败：' + pkg;
    };
    document.head.appendChild(script);
  });
}
function out(value) {
  var el = document.getElementById('out');
  if (el) el.textContent = value;
}
`

const baseRules = `
body {
  margin: 0;
  padding: 24px;
  background: #f8fafc;
  color: #0f172a;
  font-family: Inter, -apple-system, "Segoe UI", "PingFang SC", sans-serif;
}
.wrap { max-width: 760px; margin: 0 auto; }
.card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  padding: 20px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}
h3 { margin: 0; font-size: 15px; }
.out {
  margin: 0;
  padding: 8px 10px;
  border-radius: 8px;
  background: #f1f5f9;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 12px;
}
.row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
button {
  padding: 6px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #fff;
  color: #0f172a;
  cursor: pointer;
}
button:hover { border-color: #94a3b8; }
`

const defaultHtml = '<div id="app"></div><p class="out" id="out">颜色: 无</p>'

function createPreset(id, label, js, options = {}) {
  const styles = ['index.css', 'input-number.css', ...(options.styles ?? [])]
  const imports = styles.map((file) => `@import url('${STYLE}/${file}');`).join('\n')
  const packages = options.packages ?? ['ew-color-picker']

  return {
    id,
    label,
    html: `<div class="wrap"><div class="card"><h3>${label}</h3>${
      options.html ?? defaultHtml
    }</div></div>`,
    css: `${imports}\n${baseRules}\n${options.css ?? ''}`,
    js: `${helper}\nloadScripts(${JSON.stringify(packages)}, function () {\n${js}\n});`,
  }
}

export const playgroundPresets = [
  createPreset(
    'basic',
    '01 基础用法',
    `const picker = new ewColorPicker({ el: '#app', defaultColor: '#4096efff' });
picker.on('change', function (color) { out('颜色: ' + color); });`
  ),
  createPreset(
    'layout',
    '02 尺寸与朝向',
    `new ewColorPicker({
  el: '#app',
  size: 'large',
  hueDirection: 'horizontal',
  alphaDirection: 'horizontal',
  defaultColor: '#722ed1aa'
});`
  ),
  createPreset(
    'predefine',
    '03 预定义颜色',
    `new ewColorPicker({
  el: '#app',
  defaultColor: '#3b82f6',
  predefineColor: ['#ef4444', '#22c55e', '#3b82f6', { color: '#0f172a', disabled: true }]
});`
  ),
  createPreset(
    'buttons',
    '04 清空 / 确定按钮',
    `new ewColorPicker({
  el: '#app',
  defaultColor: '#1890ff',
  clearText: '重置',
  sureText: '好',
  clear: function () { out('触发 clear 回调'); },
  sure: function (color) { out('确定: ' + color); }
});`
  ),
  createPreset(
    'events',
    '05 事件与回调',
    `const picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#52c41a',
  changeColor: function (color) { out('changeColor: ' + color); }
});
picker.on('toggle', function (open) { out('toggle: ' + (open ? '打开' : '关闭')); });
picker.on('mode-change', function (mode) { out('模式: ' + mode); });`
  ),
  createPreset(
    'placement',
    '06 面板方位',
    `new ewColorPicker({
  el: '#app',
  panelPlacement: 'top-start',
  autoPanelPosition: true,
  defaultColor: '#1890ff'
});`
  ),
  createPreset(
    'animation',
    '07 展开动画',
    `new ewColorPicker({
  el: '#app',
  togglePickerAnimation: 'height',
  pickerAnimationTime: 600,
  defaultColor: '#faad14'
});`
  ),
  createPreset(
    'disabled',
    '08 禁用与动态切换',
    `var picker = new ewColorPicker({ el: '#app', disabled: true, defaultColor: '#1890ff' });
document.getElementById('enable').onclick = function () {
  picker.updateOptions({ disabled: false });
  out('已启用');
};
document.getElementById('disable').onclick = function () {
  picker.updateOptions({ disabled: true });
  out('已禁用');
};`,
    {
      html: `<div id="app"></div>
<div class="row"><button id="enable">启用</button><button id="disable">禁用</button></div>
<p class="out" id="out">当前：禁用</p>`,
    }
  ),
  createPreset(
    'color-mode',
    '09 颜色模式',
    `const picker = new ewColorPicker({ el: '#app', defaultMode: 'hex', defaultColor: '#722ed1' });
picker.on('mode-change', function (mode) { out('模式: ' + mode); });`
  ),
  createPreset(
    'api',
    '10 实例 API',
    `var picker = new ewColorPicker({ el: '#app', defaultColor: '#1890ff' });
document.getElementById('set').onclick = function () {
  picker.setColor('#f5222d');
  out('已 setColor(#f5222d)');
};
document.getElementById('get').onclick = function () { out('getColor() = ' + picker.getColor()); };
document.getElementById('show').onclick = function () { picker.showPanel(); };
document.getElementById('hide').onclick = function () { picker.hidePanel(); };`,
    {
      html: `<div id="app"></div>
<div class="row">
  <button id="set">setColor</button>
  <button id="get">getColor</button>
  <button id="show">showPanel</button>
  <button id="hide">hidePanel</button>
</div>
<p class="out" id="out">等待操作</p>`,
    }
  ),
  createPreset(
    'input-number',
    '11 InputNumber 独立使用',
    `const number = new InputNumber.InputNumber({
  value: 128,
  min: 0,
  max: 255,
  onChange: function (value) { out('值: ' + value); }
});
document.getElementById('app').appendChild(number.getElement());`,
    {
      packages: ['@ew-color-picker/utils', '@ew-color-picker/input-number'],
      html: '<div id="app"></div><p class="out" id="out">值: 128</p>',
    }
  ),
  createPreset(
    'multi',
    '12 多实例',
    `new ewColorPicker({ el: '#a', defaultColor: '#4096ef' });
new ewColorPicker({ el: '#b', defaultColor: '#f5222d' });`,
    {
      html: `<div class="row"><div id="a"></div><div id="b"></div></div>
<p class="out" id="out">两个实例互不影响</p>`,
    }
  ),
  createPreset(
    'eyedropper',
    '13 吸管取色',
    `new ewColorPicker({
  el: '#app',
  defaultColor: '#1890ff',
  onEyedropperPick: function (color) { out('取色结果: ' + color); }
});`
  ),
  createPreset(
    'copy-color',
    '14 复制颜色',
    `new ewColorPicker({
  el: '#app',
  defaultColor: '#8b5cf6',
  copyColorText: '点我复制颜色',
  copiedText: '复制成功',
  onCopyColor: function (color) { out('最近复制: ' + color); }
});`
  ),
  createPreset(
    'select-plugin',
    '15 Select 下拉插件',
    `var picker = new ewColorPicker({
  el: '#app',
  defaultColor: '#3b82f6',
  selectItems: [
    { label: '红色', value: '#ef4444' },
    { label: '绿色', value: '#22c55e' },
    { label: '蓝色', value: '#3b82f6' },
    { label: '禁用项', value: '#0f172a', disabled: true }
  ],
  onSelectChange: function (value) {
    picker.setColor(value);
    out('选择: ' + value);
  }
});`,
    { styles: ['select.css'] }
  ),
  createPreset(
    'gradient',
    '16 渐变',
    `new ewColorPicker({
  el: '#app',
  defaultColor: '#ef4444',
  gradientStops: ['#ef4444', '#f59e0b', '#3b82f6'],
  gradientType: 'linear',
  gradientAngle: 90,
  gradientChange: function (css) { out(css); }
});`,
    { styles: ['select.css', 'checkbox.css'] }
  ),
  createPreset(
    'checkbox',
    '17 Checkbox 插件',
    `new ewColorPicker({
  el: '#app',
  defaultColor: '#4096ef',
  checkboxLabel: '反向渐变',
  checkboxChecked: false,
  onCheckboxChange: function (checked) { out('checked: ' + checked); }
});`,
    { styles: ['checkbox.css'] }
  ),
  createPreset(
    'boundary',
    '18 面板边界',
    `new ewColorPicker({
  el: '#app',
  autoPanelPosition: true,
  boundary: '#box',
  defaultColor: '#1890ff'
});`,
    {
      html: `<div id="box" class="scroll"><div id="app"></div></div>
<p class="out" id="out">在滚动容器内自动定位</p>`,
      css: `.scroll {
  width: 100%;
  height: 180px;
  padding: 12px;
  overflow: auto;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
}`,
    }
  ),
  createPreset(
    'panel-mode',
    '19 面板模式',
    `new ewColorPicker({
  el: '#app',
  panelMode: 'mini',
  hueDirection: 'horizontal',
  alphaDirection: 'horizontal',
  gradientStops: ['#f00', '#00f']
});`,
    { styles: ['select.css', 'checkbox.css'] }
  ),
  createPreset(
    'tooltip',
    '20 Tooltip 独立使用',
    `new Tooltip.Tooltip({ target: '#dark', content: '这是一条 dark 主题提示' });
new Tooltip.Tooltip({
  target: '#click',
  content: 'click 触发，再次点击关闭',
  trigger: 'click'
});`,
    {
      packages: ['@ew-color-picker/utils', '@ew-color-picker/tooltip'],
      styles: ['tooltip.css'],
      html: `<div class="row">
  <button id="dark">dark 提示</button>
  <button id="click">click 触发</button>
</div>
<p class="out" id="out">悬浮或点击按钮查看提示</p>`,
    }
  ),
  createPreset(
    'select-component',
    '21 Select 独立使用',
    `const select = new Select.Select({
  items: [
    { label: '红色', value: '#ef4444' },
    { label: '绿色', value: '#22c55e' },
    { label: '蓝色', value: '#3b82f6' }
  ],
  placeholder: '请选择颜色',
  onChange: function (value) { out('当前值: ' + value); }
});
document.getElementById('app').appendChild(select.getElement());`,
    {
      packages: [
        '@ew-color-picker/utils',
        '@ew-color-picker/tooltip',
        '@ew-color-picker/select',
      ],
      styles: ['tooltip.css', 'select.css'],
      html: '<div id="app"></div><p class="out" id="out">当前值: 无</p>',
    }
  ),
  createPreset(
    'input-component',
    '22 Input 独立使用',
    `const input = new Input.Input({
  placeholder: '请输入内容',
  onChange: function (value) { out('当前值: ' + (value || '空')); }
});
document.getElementById('app').appendChild(input.getElement());`,
    {
      packages: ['@ew-color-picker/utils', '@ew-color-picker/input'],
      styles: ['input.css'],
      html: '<div id="app"></div><p class="out" id="out">当前值: 空</p>',
    }
  ),
  createPreset(
    'button-component',
    '23 Button 独立使用',
    `[['default', '默认'], ['primary', '主要'], ['danger', '危险'], ['text', '文字']].forEach(function (item) {
  var button = new Button.Button({
    text: item[1],
    type: item[0],
    onClick: function () { out('点击: ' + item[1]); }
  });
  document.getElementById('app').appendChild(button.getElement());
});`,
    {
      packages: ['@ew-color-picker/utils', '@ew-color-picker/button'],
      styles: ['button.css'],
      html: '<div id="app" class="row"></div><p class="out" id="out">点击按钮查看效果</p>',
    }
  ),
  createPreset(
    'umd',
    '24 UMD 全量引入',
    `// 通过 CDN 加载 ew-color-picker 的 UMD 全量包，已内置全部插件
const picker = new ewColorPicker({ el: '#app', defaultColor: '#6366f1' });
picker.on('change', function (color) { out('颜色: ' + color); });`,
    {
      html: '<div id="app"></div><p class="out" id="out">通过 unpkg 加载 UMD 全量包</p>',
      styles: ['select.css', 'checkbox.css']
    }
  ),
  createPreset(
    'checkbox-component',
    '25 Checkbox 独立使用',
    `var checkbox = new Checkbox.Checkbox({
  label: '记住我的选择',
  checked: false,
  onChange: function (checked) { out('checked: ' + checked); }
});
document.getElementById('app').appendChild(checkbox.getElement());

document.getElementById('toggle').onclick = function () {
  checkbox.setChecked(!checkbox.isChecked());
};`,
    {
      packages: ['@ew-color-picker/utils', '@ew-color-picker/checkbox'],
      styles: ['checkbox.css'],
      html: `<div id="app"></div>
<div class="row"><button id="toggle">切换选中状态</button></div>
<p class="out" id="out">checked: false</p>`,
    }
  ),
]
