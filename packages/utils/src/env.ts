export const isBrowser = typeof window !== 'undefined';

export const ua = isBrowser && navigator.userAgent.toLowerCase();

export const isMobile = ua && ua.match(/(iPhone|iPod|Android|ios)/i);

export let supportsPassive = false;
if (isBrowser) {
    const EventName = 'test-passive';
    try {
        const opts = {}
        Object.defineProperty(opts, 'passive', {
            get() {
                supportsPassive = true
            },
        }) // https://github.com/facebook/flow/issues/285
        window.addEventListener(EventName, () => { }, opts)
    } catch (error) {
        // 忽略错误，supportsPassive 保持为 false
    }
}