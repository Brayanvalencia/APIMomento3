const express = require('express');
const router = express.Router();

const passport = require('passport');

//Ruta de inicio
router.get('/', (req, res, next) => {
    res.render('index')
})

//Registro de usuarios
router.get('/signup', (req, res, next) => {
    res.render('signup')
})

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    passReqToCallback: true
}));

//Login de Usuarios
router.get('/signin', (req, res, next) => {
    res.render('signin');
})

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}))

router.get('/logout',(req, res, next) =>{
    req.logout();
    res.redirect('/');
})    

router.get('/profile', isAuthenticated,(req, res, next) =>{
    res.render('profile')
})

router.post('/profile',( req, res, next) => {
    res.redirect('/')
})

function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
        return next()
    }
    res.redirect(('singin'))
}

//Creación de API Rest
// y Creación de rutas como endPoints

router.get('/api/product',(req, res) => {
    // res.send(200, {products: []})
    Product.find({},(err, products) =>{
        if (err) return res.status(500).send({
            message: `Error when requesting: ${err}`
        })

        if (!products) return res.status(404).send({
            message: 'There are no products'
        })

        res.status(200).send({products})
    })
})

router.get('/api/product/:ProductId',(req,res) => {
    let productId = req.params.productId
    Product.findById(productId, (err, product) => {
        if (err) return res.status(500).send({
            message: `Erroro when requesting: ${err}`
        })

        if (!product) return res.status(404).send({
            message: 'Product does no exist'
        })

        res.status(200).send({product})
    })

})

router.post('/api/product',(req, res) => {

    //Use schema y registra los productos en la base de datos
    console.log('POST /api/product')
    console.log(req.body)
    
    let product = new Product()
    
    product.name = req.body.name
    product.price = req.body.price
    product.category = req.body.category
    product.image = req.body.image

    product.save( (err, productStored) => {
        if (err) res.status(500).send( {message: `save erro: ${err}`} )

        res.status(200).send( {product: productStored} )
    })
})

router.put('/api/product/:ProductId',(req,res) => {
    let productId = req.params.productId
    let updateData = req.body

    Product.findByIdAndUpdate(productId, updateData, (err, productUpdated) => {
        if (err) return res.status(500).send({
            message: `Failed to update data: ${err}`
        })

        res.status(200).send({product: productUpdated})
    })
})

router.delete('/api/product/:ProductId',(req,res) =>{
    let productId = req.params.productId

    Product.findById(productId, (err, product) => {
        if (err) return res.status(500).send({
            message: `Error deliting: ${err}`
        })

        if (product) return res.status(404).send({
            message: 'The product does no exist'
        })

        product.remove(err => {
            if (err) return res.status(500).send({
                message: `Error deleting: ${err}`
            })

            res.status(200).send({
                message: 'Product remove'
            })
        })
    })
})



module.exports = router;