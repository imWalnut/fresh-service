const express = require('express');
const router = express.Router();
const {coupon, userCoupon, user, authority} = require('../../models')
const {Op} = require('sequelize')
const {NotFoundError} = require('../../utils/errors');
const {success, failure} = require('../../utils/responses');

/**
 * 公共方法：白名单过滤
 */
function filterBody(req) {
    return {
        name: req.body.name,
        value: req.body.value,
        condition: req.body.condition,
        remark: req.body.remark
    }
}

/**
 * 公共方法：查询优惠券
 */
async function getCouponInfo(req) {
    // 获取优惠券 ID
    const {id} = req.params;

    // 查询优惠券
    const couponInfo = await coupon.findByPk(id);

    // 如果没有找到，就抛出异常
    if (!couponInfo) {
        throw new NotFoundError(`ID: ${id}的优惠券未找到`)
    }

    return couponInfo;
}

/**
 * 查询优惠券列表
 * GET /api/coupons/getCouponList
 */
router.get('/getCouponList', async function (req, res, next) {
    try {
        const condition = {
            order: [['createdAt', 'DESC']],
        }
        const coupons = await coupon.findAll(condition)
        success(res, '查询优惠券列表成功', coupons);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 分页查询优惠券列表
 * GET /api/coupons/getCouponListByPage
 */
router.get('/getCouponListByPage', async function (req, res, next) {
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
            where: {}
        }
        if (query.name) {
            condition.where = {
                name: {
                    [Op.like]: `%${query.name}%`
                }
            };
        }
        const {count, rows} = await coupon.findAndCountAll(condition)
        const totalPages = Math.ceil(count / pageSize)
        success(res, '分页查询优惠券列表成功', {
            data: rows,
            total: count,
            totalPages,
            currentPage,
            pageSize,
        });
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 新增优惠券
 * POST /api/coupons/addCouponInfo
 */
router.post('/addCouponInfo', async function (req, res, next) {
    try {
        const body = filterBody(req)
        const couponInfo = await coupon.create(body)
        success(res, '新增优惠券成功', {couponInfo}, 201);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 删除优惠券
 * DELETE /api/coupon/deleteCouponInfo/:id
 */
router.delete('/deleteCouponInfo/:id', async function (req, res, next) {
    try {
        const couponInfo = await getCouponInfo(req)
        await couponInfo.destroy()
        success(res, '删除优惠券成功');
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 更新优惠券
 * PUT /api/coupons/updateCouponInfo/:id
 */
router.put('/updateCouponInfo/:id', async function (req, res, next) {
    try {

        const couponInfo = await getCouponInfo(req);
        const body = filterBody(req)
        await couponInfo.update(body)
        success(res, '更新优惠券', {couponInfo})
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 分发优惠券
 * POST /api/coupons/sendCouponToUser
 */
router.post('/sendCouponToUser', async function (req, res, next) {
    try {
        const body = {
            userId: req.body.userId,
            name: req.body.name,
            value: req.body.value,
            condition: req.body.condition,
            remark: req.body.remark,
            endDate: req.body.endDate
        }
        const userCouponInfo = await userCoupon.create(body)
        success(res, '分发优惠券成功', {userCouponInfo}, 201);
    } catch (err) {
        failure(res, err)
    }
});


/**
 * 删除用户优惠券
 * DELETE /api/coupon/deleteCouponInfo/:id
 */
router.delete('/deleteUserCouponInfo/:id', async function (req, res, next) {
    try {
        // 获取用户优惠券 ID
        const {id} = req.params;
        // 查询用户优惠券
        const userCouponInfo = await userCoupon.findByPk(id);
        await userCouponInfo.destroy()
        success(res, '删除用户优惠券成功');
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 查询用户优惠券列表
 * GET /api/coupons/getUserCouponList/:id
 */
router.get('/getUserCouponList/:id', async function (req, res, next) {
    try {
        const condition = {
            order: [['createdAt', 'DESC']],
        }
        const userCoupons = await userCoupon.findAll(condition)
        success(res, '查询用户优惠券列表成功', userCoupons);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 分页查询用户优惠券列表
 * GET /api/coupons/getUserCouponListByPage
 */
router.get('/getUserCouponListByPage', async function (req, res, next) {
    try {
        // 分页信息
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        const pageSize = Math.abs(Number(query.pageSize)) || 10
        const offset = (currentPage - 1) * pageSize
        const condition = {
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: user,
                    attributes: ['id', 'phoneNumber', 'role', 'userName'],
                    include: [
                        {
                            model: authority,
                            attributes: ['id', 'name', 'sex', 'images', 'shopName', 'status']
                        }
                    ],
                }
            ],
            limit: pageSize,
            offset: offset,
            where: {}
        }
        if (query.userId) {
            condition.where = {
                userId: {
                    [Op.eq]: query.userId
                }
            };
        }
        const {count, rows} = await userCoupon.findAndCountAll(condition)
        const totalPages = Math.ceil(count / pageSize)
        success(res, '分页查询用户优惠券列表成功', {
            data: rows,
            total: count,
            totalPages,
            currentPage,
            pageSize,
        });
    } catch (err) {
        failure(res, err)
    }
});
module.exports = router;