const express = require('express');
const router = express.Router();
const {product, productSpec, group, category, spec} = require('../../models')
const {Op} = require('sequelize')
const {NotFoundError} = require('../../utils/errors');
const {success, failure} = require('../../utils/responses');

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{image: any, classify: any, code: any, name: string, remark: any, group: any}}
 */
function filterBody(req) {
    return {
        name: req.body.name,
        subImages: req.body.subImages,
        mainImage: req.body.mainImage,
        productCode: req.body.productCode,
        categoryId: req.body.categoryId,
        groupId: req.body.groupId,
        stockAlarmAmount: req.body.stockAlarmAmount,
        stockAmount: req.body.stockAmount,
        soldAmount: req.body.soldAmount,
        status: req.body.status,
        remark: req.body.remark
    }
}

function filterSpecBody(req) {
    return {
        productId: req.productId,
        specId: req.specId,
        specAmount: req.specAmount,
        remark: req.remark,
        status: req.status,
        price: req.price
    }
}

/**
 * 公共方法：关联商品、商品规格
 * @returns {{include: [{as: string, attributes: string[]}], attributes: {exclude: string[]}}}
 */
function getCondition() {
    return {
        include: [
            {
                model: productSpec,
                as: 'productSpecList',
                attributes: ['id', 'specAmount', 'price'],
                include: [
                    {
                        model: spec,
                        as: 'specInfo',
                        attributes: ['id', 'name', 'remark']
                    }
                ]
            },
            {
                model: group,
                as: 'groupInfo',
                attributes: ['id', 'name', 'remark']
            },
            {
                model: category,
                as: 'categoryInfo',
                attributes: ['id', 'name', 'image', 'remark']
            }
        ]
    }
}

/**
 * 公共方法：查询商品
 */
async function getProductInfo(req) {
    // 获取商品 ID
    const {id} = req.params;

    const condition = getCondition();

    // 查询商品
    const productInfo = await product.findByPk(id, condition);

    // 如果没有找到，就抛出异常
    if (!productInfo) {
        throw new NotFoundError(`ID: ${id}的商品未找到。`)
    }

    delete productInfo.dataValues.groupId
    delete productInfo.dataValues.categoryId

    return productInfo;
}


/**
 * 查询商品列表
 * GET /api/products/getProductsList
 */
router.get('/getProductsList/', async function (req, res, next) {
    try {
        const condition = {
            ...getCondition(),
            order: [['createdAt', 'DESC']]
        }
        const products = await product.findAll(condition)
        success(res, '查询商品列表成功。', products);
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
            ...getCondition(),
            order: [['createdAt', 'DESC']],
            limit: pageSize,
            offset: offset,
            where: {},
            distinct: true
        }

        // 名称模糊查询
        if (query.name) {
            condition.where = {
                name: {
                    [Op.like]: `%${query.name}%`
                }
            }
        }

        if (query.categoryId) {
            condition.where = {
                categoryId: {
                    [Op.eq]: query.categoryId
                }
            }
        }

        if (query.groupId) {
            condition.where = {
                groupId: {
                    [Op.eq]: query.groupId
                }
            }
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

/**
 * 查询商品详情
 * GET /api/products/getProductInfo/:id
 */
router.get('/getProductInfo/:id', async function (req, res, next) {
    try {
        let productInfo = await getProductInfo(req);
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
        const specList = eval(req.body.productSpecList)
        if (!specList || !specList.length) {
            return res.status(400).json({
                status: false,
                message: '商品规格不能为空。',
            });
        }
        const productInfo = await product.create(body)
        const specBody = specList.map(item => {
            item.productId = productInfo.id
            return filterSpecBody(item)
        })
        const fields = Object.keys(specBody[0])
        await productSpec.bulkCreate(specBody, {
            ignoreDuplicates: true,
            fields: fields
        })
        success(res, '新增商品成功', {id: productInfo.id}, 201);
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
        await productSpec.destroy({where: {productId: req.params.id}});
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
        const specList = eval(req.body.productSpecList)
        if (!specList || !specList.length) {
            return res.status(400).json({
                status: false,
                message: '商品规格不能为空。',
            });
        }
        await productSpec.destroy({
            where: {
                productId: req.params.id
            }
        });
        const specBody = specList.map(item => {
            item.productId = req.params.id
            return filterSpecBody(item)
        })
        const fields = Object.keys(specBody[0])
        await productSpec.bulkCreate(specBody, {
            updateOnDuplicate: fields.filter((item) => item !== 'id'),
            fields: fields
        })
        const productInfo = await getProductInfo(req);
        const body = filterBody(req)
        await productInfo.update(body)
        success(res, '更新商品成功', {id: productInfo.id})
    } catch (err) {
        failure(res, err)
    }
});

module.exports = router;