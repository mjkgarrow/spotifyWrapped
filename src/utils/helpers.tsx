import * as d3 from "d3";

export const getList = (items: any[], key: string) => {
    return items.reduce((prev, item) => {
        return [...prev, item[key]]
    }, [])
}

export const getAverage = (items: any[]): number => {
    let average: number = 0

    items.forEach(item => average += item)

    return roundTwoDec(average / items.length)
}

export const getMedian = (items: any[]): number => {
    const { length } = items;

    items.sort((a, b) => a - b)

    if (length % 2 === 0) {
        return roundTwoDec((items[length / 2 - 1] + items[length / 2]) / 2)
    }

    return roundTwoDec(items[(length - 1) / 2])
};

export const getMode = (items: any[]) => {
    const mode: { [key: string]: number } = {};
    let max = 0, count = 0;

    items.forEach(item => {
        const itemValue = roundTwoDec(item)

        if (mode[itemValue]) {
            mode[itemValue]++;
        } else {
            mode[itemValue] = 1;
        }

        if (count < mode[itemValue]) {
            max = itemValue;
            count = mode[itemValue];
        }

    });

    return max;
};

export const getRange = (items: any[]): number => {

    let min: number = items[0];
    let max: number = items[0];

    items.forEach(item => {
        const itemValue = item;
        if (typeof itemValue === 'number') {
            if (min === undefined || itemValue < min) {
                min = itemValue;
            }
            if (max === undefined || itemValue > max) {
                max = itemValue;
            }
        }
    });

    return roundTwoDec(max - min)
};

const roundTwoDec = (num: number) => {
    return Math.round((num + Number.EPSILON) * 100) / 100
}


type KernelFunction = (v: number) => number;

// Function to compute density
export function kernelDensityEstimator(kernel: KernelFunction, X: number[]) {
    return function (V: number[]) {
        return X.map(function (x) {
            return [
                x,
                d3.mean(V, function (v: number) {
                    return kernel(x - v);
                }),
            ];
        });
    };
}

export function kernelEpanechnikov(k: number) {
    return function (v: number) {
        return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
    };
}