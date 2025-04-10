const {Restaurant, Menu, Order} = require('../models')

class Controller{
    static async home(req,res){
        try {
            res.render('home')
        } catch (error) {
            res.send(error)
        }
    }

    static async restaurant(req,res){
        try {
            const { search } = req.query;
            let data = await Restaurant.findAll({
                where: search ? { name: { [Op.iLike]: `%${search}%` } } : {}
            });
            res.render('restaurant', { data })
        } catch (error) {
            res.send(error)
        }
    }

    static async restaurantById(req,res){
        try {
            const { id } = req.params;
            const { search } = req.query;
            let data = await Restaurant.findByPk(id, {
                include: {
                    model: Menu,
                    where: search ? { name: { [Op.iLike]: `%${search}%` } } : {}
                }
            });
    
            res.render('restaurantDetail', { data })
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }
    

    static async order(req,res){
        try {
            const orders = await Order.findAll({
                where: { UserId: req.session.userId },
                include: [{ model: Menu }, { model: Restaurant }]
              });
              console.log('Orders:', JSON.stringify(orders, null, 2))
              res.render('order', { orders })
        } catch (error) {
            res.send(error)
        }
    }

    static async input(req,res){
        try {
            if (!req.session.userId) {
                return res.redirect('/login?error=Please login first');
            }
            const { MenuId, RestaurantId } = req.body;
            const menu = await Menu.findByPk(MenuId);
            const restaurant = await Restaurant.findByPk(RestaurantId);
            if (!menu || !restaurant) {
                return res.send('Menu or Restaurant not found');
            }
            await Order.create({
                UserId: req.session.userId,
                RestaurantId,
                MenuId,
                quantity: 1
            });
            res.redirect(`/restaurant/${RestaurantId}`);
        } catch (error) {
            res.send(error)
        }
    }

    static async inputOrder(req,res){
        try {
            const { MenuId } = req.params;
            const { action } = req.query; // 'plus' atau 'minus'
            const order = await Order.findOne({
              where: { MenuId, UserId: req.session.userId }
            });
            if (!order) throw new Error('Order not found');
            if (action === 'plus') order.quantity += 1;
            else if (action === 'minus' && order.quantity > 1) order.quantity -= 1;
            await order.save();
            res.redirect('/order') 
        } catch (error) {
            res.send(error)
        }
    }

    static async deleteMenu(req, res){
        try {
            const { MenuId } = req.params;
            await Order.destroy({
                where: { MenuId, UserId: req.session.userId }
            });
            res.redirect('/order')
        } catch (error) {
            res.send(error)
        }
    }

    static async completeOrder(req, res) {
        try {
          const orders = await Order.findAll({ where: { UserId: req.session.userId } });
          if (orders.length === 0) throw new Error('No orders to complete');
          await Order.destroy({ where: { UserId: req.session.userId } });
          res.redirect('/restaurant');
        } catch (error) {
          res.status(500).send(error.message);
        }
    }

    
}

module.exports = Controller