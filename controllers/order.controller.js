const {Order} = require('../models/orderSchema');
const {OrderItem} = require('../models/order-Item');

class OrderController{
    static GetOrders = async (req, res) =>{
        const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});
    
        if(!orderList) {
            res.status(500).json({success: false})
        } 
        res.send(orderList);
    }

    static GetOrderById = async (req, res) =>{
        const order = await Order.findById(req.params.id)
        .populate('user', 'name')
        .populate({path: 'orderItems', populate: {path: 'product', populate:'category'}});
        if(!order) {
            res.status(500).json({success: false})
        } 
        res.send(order);
    }

    static newOrder = async (req, res)=>{
        const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            })

            newOrderItem = await newOrderItem.save();
            return newOrderItem._id;
        }));

        const orderItemsIdsResolved = await orderItemsIds;
        // const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        //     const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        //     console.log(orderItem.product[0]);
        //     const totalPrice = orderItem.product.price * orderItem.quantity;
        //     return totalPrice
        // }))
        let totalPrice = 0
        for (let i = 0; i < orderItemsIdsResolved.length; i++) {
            const orderItemId = orderItemsIdsResolved[i];
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            let ProductPrice = orderItem.product[0].price;
            const totalPriceP = ProductPrice * orderItem.quantity;
            
            totalPrice += totalPriceP
        }

        let order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user,
        })
        order = await order.save();

        if (!order) {
            return res.status(400).send('the order cannot be created!')
        }

        res.send(order)

    }

    static UpdateOrder = async (req, res)=>{
        try {
            const order = await Order.findByIdAndUpdate(req.params.id, {
                status : req.body.status
            },{
                new: true,
            });
            if (!order) {
                return res.status(400).send('the order cannot be updated!')
            }
            res.json({ok: true, order});
        } catch (error) {
            return res.status(400).json({ok:false, message:'Something goes wrong!'})
        }
    }

    static RemoveOrder = async (req, res) =>{
        try {
            const order = await Order.findByIdAndRemove(req.params.id)
                if(order){
                    await order.orderItems.map(async orderItem =>{
                        await OrderItem.findByIdAndRemove(orderItem)
                    })
                    return res.status(200).json({ok:false, message:'Order deleted'})
                }
                else{
                    return res.status(404).json({ok:false, message:'Order not found!'})
                }
        } catch (error) {
            return res.status(500).json({ok:false, message:"Something goes wrong!"})
        }
    }

    static TotalSales = async(req, res)=>{
        const totalSales = await Order.aggregate([
            {$group: {_id: null, totalsales: {$sum: '$totalPrice'}}}
        ])
        if (!totalSales) {
            return res.status(400).send('The order sales connot be geerated')
        }

        res.send({totalsales: totalSales.pop().totalsales})
    }

    static GetCountOrder = async (req, res) => {
        try {

            const orderCount = await Order.countDocuments();
            if (!orderCount) {
                res.status(500).json({ ok: false, message: "No count!" })
            }
            res.send({ count: orderCount })
        } catch (error) {
            return res.status(500).json({ message: "Something goes wrong!", error })
        }


    }

    static GetOrderUser = async (req, res) =>{
        const userOrderList = await Order.find({user: req.params.userid})
        .populate('user', 'name')
        .populate({path: 'orderItems', populate: {path: 'product', populate:'category'}})
        .sort({'dateOrdered': -1});
    
        if(!userOrderList) {
            res.status(500).json({success: false})
        } 
        res.send(userOrderList);
    }
}
module.exports = OrderController;