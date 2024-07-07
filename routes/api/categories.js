const express = require('express');
const router = express.Router();
const {category} = require('../../models')
const {Op} = require('sequelize')
const {NotFoundError} = require('../../utils/errors');
const {success, failure} = require('../../utils/responses');

/**
 * 公共方法：白名单过滤
 */
function filterBody(req) {
    return {
        name: req.body.name,
        imgUrl: req.body.imgUrl,
        parentId: req.body.parentId,
        remark: req.body.remark
    }
}

/**
 * 公共方法：查询分类
 */
async function getCategoryInfo(req) {
    // 获取分类 ID
    const {id} = req.params;

    // 查询分类
    const categoryInfo = await category.findByPk(id);

    // 如果没有找到，就抛出异常
    if (!categoryInfo) {
        throw new NotFoundError(`ID: ${id}的分类未找到`)
    }

    return categoryInfo;
}

/**
 * 公共方法：递归删除
 */
async function deleteRecursiveCategoryInfo(categoryId) {

    // 查询所有子孙节点
    const children = await category.findAll({
        where: {
            parentId: categoryId
        }
    });

    // 递归删除子节点
    for (const child of children) {
        await deleteCategoryInfo(child.id);
    }

    await category.destroy({
        where: {
            id: categoryId
        }
    })
}

/**
 * 公共方法：递归查询
 */
async function getChildNeeds(rootNeeds){
    let expendPromise = [];
    rootNeeds.forEach(item => {
        expendPromise.push(category.findAll({
            where : {
                parentId : item.id
            },
            attributes: ['id', 'name', 'imgUrl', 'parentId', 'remark'],
            raw: true
        }))
    })
    let child = await Promise.all(expendPromise);
    for(let [idx , item] of child.entries()){
        if(item.length > 0){
            item = await getChildNeeds(item);
        }
        rootNeeds[idx].child = item;
    }
    return rootNeeds;
}

/**
 * 查询分类列表
 * GET /api/categories/getCategoryList
 */
router.get('/getCategoryList', async function (req, res, next) {
    try {
        let rootNeeds = await category.findAll({
            where : {
                parentId : 0
            },
            attributes: ['id', 'name', 'imgUrl', 'parentId', 'remark'],
            raw: true
        })
        rootNeeds = await getChildNeeds(rootNeeds);
        success(res, '查询分类列表成功', rootNeeds);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 新增分类
 * POST /api/categories/addCategoryInfo
 */
router.post('/addCategoryInfo', async function (req, res, next) {
    try {
        const body = filterBody(req)
        if (!body.parentId) {
            body.parentId = 0
        }
        const categoryInfo = await category.create(body)
        success(res, '新增分类成功', {categoryInfo}, 201);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 更新分类
 * PUT /api/categories/updateCategoryInfo/:id
 */
router.put('/updateCategoryInfo/:id', async function (req, res, next) {
    try {
        const categoryInfo = await getCategoryInfo(req);
        const body = filterBody(req)
        if (!body.parentId) {
            body.parentId = 0
        }
        await categoryInfo.update(body)
        success(res, '更新分类成功', {categoryInfo})
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 删除分类
 * DELETE /api/categories/deleteCategoryInfo/:id
 */
router.delete('/deleteCategoryInfo/:id', async function (req, res, next) {
    try {
        const {id} = req.params;
        // 查询分类
        const categoryInfo = await category.findByPk(id);
        // 如果没有找到，就抛出异常
        if (!categoryInfo) {
            throw new NotFoundError(`ID: ${id}的分类未找到`)
        }

        await deleteRecursiveCategoryInfo(id)
        success(res, '删除分类成功');
    } catch (err) {
        failure(res, err)
    }
});

module.exports = router;