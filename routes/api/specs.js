const express = require('express');
const router = express.Router();
const {spec, productSpec} = require('../../models')
const {Op} = require('sequelize')
const {NotFoundError, BadRequestError} = require('../../utils/errors');
const {success, failure} = require('../../utils/responses');

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{password, address, phoneNumber: (string|*), name, userName: (string|*), idNumber: (string|*), email: (string|*)}}
 */
function filterBody(req) {
    return {
        name: req.body.name,
        remark: req.body.remark
    }
}

/**
 * 公共方法：查询规格
 */
async function getSpecInfo(req) {
    // 获取规格 ID
    const {id} = req.params;

    // 查询规格
    const specInfo = await spec.findByPk(id);

    // 如果没有找到，就抛出异常
    if (!specInfo) {
        throw new NotFoundError(`ID: ${id}的规格未找到。`)
    }

    return specInfo;
}

/**
 * 查询规格列表
 * GET /api/specs/getSpecList
 */
router.get('/getSpecList', async function (req, res, next) {
    try {
        const condition = {
            order: [['createdAt', 'DESC']]
        }
        const specs = await spec.findAll(condition)
        success(res, '查询规格列表成功', specs);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 分页查询规格列表
 * GET /api/specs/getSpecListByPage
 */
router.get('/getSpecListByPage/', async function (req, res, next) {
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
        const {count, rows} = await spec.findAndCountAll(condition)
        success(res, '分页查询规格列表成功', {
            specs: rows,
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
 * 新增规格
 * POST /api/specs/addSpecInfo
 */
router.post('/addSpecInfo', async function (req, res, next) {
    try {
        const body = filterBody(req)
        const specInfo = await spec.create(body)
        success(res, '新增规格成功', {specInfo}, 201);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 删除规格
 * DELETE /api/specs/deleteSpecInfo/:id
 */
router.delete('/deleteSpecInfo/:id', async function (req, res, next) {
    try {
        const specInfo = await getSpecInfo(req)
        await specInfo.destroy()
        success(res, '删除规格成功');
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 更新规格
 * PUT /api/specs/updateSpecInfo/:id
 */
router.put('/updateSpecInfo/:id', async function (req, res, next) {
    try {
        const specInfo = await getSpecInfo(req);
        const body = filterBody(req)
        await specInfo.update(body)
        success(res, '更新规格成功', {specInfo})
    } catch (err) {
        failure(res, err)
    }
});

module.exports = router;