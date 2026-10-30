import { getStyle, setStyle } from "./dom";
import ewColorPicker  from "@ew-color-picker/core";

// 动画工具模块
export interface AnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
}

// 基础动画类
export class Animation {
  private element: HTMLElement;
  private options: AnimationOptions;

  constructor(element: HTMLElement, options: AnimationOptions = {}) {
    this.element = element;
    this.options = {
      duration: 300,
      easing: 'ease-out',
      delay: 0,
      ...options
    };
  }

  // 显示动画
  show(): Promise<void> {
    return new Promise((resolve) => {
      setStyle(this.element, {
        display: 'block'
      });
      resolve();
    });
  }

  // 隐藏动画
  hide(): Promise<void> {
    return new Promise((resolve) => {
      setStyle(this.element, {
        display: 'none'
      });
      resolve();
    });
  }

  // 滑下动画
  slideDown(): Promise<void> {
    return new Promise((resolve) => {
      // 先设置为 block 以获取真实高度
      setStyle(this.element, {
        display: 'block',
        visibility: 'hidden'
      });     
      // 获取元素的完整高度（包括 padding 和 border）
      const marginTop = getStyle(this.element, 'marginTop') as string;
      const marginBottom = getStyle(this.element, 'marginBottom') as string;
      const height = this.element.offsetHeight + 
        parseInt(marginTop) + 
        parseInt(marginBottom);
      
      setStyle(this.element, {
        height: '0px',
        overflow: 'hidden',
        visibility: 'visible'
      });
      
      // 强制重排
      this.element.offsetHeight;
      
      setTimeout(() => {
        setStyle(this.element, {
          transition: `height ${this.options.duration}ms ${this.options.easing}`,
          height: `${height}px`
        });
        
        setTimeout(() => {
          setStyle(this.element, {
            height: '',
            overflow: '',
            transition: ''
          });
          resolve();
        }, this.options.duration!);
      }, this.options.delay);
    });
  }

  // 滑上动画
  slideUp(): Promise<void> {
    return new Promise((resolve) => {
      // 获取元素的完整高度
      const marginTop = getStyle(this.element, 'marginTop') as string;
      const marginBottom = getStyle(this.element, 'marginBottom') as string;
      const height = this.element.offsetHeight + 
        parseInt(marginTop) + 
        parseInt(marginBottom);
      
      // 设置初始状态
      setStyle(this.element, {
        height: `${height}px`,
        overflow: 'hidden'
      });
      
      // 强制重排
      this.element.offsetHeight;
      
      setTimeout(() => {
        setStyle(this.element, {
          height: '0px',
          transition: `height ${this.options.duration}ms ${this.options.easing}`
        });
        
        setTimeout(() => {
          setStyle(this.element, {
            height: '',
            overflow: '',
            transition: '',
            display: 'none'
          });
          resolve();
        }, this.options.duration!);
      }, this.options.delay);
    });
  }

  // 淡入动画
  fadeIn(): Promise<void> {
    return new Promise((resolve) => {
      const element = this.element;
      const duration = this.options.duration!;
      
      // 设置初始状态
      setStyle(element, {
        display: 'block',
        opacity: '0'
      });

      
      // 强制重排
      element.offsetHeight;
      
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用 ease-out 缓动函数
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        setStyle(element, {
          opacity: easeProgress.toString()
        });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setStyle(element, {
            opacity: '1'
          });
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }

  // 淡出动画
  fadeOut(): Promise<void> {
    return new Promise((resolve) => {
      const element = this.element;
      const duration = this.options.duration!;
      
      // 确保元素可见
      setStyle(element, {
        display: 'block',
        opacity: '1'
      });
      
      // 强制重排
      element.offsetHeight;
      
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用 ease-in 缓动函数
        const easeProgress = Math.pow(progress, 3);
        setStyle(element, {
          opacity: (1 - easeProgress).toString()
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setStyle(element, {
            display: 'none',
            opacity: '0'
          });
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }
}

// 动画工具函数
export const ani = {
  show: (element: HTMLElement, duration: number = 300): Promise<void> => {
    return new Animation(element, { duration }).show();
  },
  
  hide: (element: HTMLElement, duration: number = 300): Promise<void> => {
    return new Animation(element, { duration }).hide();
  },
  
  slideDown: (element: HTMLElement, duration: number = 300): Promise<void> => {
    return new Animation(element, { duration }).slideDown();
  },
  
  slideUp: (element: HTMLElement, duration: number = 300): Promise<void> => {
    return new Animation(element, { duration }).slideUp();
  },
  
  fadeIn: (element: HTMLElement, duration: number = 300): Promise<void> => {
    return new Animation(element, { duration }).fadeIn();
  },
  
  fadeOut: (element: HTMLElement, duration: number = 300): Promise<void> => {
    return new Animation(element, { duration }).fadeOut();
  }
};

// 获取动画类型
export function getAnimationType(scope: ewColorPicker): string {
  return scope.options?.togglePickerAnimation || 'default';
}

// 打开动画
export function open(expression: string, picker: HTMLElement, time: number = 300): Promise<void> {
  time = time > 10000 ? 10000 : time;
  let animation = '';
  
  switch(expression) {
    case 'height':
      animation = 'slideDown';
      break;
    case 'opacity':
      animation = 'fadeIn';
      break;
    default:
      animation = 'show';
  }
  
  return ani[animation as keyof typeof ani](picker, time);
}

// 关闭动画
export function close(expression: string, picker: HTMLElement, time: number = 300): Promise<void> {
  time = time > 10000 ? 10000 : time;
  let animation = '';
  
  switch(expression) {
    case 'height':
      animation = 'slideUp';
      break;
    case 'opacity':
      animation = 'fadeOut';
      break;
    default:
      animation = 'hide';
  }
  
  return ani[animation as keyof typeof ani](picker, time);
} 

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
} 