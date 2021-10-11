module.exports=(sequelize,DataTypes)=>{
    const User = sequelize.define("user", {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
        },
        userName: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        token: {
          type:DataTypes.STRING,
        }
      });
      return User
      
}

