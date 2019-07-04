{
    const request = require( "request" )
    const express = require( "express" )

    const app = express()
    const port = 8080

    app.set( "etag", false )

    app.get( "/proxy", ( req, res ) => {
        request.get( "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/5708/5708825_sa.jpg" ).pipe( res )
    } )

    app.use( express.static( "src/www" ) )

    app.listen( port, () => console.log( "Sup?" ) )
}