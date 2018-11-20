module.exports = function (sequelize, DataTypes) {
    let Pill = sequelize.define("Pill", {
        rx_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dosage: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        frequency: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING
        }
    },
        {
            timestamps: false
        });
    return Pill;
};