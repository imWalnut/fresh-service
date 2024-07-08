const express = require('express');
const router = express.Router();
const {user} = require('../../models')
const {Op} = require('sequelize')
const {NotFoundError} = require('../../utils/errors');
const {success, failure} = require('../../utils/responses');

/**
 * 公共方法：白名单过滤
 */
function filterBody(req) {
    return {
        phoneNumber: req.body.phoneNumber,
        name: req.body.name,
        sex: req.body.sex,
        provinceCode: req.body.provinceCode,
        provinceName: req.body.provinceName,
        cityCode: req.body.cityCode,
        cityName: req.body.cityName,
        countyCode: req.body.countyCode,
        countyName: req.body.countyName,
        address: req.body.address,
        role: req.body.role,
        inviteBy: req.body.inviteBy,
        password: req.body.password,
        userName: req.body.userName,
        avatar: req.body.avatar,
        images: req.body.images,
        shopName: req.body.shopName,
        remark: req.body.remark,
        status: req.body.status
    }
}

/**
 * 公共方法：查询用户
 */
async function getUserInfo(req) {
    // 获取用户 ID
    const {id} = req.params;

    // 查询用户
    const userInfo = await user.findByPk(id);

    // 如果没有找到，就抛出异常
    if (!userInfo) {
        throw new NotFoundError(`ID: ${id}的用户未找到`)
    }

    return userInfo;
}


/**
 * 查询用户列表
 * GET /api/users/getUsersList
 */
router.get('/getUsersList', async function (req, res, next) {
    try {
        const condition = {
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
            order: [['createdAt', 'DESC']],
            limit: pageSize,
            offset: offset,
            where: {}
        }

        // 模糊查询
        if (query.userName) {
            condition.where = {
                userName: {
                    [Op.like]: `%${query.userName}%`
                }
            };
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

module.exports = router;