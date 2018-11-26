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
        initial_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        start_time: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "08"
        }
    },
        {
            timestamps: false
        });

    Pill.associate = function (models) {
        // We're saying that a Post should belong to an Author
        // A Post can't be created without an Author due to the foreign key constraint
        Pill.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            },
        });
    };

    return Pill;
};