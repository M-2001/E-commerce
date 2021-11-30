const { Product } = require('../models/productSchema');
const { Category } = require('../models/categorySchema');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;



class ProductController {

    static GetProducts = async (req, res) => {
        let filter = {};
        if (req.query.categories) {
            filter = { category: req.query.categories.split(',') };
        }

        const productList = await Product.find(filter).populate('category');
        if (!productList) {
            res.status(500).json({ ok: false, message: "No products" })
        }
        res.send(productList);
    }

    static GetProductByID = async (req, res) => {
        try {
            const product = await Product.findById(req.params.id).populate('category');
            if (!product) {
                res.json({ product, ok: true })
            }
            res.json({ ok: true, product })

        } catch (error) {
            return res.status(400).json({ ok: false, message: 'Product not found!' });
        }
    }


    static AddProduct = async (req, res) => {

        let _id = req.body.category;
        if (mongoose.Types.ObjectId.isValid(req.body.category)) {
            const category = await Category.findById(_id);

            const file = req.file;
            if (!file) return res.status(400).json({ OK: false, message: 'No image in file request' });
            const fileName = req.file.filename;
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

            const product = new Product({
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: `${basePath}${fileName}`,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured
            })
            const Newproduct = await product.save();
            return res.send(Newproduct);
        }
        return res.status(400).json({ OK: false, message: 'Ivalid Category' });
    }

    static UpdateProduct = async (req, res) => {
        // if (!mongoose.isValidObjectId(req.params.id)) {
        //     res.status(400).send('Invalid Product Id!')
        // }
        try {
            const category = await Category.findById(req.body.category);
            if (!category) {
                return res.status(400).send('Category not found!')
            }

            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(400).send('Product not found!')
            }

            const file = req.file;
            let imagePath;

            if (file) {
                const fileName = req.file.filename;
                const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
                imagePath = `${basePath}${fileName}`
            }
            else {
                imagePath = product.image;
            }

            const UpdatedProduct = await Product.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: imagePath,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured
            }, { new: true })
            if (!UpdatedProduct)
                return res.status(500).send('the product cannot be updated')

            res.json({ ok: true, UpdatedProduct })
        } catch (error) {
            return res.status(400).json({ ok: false, message: 'Something goes wrong!' })
        }
    }

    static RemoveProduct = async (req, res) => {

        try {
            const product = await Product.findByIdAndRemove(req.params.id)
            if (product) {
                return res.status(200).json({ ok: false, message: 'Product deleted' })
            }
            else {
                return res.status(404).json({ ok: false, message: 'product not found!' })
            }
        } catch (error) {
            return res.status(500).json({ ok: false, message: "Something goes wrong!" })
        }
    }

    static GetCountProducts = async (req, res) => {
        try {

            const productCount = await Product.countDocuments();
            if (!productCount) {
                res.status(500).json({ ok: false, message: "No count!" })
            }
            res.send({ count: productCount })
        } catch (error) {
            return res.status(500).json({ message: "Something goes wrong!", error })
        }


    }

    static GetFeaturedProducts = async (req, res) => {
        try {
            const count = req.params.count ? req.params.count : 0
            const products = await Product.find({ isFeatured: true }).limit(+count)
            if (!products) {
                res.status(500).json({ ok: false, message: "No count!" })
            }
            res.send({ products })
        } catch (error) {
            return res.status(500).json({ message: "Something goes wrong!", error })
        }


    }

    static AddGallery = async (req, res) => {

        try {
            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).send('Invalid Product Id')
            }
            
            const files = req.files;
            let imagePaths = [];
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

            if (files) {
                files.map(file => {
                    imagePaths.push(`${basePath}${file.filename}`);
                })
            }

            const product = await Product.findByIdAndUpdate(req.params.id, {
                images: imagePaths
            }, { new: true })
            if (!product)
                return res.status(500).send('the product cannot be updated')

            res.json({ ok: true, product })

        } catch (error) {
            return res.status(400).json({ ok: false, message: 'Something goes wrong!' })
        }
    }

}

module.exports = ProductController;