// src/utils/colorExtractor.js
export class ColorExtractor {
    /**
     * 从图片URL中提取主色调
     */
    static async extractDominantColor(imageSrc, colorCount = 5) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'Anonymous'; // 处理跨域图片

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // 设置canvas尺寸（为了性能，可以缩小图片）
                const maxSize = 100;
                const scale = Math.min(maxSize / img.width, maxSize / img.height);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                // 绘制图片
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // 获取像素数据
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;

                // 使用中位切分法提取主色调
                const dominantColor = this.medianCut(pixels, colorCount);
                resolve(dominantColor);
            };

            img.onerror = reject;
            img.src = imageSrc;
        });
    }

    /**
     * 中位切分算法提取颜色
     */
    static medianCut(pixels, colorCount) {
        // 将像素转换为RGB对象
        const colorBuckets = [];

        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            // 忽略透明或接近透明的像素
            if (pixels[i + 3] < 128) continue;

            colorBuckets.push({ r, g, b });
        }

        // 如果颜色太少，返回平均色
        if (colorBuckets.length < colorCount) {
            return this.getAverageColor(colorBuckets);
        }

        // 实现中位切分算法
        const buckets = [colorBuckets];

        while (buckets.length < colorCount && buckets.length < colorBuckets.length) {
            // 找到颜色范围最大的桶
            let maxRange = -1;
            let bucketIndex = 0;

            buckets.forEach((bucket, index) => {
                const range = this.getColorRange(bucket);
                if (range > maxRange) {
                    maxRange = range;
                    bucketIndex = index;
                }
            });

            // 按照范围最大的通道切分
            const bucketToSplit = buckets[bucketIndex];
            const channel = this.getMaxRangeChannel(bucketToSplit);

            // 按该通道排序并切分
            bucketToSplit.sort((a, b) => a[channel] - b[channel]);
            const medianIndex = Math.floor(bucketToSplit.length / 2);

            const leftBucket = bucketToSplit.slice(0, medianIndex);
            const rightBucket = bucketToSplit.slice(medianIndex);

            // 替换原桶
            buckets.splice(bucketIndex, 1, leftBucket, rightBucket);
        }

        // 计算每个桶的平均颜色
        const avgColors = buckets.map(bucket => this.getAverageColor(bucket));

        // 返回最鲜艳（饱和度最高）的颜色作为主色调
        return this.getMostVibrantColor(avgColors);
    }

    /**
     * 获取颜色范围
     */
    static getColorRange(colors) {
        if (!colors.length) return 0;

        let minR = 255, maxR = 0;
        let minG = 255, maxG = 0;
        let minB = 255, maxB = 0;

        colors.forEach(color => {
            minR = Math.min(minR, color.r);
            maxR = Math.max(maxR, color.r);
            minG = Math.min(minG, color.g);
            maxG = Math.max(maxG, color.g);
            minB = Math.min(minB, color.b);
            maxB = Math.max(maxB, color.b);
        });

        const rangeR = maxR - minR;
        const rangeG = maxG - minG;
        const rangeB = maxB - minB;

        return Math.max(rangeR, rangeG, rangeB);
    }

    /**
     * 获取范围最大的通道
     */
    static getMaxRangeChannel(colors) {
        if (!colors.length) return 'r';

        let minR = 255, maxR = 0;
        let minG = 255, maxG = 0;
        let minB = 255, maxB = 0;

        colors.forEach(color => {
            minR = Math.min(minR, color.r);
            maxR = Math.max(maxR, color.r);
            minG = Math.min(minG, color.g);
            maxG = Math.max(maxG, color.g);
            minB = Math.min(minB, color.b);
            maxB = Math.max(maxB, color.b);
        });

        const rangeR = maxR - minR;
        const rangeG = maxG - minG;
        const rangeB = maxB - minB;

        if (rangeR >= rangeG && rangeR >= rangeB) return 'r';
        if (rangeG >= rangeR && rangeG >= rangeB) return 'g';
        return 'b';
    }

    /**
     * 获取平均颜色
     */
    static getAverageColor(colors) {
        if (!colors.length) return { r: 128, g: 128, b: 128 };

        let totalR = 0, totalG = 0, totalB = 0;

        colors.forEach(color => {
            totalR += color.r;
            totalG += color.g;
            totalB += color.b;
        });

        return {
            r: Math.round(totalR / colors.length),
            g: Math.round(totalG / colors.length),
            b: Math.round(totalB / colors.length)
        };
    }

    /**
     * 获取最鲜艳的颜色
     */
    static getMostVibrantColor(colors) {
        let maxSaturation = -1;
        let mostVibrant = colors[0];

        colors.forEach(color => {
            const hsv = this.rgbToHsv(color.r, color.g, color.b);
            if (hsv.s > maxSaturation) {
                maxSaturation = hsv.s;
                mostVibrant = color;
            }
        });

        return mostVibrant;
    }

    /**
     * RGB转HSV
     */
    static rgbToHsv(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        let h = 0;
        let s = max === 0 ? 0 : delta / max;
        const v = max;

        if (delta !== 0) {
            if (max === r) {
                h = (g - b) / delta + (g < b ? 6 : 0);
            } else if (max === g) {
                h = (b - r) / delta + 2;
            } else {
                h = (r - g) / delta + 4;
            }
            h /= 6;
        }

        return { h, s, v };
    }

    /**
     * HSV转RGB
     */
    static hsvToRgb(h, s, v) {
        let r, g, b;

        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * RGB转HSL
     */
    static rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (delta !== 0) {
            s = delta / (1 - Math.abs(2 * l - 1));

            if (max === r) {
                h = ((g - b) / delta) % 6;
            } else if (max === g) {
                h = (b - r) / delta + 2;
            } else {
                h = (r - g) / delta + 4;
            }

            h *= 60;
            if (h < 0) h += 360;
        }

        return { h, s, l };
    }

    /**
     * HSL转RGB
     */
    static hslToRgb(h, s, l) {
        h /= 360;

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    /**
     * 根据照片主色调生成唱片颜色
     */
    static generateDiscColor(photoColor) {
        // 将RGB转换为HSL
        const hsl = this.rgbToHsl(photoColor.r, photoColor.g, photoColor.b);

        // 根据分析的效果调整参数
        let { h, s, l } = hsl;

        // 保持色相基本不变
        const discH = h;

        // 调整饱和度：增加饱和度，但有上限
        const discS = Math.min(s * 1.2, 0.8);

        // 调整亮度：根据原亮度动态调整
        let discL;
        if (l < 0.3) {
            // 原色很暗时，适当调亮
            discL = Math.min(l * 1.5, 0.6);
        } else if (l > 0.7) {
            // 原色很亮时，适当调暗
            discL = Math.max(l * 0.7, 0.4);
        } else {
            // 中等亮度时微调
            discL = l * 0.9;
        }

        // 添加随机性，使效果更自然
        const randomAdjust = 0.95 + Math.random() * 0.1;
        discL *= randomAdjust;

        // 转换回RGB
        const discRgb = this.hslToRgb(discH, discS, discL);

        // 生成光泽效果的颜色变体
        const highlightRgb = this.hslToRgb(discH, discS * 0.7, Math.min(discL * 1.3, 0.9));
        const shadowRgb = this.hslToRgb(discH, discS, discL * 0.7);

        return {
            base: discRgb,
            highlight: highlightRgb,
            shadow: shadowRgb,
            hsl: { h: discH, s: discS, l: discL }
        };
    }

    /**
     * RGB颜色转CSS字符串
     */
    static rgbToCss(rgb) {
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }

    /**
     * RGB颜色转十六进制
     */
    static rgbToHex(rgb) {
        const toHex = (c) => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
    }
}