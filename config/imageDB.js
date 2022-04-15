module.exports = (sequelize, Sequelize) => {
    const user = sequelize.define("imageDetails", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        file_name: {
            type: Sequelize.STRING
        },
        url: {
            type: Sequelize.STRING
        },
        user_id: {
            type: Sequelize.STRING
        }
    });
    return user;
};