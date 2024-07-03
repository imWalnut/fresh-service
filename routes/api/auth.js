const express = require('express');
const router = express.Router();
const { user } = require('../../models');
const { Op } = require('sequelize');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../../utils/errors');
const { success, failure } = require('../../utils/responses');

/**
 * 管理员登录
 * POST /api/auth/signIn
 */
router.post('/signIn', async (req, res) => {
    try {
        const { login, password } = req.body;

        if(!login) {
            throw new BadRequestError('手机号/用户名必须填写。');
        }

        if(!password) {
            throw new BadRequestError('密码必须填写。');
        }

        const condition = {
            where: {
                [Op.or]: [
                    { phoneNumber: login },
                    { username: login }
                ]
            }
        };

    // 通过手机号或username，查询用户是否存在
        const userInfo = await user.findOne(condition);
        if (!userInfo) {
            throw new NotFoundError('用户不存在，无法登录。');
        }
        success(res, '登录成功。', {});
    } catch (error) {
        failure(res, error);
    }
});

module.exports = router;
