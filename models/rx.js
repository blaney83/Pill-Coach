module.exports = function (sequelize, DataTypes) {
    let Rx = sequelize.define("Rx", {
        rx_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        side_effects: {
            type: DataTypes.BLOB,
            allowNull: false
        },
        main_info: {
            type: DataTypes.BLOB,
            allowNull: false
        }
    },
        {
            timestamps: true,
        });
    return Rx;
};