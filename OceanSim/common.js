function shorthand() {
    let funcs = 'add,sub,mult,div,dot,cross,angleBetween,random2D,dist'.split(',')
    for (func of funcs) window[func] = p5.Vector[func].bind(p5.Vector)
    window.vec = createVector
}
