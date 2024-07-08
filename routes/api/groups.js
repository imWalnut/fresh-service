const express = require('express');
const router = express.Router();
const {group, product} = require('../../models')
const {Op} = require('sequelize')
const {NotFoundError, BadRequestError} = require('../../utils/errors');
const {success, failure} = require('../../utils/responses');

/**
 * 公共方法：白名单过滤
 */
function filterBody(req) {
    return {
        name: req.body.name,
        remark: req.body.remark
    }
}

/**
 * 公共方法：查询分组
 */
async function getGroupInfo(req) {
    // 获取分组 ID
    const {id} = req.params;

    // 查询分组
    const groupInfo = await group.findByPk(id);

    // 如果没有找到，就抛出异常
    if (!groupInfo) {
        throw new NotFoundError(`ID: ${id}的分组未找到`)
    }

    return groupInfo;
}

/**
 * 查询分组列表
 * GET /api/groups/getGroupList
 */
router.get('/getGroupList', async function (req, res, next) {
    try {
        const query = req.query
        const condition = {
            order: [['createdAt', 'DESC']]
        }
        const groups = await group.findAll(condition)
        success(res, '查询分组列表成功', groups);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 分页查询分组列表
 * GET /api/groups/getGroupListByPage
 */
router.get('/getGroupListByPage', async function (req, res, next) {
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
        const {count, rows} = await group.findAndCountAll(condition)
        const totalPages = Math.ceil(count / pageSize)
        success(res, '分页查询分组列表成功', {
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
 * 新增分组
 * POST /api/groups/addGroupInfo
 */
router.post('/addGroupInfo', async function (req, res, next) {
    try {
        const body = filterBody(req)
        const groupInfo = await group.create(body)
        success(res, '新增分组成功', {groupInfo}, 201);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 删除分组
 * DELETE /api/groups/deleteGroupInfo/:id
 */
router.delete('/deleteGroupInfo/:id', async function (req, res, next) {
    try {
        const count = await product.count({
            where: {
                groupId: req.params.id
            }
        })
        if (count) {
            const msg = `该分组已关联${count}个商品，禁止删除`
            throw new BadRequestError(msg);
        }
        const groupInfo = await getGroupInfo(req)
        await groupInfo.destroy()
        success(res, '删除分组成功');
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 更新分组
 * PUT /api/groups/updateGroupInfo/:id
 */
router.put('/updateGroupInfo/:id', async function (req, res, next) {
    try {
        const groupInfo = await getGroupInfo(req);
        const body = filterBody(req)
        await groupInfo.update(body)
        success(res, '更新分组成功', {id: groupInfo.id})
    } catch (err) {
        failure(res, err)
    }
});

module.exports = router;