const express = require('express');
const router = express.Router();
const {user, authority, address, invite} = require('../../models')
const {Op} = require('sequelize')
const {NotFoundError} = require('../../utils/errors');
const {success, failure} = require('../../utils/responses');

/**
 * 公共方法：白名单过滤
 */
function filterBody(req) {
    return {
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
        openId: req.body.openId,
        password: req.body.password,
        userName: req.body.userName,
        avatar: req.body.avatar,
        remark: req.body.remark,
        status: req.body.status
    }
}

function filterAuthorityBody(req) {
    return {
        userId: req.body.userId,
        name: req.body.name,
        sex: req.body.sex,
        images: req.body.images,
        shopName: req.body.shopName,
        status: req.body.status,
    }
}

function filterAddressBody(req) {
    return {
        userId: req.body.userId,
        name: req.body.name,
        sex: req.body.sex,
        phoneNumber: req.body.phoneNumber,
        provinceCode: req.body.provinceCode,
        provinceName: req.body.provinceName,
        cityCode: req.body.cityCode,
        cityName: req.body.cityName,
        countyCode: req.body.countyCode,
        countyName: req.body.countyName,
        address: req.body.address,
        lat: req.body.lat,
        lon: req.body.lon,
    }
}

/**
 * 公共方法：关联用户、地址、认证
 */
function getCondition() {
    return {
        include: [
            {
                model: address,
                attributes: ['id', 'name', 'sex', 'phoneNumber', 'provinceCode', 'provinceName', 'cityCode', 'cityName', 'countyCode', 'countyName', 'address']
            },
            {
                model: authority,
                attributes: ['id', 'name', 'sex', 'images', 'shopName', 'status']
            },
            {
                model: invite,
                attributes: ['id', 'invitedBy'],
            }
        ]
    }
}

/**
 * 公共方法：查询用户
 */
async function getUserInfo(req) {
    // 获取用户 ID
    const {id} = req.params;

    const condition = getCondition();

    // 查询用户
    const userInfo = await user.findByPk(id, condition);

    // 如果没有找到，就抛出异常
    if (!userInfo) {
        throw new NotFoundError(`ID: ${id}的用户未找到`)
    }

    return userInfo;
}

/**
 * 公共方法：查询用户地址
 */
async function getUserAddressInfo(req) {
    // 获取地址 ID
    const {id} = req.params;

    // 查询地址
    const addressInfo = await address.findByPk(id);

    // 如果没有找到，就抛出异常
    if (!addressInfo) {
        throw new NotFoundError(`ID: ${id}的用户地址未找到`)
    }

    return addressInfo;
}


/**
 * 查询用户列表
 * GET /api/users/getUsersList
 */
router.get('/getUsersList', async function (req, res, next) {
    try {
        const condition = {
            ...getCondition(),
            order: [['createdAt', 'DESC']]
        }
        const users = await user.findAll(condition)
        success(res, '查询用户列表成功', users);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 分页查询用户列表
 * GET /api/users/getUsersListByPage
 */
router.get('/getUsersListByPage', async function (req, res, next) {
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

        if (query.phoneNumber) {
            condition.where = {
                phoneNumber: {
                    [Op.eq]: query.phoneNumber
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

        if (query.role) {
            condition.where = {
                role: {
                    [Op.eq]: query.role
                }
            };
        }
        const {count, rows} = await user.findAndCountAll(condition)
        const totalPages = Math.ceil(count / pageSize)
        success(res, '查询用户列表成功', {
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
 * 查询用户详情
 * GET /api/users/getUserInfo/:id
 */
router.get('/getUserInfo/:id', async function (req, res, next) {
    try {
        const userInfo = await getUserInfo(req);
        success(res, '查询用户成功', {userInfo});
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 新增用户
 * POST /api/users/addUserInfo
 */
router.post('/addUserInfo', async function (req, res, next) {
    try {
        const body = filterBody(req)
        const userInfo = await user.create(body)
        success(res, '新增用户成功', {userInfo}, 201);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 更改用户状态
 * PUT /api/users/updateUserStatus/:id
 */
router.put('/updateUserStatus/:id', async function (req, res, next) {
    try {
        const userInfo = await getUserInfo(req);
        userInfo.status = req.body.status
        await userInfo.save()
        success(res, '更改用户状态成功');
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 更新用户
 * PUT /api/users/updateUserInfo/:id
 */
router.put('/updateUserInfo/:id', async function (req, res, next) {
    try {
        const userInfo = await getUserInfo(req);
        const body = filterBody(req)
        await userInfo.update(body)
        success(res, '更新用户成功', {id: userInfo.id})
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 提交用户认证
 * POST /api/users/addUserAuthority
 */
router.post('/addUserAuthority', async function (req, res, next) {
    try {
        const body = filterAuthorityBody(req)
        body.status = 0
        await authority.create(body)
        success(res, '用户认证已提交', {}, 201);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 更改用户认证状态
 * put /api/users/updateUserAuthority/:id
 */
router.put('/updateUserAuthority/:id', async function (req, res, next) {
    try {
        const authorityInfo = await authority.findByPk(id)
        authorityInfo.status = req.body.status
        await authorityInfo.save()
        success(res, '更改用户认证状态成功');
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 新增用户地址
 * POST /api/users/addUserAddress
 */
router.post('/addUserAddress', async function (req, res, next) {
    try {
        const body = filterAddressBody(req)
        const addressInfo = await address.create(body)
        success(res, '新增用户地址成功', addressInfo, 201);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 更改用户地址
 * put /api/users/updateUserAddress/:id
 */
router.put('/updateUserAddress/:id', async function (req, res, next) {
    try {
        const addressInfo = await getUserAddressInfo(req)
        const body = filterBody(req)
        body.userId = addressInfo.userId
        await addressInfo.update(body)
        success(res, '更改用户地址成功');
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 删除用户地址
 * DELETE /api/users/deleteUserAddress/:id
 */
router.delete('/deleteUserCouponInfo/:id', async function (req, res, next) {
    try {
        const addressInfo = await getUserAddressInfo(req)
        await addressInfo.destroy()
        success(res, '删除用户地址成功');
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 绑定邀请人
 * post /api/users/addUserInvitedBy
 */
router.post('/addUserInvitedBy', async function (req, res, next) {
    try {
        const body = {
            userId: req.body.userId,
            invitedBy: req.body.invitedBy,
        }
        await invite.create(body)
        success(res, '绑定邀请人成功', {}, 201);
    } catch (err) {
        failure(res, err)
    }
});

module.exports = router;