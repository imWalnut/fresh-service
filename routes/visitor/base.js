const express = require('express');
const router = express.Router();
const {category, banner, product, productSpec, group, productGroup} = require('../../models')
const {Op, where} = require('sequelize')
const {NotFoundError} = require('../../utils/errors');
const {success, failure} = require('../../utils/responses');

/**
 * 公共方法：递归查询
 */
async function getChildNeeds(rootNeeds) {
    let expendPromise = [];
    rootNeeds.forEach(item => {
        expendPromise.push(category.findAll({
            where: {
                parentId: item.id
            },
            attributes: ['id', 'name', 'imgUrl', 'parentId', 'remark'],
        }))
    })
    let child = await Promise.all(expendPromise);
    for (let [idx, item] of child.entries()) {
        rootNeeds[idx].child = item;
    }
    return rootNeeds;
}

async function getChildProducts(groupList) {
    let arr = []
    groupList.forEach(item => {
        arr.push(productGroup.findAll({
            where: {
                groupId: item.id
            },
            limit: 2,
            attributes: ['id'],
            include: [
                {
                    model: product,
                    attributes: ['id', 'name', 'mainImage'],
                }
            ]
        }))
    })
    let child = await Promise.all(arr)
    for (let [idx, item] of child.entries()) {
        groupList[idx].child = item;
    }
    return groupList
}

/**
 * 查询首页分类
 * GET /visitor/base/getHomeCategoryList
 */
router.get('/getHomeCategoryList', async function (req, res, next) {
    try {
        let categoryList = await category.findAll({
            where: {
                parentId: 0
            },
            limit: 10,
            attributes: ['id', 'name', 'imgUrl', 'parentId'],
            raw: true
        })
        success(res, '查询分类列表成功', categoryList);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 查询分类列表
 * GET /visitor/base/getCategoryList
 */
router.get('/getCategoryList', async function (req, res, next) {
    try {
        let rootNeeds = await category.findAll({
            where: {
                parentId: 0
            },
            limit: 10,
            attributes: ['id', 'name', 'imgUrl', 'parentId'],
            raw: true
        })
        rootNeeds = await getChildNeeds(rootNeeds);
        success(res, '查询分类列表成功', rootNeeds);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 查询首页分组列表
 * GET /visitor/base/getHomeGroupList
 */
router.get('/getHomeGroupList', async function (req, res, next) {
    try {
        const condition = {
            attributes: ['id', 'name', 'remark'],
            limit: 4,
            raw: true
        }
        let groupList = await group.findAll(condition)
        groupList = await getChildProducts(groupList)
        success(res, '查询分组列表成功', groupList);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 查询分组列表
 * GET /visitor/base/getGroupList
 */
router.get('/getGroupList', async function (req, res, next) {
    try {
        const condition = {
            attributes: ['id', 'name', 'remark']
        }
        let groupList = await group.findAll(condition)
        success(res, '查询分组列表成功', groupList);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 客户端查询轮播图
 * GET /visitor/base/getBannerList/:source
 */
router.get('/getBannerList/:source', async function (req, res, next) {
    try {
        const condition = {
            attributes: ['id', 'imgUrl', 'hrefUrl', 'source'],
            where: {source: req.params.source}
        }
        let banners = await banner.findAll(condition)
        success(res, '获取轮播图成功', banners);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 分页查询商品列表
 * GET /visitor/base/getProductsListByPage
 */
router.get('/getProductsListByPage', async function (req, res, next) {
    try {
        // 分页信息
        const query = req.query
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        const pageSize = Math.abs(Number(query.pageSize)) || 10
        const offset = (currentPage - 1) * pageSize
        const condition = {
            order: [['soldAmount', 'DESC']],
            attributes: ['id', 'name', 'mainImage', 'soldAmount'],
            limit: pageSize,
            offset: offset,
            distinct: true,
            include: [
                {
                    model: productSpec,
                    attributes: ['id', 'specName', 'specRemark', 'quantity', 'price', 'remark']
                },
                {
                    model: productGroup,
                    // attributes: ['id', 'name', 'remark']
                    include: [
                        {
                            model: group,
                            attributes: ['id', 'name', 'remark']
                        }
                    ]
                },
            ]
        }
        const {count, rows} = await product.findAndCountAll(condition)
        const totalPages = Math.ceil(count / pageSize)
        success(res, '查询商品列表成功', {
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