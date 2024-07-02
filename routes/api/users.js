const express = require('express');
const router = express.Router();
const {user} = require('../../models')
const {Op} = require('sequelize')
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response')

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{password, address, phoneNumber: (string|*), name, userName: (string|*), idNumber: (string|*), email: (string|*)}}
 */
function filterBody(req) {
    return {
        name: req.body.name,
        address: req.body.address,
        email: req.body.email,
        password: req.body.password,
        userName: req.body.userName,
        idNumber: req.body.idNumber,
        phoneNumber: req.body.phoneNumber,
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
        throw new NotFoundError(`ID: ${id}的用户未找到。`)
    }

    return userInfo;
}


/**
 * 查询用户列表
 * GET /api/users/getUsersList
 */
router.get('/getUsersList/', async function (req, res, next) {
    try {
        const condition = {
            order: [['name', 'DESC']]
        }
        const users = await user.findAll(condition)
        success(res, '查询用户列表成功。', users);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 分页查询用户列表
 * GET /api/users/getUsersListByPage
 */
router.get('/getUsersListByPage/', async function (req, res, next) {
    try {
        // 分页信息
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        const pageSize = Math.abs(Number(query.pageSize)) || 10
        const offset = (currentPage - 1) * pageSize
        const condition = {
            order: [['name', 'DESC']],
            limit: pageSize,
            offset: offset
        }

        // 姓名模糊查询
        if (query.name) {
            condition.where = {
                name: {
                    [Op.like]: `%${query.name}%`
                }
            }
        }
        const {count, rows} = await user.findAndCountAll(condition)
        success(res, '查询用户列表成功', {
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
router.post('/addUserInfo/', async function (req, res, next) {
    try {
        const body = filterBody(req)
        const userInfo = await user.create(body)
        success(res, '新增用户成功', {userInfo}, 201);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 删除用户
 * DELETE /api/users/deleteUserInfo/:id
 */
router.delete('/deleteUserInfo/:id', async function (req, res, next) {
    try {
        const userInfo = await getUserInfo(req);
        await userInfo.destroy()
        success(res, '删除用户成功');
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 更新用户
 * DELETE /api/users/updateUserInfo:id
 */
router.put('/updateUserInfo/:id', async function (req, res, next) {
    try {
        const userInfo = await getUserInfo(req);
        const body = filterBody(req)
        await userInfo.update(body)
        success(res, '更新用户成功', {userInfo})
    } catch (err) {
        failure(res, err)
    }
});

module.exports = router;