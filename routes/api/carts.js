const express = require('express');
const router = express.Router();
const {cart, user, product, productSpec} = require('../../models')
const {Op} = require('sequelize')
const {NotFoundError} = require('../../utils/errors');
const {success, failure} = require('../../utils/responses');

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{password, address, phoneNumber: (string|*), name, userName: (string|*), idNumber: (string|*), email: (string|*)}}
 */
function filterBody(req) {
    return {
        productId: req.body.productId,
        productSpecId: req.body.productSpecId,
        userId: req.body.userId,
        totalPrice: req.body.totalPrice,
        quantity: req.body.quantity
    }
}

/**
 * 查询购物车列表
 * GET /api/carts/getCartList
 */
router.get('/getCartList', async function (req, res, next) {
    try {
        const condition = {
            order: [['createdAt', 'DESC']],
            where: {
                userId: {
                    [Op.eq]: req.query.userId
                }
            },
            include: [
                {
                    model: user,
                    as: 'userInfo'
                },
                {
                    model: product,
                    as: 'productInfo'
                },
                {
                    model: productSpec,
                    as: 'productSpecInfo',
                    attributes: ['id', 'remark', 'specAmount', 'price']
                }
            ]
        }
        const carts = await cart.findAll(condition)
        success(res, '查询购物车列表成功', carts);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 分页查询购物车列表
 * GET /api/carts/getCartListByPage
 */
router.get('/getCartListByPage/', async function (req, res, next) {
    try {
        // 分页信息
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        const pageSize = Math.abs(Number(query.pageSize)) || 10
        const offset = (currentPage - 1) * pageSize
        const condition = {
            order: [['createdAt', 'DESC']],
            limit: pageSize,
            offset: offset,
            where: {
                userId: {
                    [Op.eq]: req.query.userId
                }
            }
        }
        const {count, rows} = await cart.findAndCountAll(condition)
        success(res, '分页查询购物车列表成功', {
            users: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize,
            }
        });
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 购物车新增商品
 * POST /api/carts/addCartsInfo
 */
router.post('/addCartsInfo', async function (req, res, next) {
    try {
        const body = filterBody(req)
        const cartInfo = await cart.create(body)
        success(res, '购物车新增商品成功', {cartInfo}, 201);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 购物车删除商品
 * DELETE /api/carts/deleteCartsInfo/:id
 */
router.delete('/deleteCartsInfo/:id', async function (req, res, next) {
    try {
        const {id} = req.params;
        // 查询用户
        const cartInfo = await cart.findByPk(id);
        // 如果没有找到，就抛出异常
        if (!cartInfo) {
            throw new NotFoundError(`购物车中ID: ${id}的商品未找到。`)
        }
        await cartInfo.destroy()
        success(res, '购物车删除商品成功');
    } catch (err) {
        failure(res, err)
    }
});

module.exports = router;