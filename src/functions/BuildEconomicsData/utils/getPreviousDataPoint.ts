interface DataPoint {
    timestamp: number;
}

const getPreviousDataPoint = <T extends DataPoint>(dataPoints: T[]): T | undefined => {
    const currentDate = new Date().getDate();
    return dataPoints.find(({ timestamp }) => {
        const date = new Date(timestamp).getDate();
        return currentDate - date === 1;
    })
}

export default getPreviousDataPoint;