const { Category } = require('../models/categorySchema');
class CategoryController {
    
    static GetCategories = async (req, res) => {
        const categoryList = await Category.find();

        if (!categoryList) {
            res.status(500).json({ success: false })
        }
        res.status(200).send(categoryList);
    }

    static AddCategory = async (req, res)=>{
        const category = new Category({
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        })
        category.save().then((sucess) => {
            res.json({ok: true, category})
        }).catch((err) => {
            return res.json({ok: false, err});
        });
    }

    static RemoveCategory = async (req, res) =>{
        try {
            const category = await Category.findByIdAndRemove(req.params.id)
                if(category){
                    return res.status(200).json({ok:false, message:'Category deleted'})
                }
                else{
                    return res.status(404).json({ok:false, message:'category not found!'})
                }
        } catch (error) {
            return res.status(500).json({ok:false, message:"Something goes wrong!"})
        }
    }

    static GetCategoryByID = async (req, res) =>{
        try {
            const category = await Category.findById(req.params.id);
            if (category) {
                return res.json({ok: true, category});
            }
        } catch (error) {
            return res.status(404).json({ok: false, message: 'Category not found!'})
        }
    }

    static UpdateCategory = async (req, res)=>{
        try {
            const category = await Category.findByIdAndUpdate(req.params.id, {
                name : req.body.name,
                icon: req.body.icon,
                color: req.body.color,
            },{
                new: true,
            });
            if (!category) {
                return res.status(400).send('the category cannot be updated!')
            }
            res.json({ok: true, category});
        } catch (error) {
            return res.status(400).json({ok:false, message:'Something goes wrong!'})
        }
    }
}

module.exports = CategoryController;