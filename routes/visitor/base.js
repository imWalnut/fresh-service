const express = require('express');
const router = express.Router();
const {category, banner, product} = require('../../models')
const {Op} = require('sequelize')
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
            raw: true
        }))
    })
    let child = await Promise.all(expendPromise);
    for (let [idx, item] of child.entries()) {
        if (item.length > 0) {
            item = await getChildNeeds(item);
        }
        rootNeeds[idx].child = item;
    }
    return rootNeeds;
}

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
            attributes: ['id', 'name', 'mainImage'],
            limit: pageSize,
            offset: offset,
            distinct: true
        }
        const {count, rows} = await product.findAndCountAll(condition)
        success(res, '查询商品列表成功', {
            products: rows,
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

module.exports = router;