const express = require('express');
const router = express.Router();
const {order, orderProduct, user, productSpec} = require('../../models')
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
        orderNo: req.body.orderNo,
        userId: req.body.userId,
        userCouponId: req.body.userCouponId,
        paymentType: req.body.paymentType,  // 0线上 1线下
        postage: req.body.postage,  // 邮费
        payment: req.body.payment, // 金额
        // sendTime: req.body.sendTime,  // 发货时间
        // endTIme: req.body.endTIme,  // 完成时间
        // closeTime: req.body.closeTime,  // 关闭时间
        // cancelTime: req.body.cancelTime,  // 取消时间
        // status: req.body.status  // 0待付款 1待发货 2待收获 3已完成 4已关闭 5已取消
    }
}

function filterProductSpecBody(req) {
    return {
        orderId: req.orderId,
        productSpecId: req.productSpecId,
        totalPrice: req.totalPrice,
        quantity: req.quantity
    }
}

/**
 * 公共方法：关联订单、订单商品、用户
 * @returns {{include: [{as: string, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
    return {
        include: [
            {
                model: orderProduct,
                as: 'orderProductList',
                include: [
                    {
                        model: productSpec,
                        as: 'orderProductSpecInfo'
                    }
                ]
            },
            {
                model: user,
                as: 'orderUserInfo'
            }
        ]
    }
}

/**
 * 公共方法：查询订单
 */
async function getOrderInfo(req) {
    // 获取订单 ID
    const {id} = req.params;

    const condition = getCondition();

    // 查询订单
    const orderInfo = await order.findByPk(id, condition);

    // 如果没有找到，就抛出异常
    if (!orderInfo) {
        throw new NotFoundError(`ID: ${id}的订单未找到。`)
    }

    return orderInfo;
}


/**
 * 查询订单列表
 * GET /api/orders/getOrderList
 */
router.get('/getOrderList/', async function (req, res, next) {
    try {
        const condition = {
            ...getCondition(),
            order: [['createdAt', 'DESC']]
        }
        const orders = await order.findAll(condition)
        success(res, '查询订单列表成功。', orders);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 分页查询订单列表
 * GET /api/orders/getOrderListByPage
 */
router.get('/getOrderListByPage/', async function (req, res, next) {
    try {
        // 分页信息
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        const pageSize = Math.abs(Number(query.pageSize)) || 10
        const offset = (currentPage - 1) * pageSize
        const condition = {
            ...getCondition(),
            order: [['createdAt', 'DESC']],
            limit: pageSize,
            offset: offset,
            where: {}
        }

        if (query.orderNo) {
            condition.where = {
                orderNo: {
                    [Op.eq]: query.orderNo
                }
            };
        }

        if (query.userId) {
            condition.where = {
                userId: {
                    [Op.eq]: query.userId
                }
            };
        }

        if (query.paymentType) {
            condition.where = {
                paymentType: {
                    [Op.eq]: query.paymentType
                }
            };
        }

        if (query.status) {
            condition.where = {
                status: {
                    [Op.eq]: query.status
                }
            };
        }
        const {count, rows} = await order.findAndCountAll(condition)
        success(res, '查询订单列表成功', {
            orders: rows,
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
 * 查询订单详情
 * GET /api/orders/getOrderInfo/:id
 */
router.get('/getOrderInfo/:id', async function (req, res, next) {
    try {
        const orderInfo = await getOrderInfo(req);
        success(res, '查询订单成功', {orderInfo});
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 新增订单
 * POST /api/orders/addOrderInfo
 */
router.post('/addOrderInfo/', async function (req, res, next) {
    try {
        const body = filterBody(req)
        const productSpecList = eval(req.body.productSpecList)
        if (!productSpecList || !productSpecList.length) {
            return res.status(400).json({
                status: false,
                message: '商品不能为空。',
            });
        }
        body.status = 0
        const orderInfo = await order.create(body)
        const productSpecBody = productSpecList.map(item => {
            item.orderId = orderInfo.id
            return filterProductSpecBody(item)
        })
        const fields = Object.keys(productSpecBody[0])
        await orderProduct.bulkCreate(productSpecBody, {
            ignoreDuplicates: true,
            fields: fields
        })
        success(res, '新增订单成功', {orderInfo}, 201);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 删除订单
 * DELETE /api/orders/deleteOrderInfo/:id
 */
router.delete('/deleteOrderInfo/:id', async function (req, res, next) {
    try {
        const orderInfo = await getOrderInfo(req);
        await orderProduct.destroy({where: {orderId: req.params.id}})
        await orderInfo.destroy()
        success(res, '删除订单成功');
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 修改订单状态
 * PUT /api/orders/updateOrderInfo/:id
 */
router.put('/updateOrderInfo/:id', async function (req, res, next) {
    try {
        const query = req.query
        const orderInfo = await getOrderInfo(req);
        orderInfo.status = query.status
        if (query.status == 2) {
            orderInfo.sendTime = new Date()
        }
        if (query.status == 3) {
            orderInfo.endTIme = new Date()
        }
        if (query.status == 4) {
            orderInfo.closeTime = new Date()
        }
        if (query.status == 5) {
            orderInfo.cancelTime = new Date()
        }
        await orderInfo.save()
        success(res, '修改订单状态成功', {id: orderInfo.id})
    } catch (err) {
        failure(res, err)
    }
});

module.exports = router;