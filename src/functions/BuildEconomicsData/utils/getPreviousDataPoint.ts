interface DataPoint {
    timestamp: number;
}

const getPreviousDataPoint = <T extends DataPoint>(dataPoints: T[]): T | undefined => {
    const now = new Date();

    const yesterday = now;
    yesterday.setDate(now.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    return dataPoints.find(({ timestamp }) => {
        const date = new Date(timestamp);
        date.setHours(0, 0, 0, 0);

        return date.getTime() === yesterday.getTime();
    })
}

export default getPreviousDataPoint;