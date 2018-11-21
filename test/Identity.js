export const For = () => {
    throw Error('For is not allowed function call')
}

export const Yield = () => {
    throw Error('Yield is not allowed function call')
}

function Identity(value) {
    this.value = value
}

export const pure = (value) => {
    return new Identity(value)
}

export const flatMap = (id, fn) => {
    return fn(id.value)
}

export const map = (id, fn) => {
    return flatMap(id, value => {
        return pure(fn(value))
    })
}

export default {
    pure, flatMap, map
}

