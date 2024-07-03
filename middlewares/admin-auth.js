const jwt = require('jsonwebtoken');
const {user} = require('../models');
const {UnauthorizedError} = require('../utils/errors');
const {success, failure} = require('../utils/responses');

module.exports = async (req, res, next) => {
    try {
        // 判断 Token 是否存在
        const {token} = req.headers;
        if (!token) {
            throw new UnauthorizedError('当前接口需要认证才能访问。')
        }
        // 验证 token 是否正确
        const decoded = jwt.verify(token, process.env.SECRET);

        // 从 jwt 中，解析出之前存入的 userId
        const {userId} = decoded;

        // 查询一下，当前用户
        const userInfo = await user.findByPk(userId);
        if (!userInfo) {
            throw new UnauthorizedError('用户不存在。')
        }

        // 验证当前用户是否是管理员或销售 0管理员 1销售 2用户
        if (userInfo.role === 2) {
            throw new UnauthorizedError('您没有权限使用当前接口。')
        }

        req.user = userInfo

        next()
    } catch (error) {
        failure(res, error);
    }
};
