function cumulativeGradient(pixels, width, height) {
    let result = new Uint32Array( width * height )

    for ( let y = 0; y < height; y++ ) {
        let sum = 0
        for ( let x = 0; x < width; x++ ) {
            let i = ( y * width + x ) * 4
            let j = ( ( y + 1 ) * width + x ) * 4
            let k = ( y * width + x + 1 ) * 4

            for ( let c = 0; c < 3; c++ ) {
                if ( y < height - 1 )
                    sum += ( pixels[i + c] - pixels[j + c] ) ** 2
                if ( x < width - 1 )
                    sum += ( pixels[i + c] - pixels[k + c] ) ** 2
            }

            result[i / 4] = sum
        }
    }

    for ( let x = 0; x < width; x++ ) {
        let sum = 0
        for ( let y = 0; y < height; y++ ) {
            let i = y * width + x
            sum += result[i]
            result[i] = sum
        }
    }

    return result
}

function getCumulativeGradient( cgrad, x, y ) {
    x = Math.max( 0, Math.min( x, width - 1 ) )
    y = Math.max( 0, Math.min( y, height - 1 ) )
    return cgrad[y * width + x]
}

function sumGrad( cgrad, x, y, r ) {
    let a = getCumulativeGradient( cgrad, x + r, y + r )
    let b = getCumulativeGradient( cgrad, x - r, y + r )
    let c = getCumulativeGradient( cgrad, x + r, y - r )
    let d = getCumulativeGradient( cgrad, x - r, y - r )
    return a - b - c + d
}