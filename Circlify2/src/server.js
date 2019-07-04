{
    const request = require( "request" )
    const express = require( "express" )

    const app = express()
    const port = 8080

    app.set( "etag", false )

    app.get( "/p", ( req, res ) => {
        res.header( "Cache-Control", "no-cache" )
        request.get( "https://image3.mouthshut.com/images/imagesp/925016986s.jpg" ).pipe( res )
    } )

    app.use( express.static( "src/www" ) )

    app.listen( port, () => console.log( "Sup?" ) )
}