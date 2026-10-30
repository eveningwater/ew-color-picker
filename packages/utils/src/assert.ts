type ConsoleKey = keyof Pick<Console, 'warn' | 'error' | 'log'>;
const assertLists: ConsoleKey[] = ['warn', 'error', 'log'];

// 声明 __DEV__ 变量（由 rollup 插件替换）
declare const __DEV__: boolean;

// 样式配置
const STYLES = {
  log: {
    icon: '📝',
    color: '#4CAF50',
    bgColor: '#E8F5E8',
    borderColor: '#4CAF50'
  },
  warn: {
    icon: '⚠️',
    color: '#FF9800',
    bgColor: '#FFF3E0',
    borderColor: '#FF9800'
  },
  error: {
    icon: '❌',
    color: '#F44336',
    bgColor: '#FFEBEE',
    borderColor: '#F44336'
  }
} as const;

// 格式化消息
const formatMessage = (type: ConsoleKey, ...args: any[]): string[] => {
  const style = STYLES[type];
  const timestamp = new Date().toLocaleTimeString();
  const prefix = `${style.icon} [ewColorPicker ${type.toUpperCase()}] ${timestamp}`;
  
  // 检查第一个参数是否已经包含 %c（表示已经有自定义样式）
  const firstArg = args[0];
  const hasCustomStyle = typeof firstArg === 'string' && firstArg.includes('%c');
  
  if (hasCustomStyle) {
    // 如果已经有自定义样式，只添加前缀，不添加我们的样式
    return [`${prefix} ${firstArg}`, ...args.slice(1)];
  } else {
    // 否则使用我们的默认样式
    return [
      `%c${prefix}`,
      `color: ${style.color}; background: ${style.bgColor}; padding: 2px 6px; border-radius: 4px; border-left: 3px solid ${style.borderColor}; font-weight: bold;`,
      ...args
    ];
  }
};

type AssertRes = {
    [k in ConsoleKey]: <T>(...v: T[]) => void;
};

const noop = () => { };

const assertObj: AssertRes = {
    log: noop,
    warn: noop,
    error: noop
};

// 为每个方法添加样式，只在开发环境中启用
assertLists.forEach(key => {
  assertObj[key] = <T>(...v: T[]) => {
    if (__DEV__) {
      const formattedArgs = formatMessage(key, ...v);
      console[key](...formattedArgs);
    }
  };
});

export const warn = assertObj.warn;
export const error = assertObj.error;
export const log = assertObj.log;

// 简单的断言函数
export const assert = (condition: boolean, message?: string): void => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
};