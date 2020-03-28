const constructSuffix = (diff, measurement, suffixes) => {
    const m = `${Math.floor(diff / measurement)}`
    const last = parseInt(m[m.length - 1])

    let suffix = ''
    if (last === 0)
        suffix = suffixes[0]
    else if (parseInt(m) >= 11 && parseInt(m) <= 19)
        suffix = suffixes[0]
    else if (last === 1)
        suffix = suffixes[1]
    else if (last <= 4)
        suffix = suffixes[2]
    else if (last > 4)
        suffix = suffixes[0]

    return `${m} ${suffix}`
}

const dateToLabel = date => {
    const curr = new Date()
    console.log({ curr })
    const diff = Math.floor((curr - date) / 1000) // difference in seconds

    const minute = 60
    const hour = 60 * minute
    const day = 24 * hour
    const week = 7 * day
    const month = 30 * day
    const year = 12 * month

    let label = ''
    if (diff < minute) {
        label = 'щойно'
    } else if (diff < hour)
        label = constructSuffix(
            diff, minute, ['хвилин', 'хвилину', 'хвилини'])
    else if (diff < day)
        label = constructSuffix(
            diff, hour, ['годин', 'годину', 'години'])
    else if (diff < week)
        label = constructSuffix(
            diff, day, ['днів', 'день', 'дні'])
    else if (diff < month)
        label = constructSuffix(
            diff, week, ['тижнів', 'тиждень', 'тижні'])
    else if (diff < year)
        label = constructSuffix(
            diff, month, ['місяців', 'місяць', 'місяці'])
    else
        label = constructSuffix(
            diff, year, ['років', 'рік', 'роки'])

    return label
}

module.exports = {
    db: require('./db'),
    crypto: require('./crypto'),
    bc: require('./bc'),
    dateToLabel,
}
