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
        frequency_amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        frequency_time: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        frequency_interval: {
            type: DataTypes.ENUM,
            values: [
                "HOUR",
                "DAY",
                "WEEK",
                "MONTH"
            ],
            defaultValue: "HOUR",
            allowNull: false
        },
        initial_time: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        initial_date: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
        {
            timestamps: false
        });
    return Pill;
};