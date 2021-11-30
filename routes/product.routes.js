const  Router  = require("express");
const ProductController = require("../controllers/product.controller");
const uploadOptions  = require("../middleware/multer");

const router = Router()
const product = ProductController;

router.get('/', product.GetProducts);

router.get('/get/count', product.GetCountProducts);

router.get('/get/featured/:count', product.GetFeaturedProducts);

router.post('/', uploadOptions.single('image'), product.AddProduct);

router.get('/:id', product.GetProductByID)

router.put('/:id', uploadOptions.single('image'), product.UpdateProduct);

router.put('/gallery-images/:id', uploadOptions.array('images', 3), product.AddGallery);

router.delete('/:id', product.RemoveProduct)

module.exports = router;