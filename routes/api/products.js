const express = require('express');
const router = express.Router();
const {product} = require('../../models')
const {Op} = require('sequelize')
const {
    NotFoundError,
    success,
    failure
} = require('../../utils/response')

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{image: any, classify: any, code: any, name: string, remark: any, group: any}}
 */
function filterBody(req) {
    return {
        name: req.body.name,
        image: req.body.image,
        code: req.body.code,
        classify: req.body.classify,
        group: req.body.group,
        remark: req.body.remark
    }
}

/**
 * 公共方法：查询商品
 */
async function getProductInfo(req) {
    // 获取商品 ID
    const {id} = req.params;

    // 查询商品
    const productInfo = await product.findByPk(id);

    // 如果没有找到，就抛出异常
    if (!productInfo) {
        throw new NotFoundError(`ID: ${id}的商品未找到。`)
    }

    return productInfo;
}


/**
 * 查询商品列表
 * GET /api/products/getProductsList
 */
router.get('/getProductsList/', async function (req, res, next) {
    try {
        const condition = {
            order: [['name', 'DESC']]
        }
        const Products = await product.findAll(condition)
        success(res, '查询商品列表成功。', Products);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 分页查询商品列表
 * GET /api/products/getProductsListByPage
 */
router.get('/getProductsListByPage/', async function (req, res, next) {
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
        const {count, rows} = await product.findAndCountAll(condition)
        success(res, '查询商品列表成功', {
            Products: rows,
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
 * 查询商品详情
 * GET /api/products/getProductInfo/:id
 */
router.get('/getProductInfo/:id', async function (req, res, next) {
    try {
        const productInfo = await getProductInfo(req);
        success(res, '查询商品成功', {productInfo});
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 新增商品
 * POST /api/products/addProductInfo
 */
router.post('/addProductInfo/', async function (req, res, next) {
    try {
        const body = filterBody(req)
        const productInfo = await product.create(body)
        success(res, '新增商品成功', {productInfo}, 201);
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 删除商品
 * DELETE /api/products/deleteProductInfo/:id
 */
router.delete('/deleteProductInfo/:id', async function (req, res, next) {
    try {
        const productInfo = await getProductInfo(req);
        await productInfo.destroy()
        success(res, '删除商品成功');
    } catch (err) {
        failure(res, err)
    }
});

/**
 * 更新商品
 * PUT /api/products/updateProductInfo:id
 */
router.put('/updateProductInfo/:id', async function (req, res, next) {
    try {
        const productInfo = await getProductInfo(req);
        const body = filterBody(req)
        await productInfo.update(body)
        success(res, '更新商品成功', {productInfo})
    } catch (err) {
        failure(res, err)
    }
});

module.exports = router;