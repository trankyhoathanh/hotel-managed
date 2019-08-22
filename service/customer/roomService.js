let { sequelize, Room, Customer, Order, OrderDetail, Op } = require('../../connection/sequelize')

///////////////////////////
//  Get list room Booked
//  Input : roomId, date
//  Output : [id]
async function roomIdBookedByDate(id, date) {
    let startOfDate = new Date(date).setHours(0,0,0,0)
    let endOfDate = new Date(date).setHours(23,59,59,999)

    let roomChoosed = await Room.findAll(
        {
            attributes:[['id', 'id']],
            include: [
                {
                    attributes:[],
                    model: OrderDetail,
                    include: [
                        { 
                            attributes:[],
                            model: Order,
                            where: {
                                isActive: true,
                                isDelete: false
                            }
                        },
                    ],
                    where: {
                        startDate: {
                            [Op.between]: [startOfDate, endOfDate]
                        }
                    }
                }
            ],
            where: {
                id: id
            }
        }
    )
    let roomChoosedId = []
    for(let i = 0, len = roomChoosed.length; i < len; i++)
    {
        roomChoosedId.push(roomChoosed[i].id)
    }
    return roomChoosedId
}

///////////////////////////
//  Get list room Booked
//  Input : date
//  Output : [id, id, id ...]
async function roomBookedByDate(date) {
    let startOfDate = new Date(date).setHours(0,0,0,0)
    let endOfDate = new Date(date).setHours(23,59,59,999)

    let roomChoosed = await Room.findAll(
        {
            attributes:[['id', 'id']],
            include: [
                {
                    attributes:[],
                    model: OrderDetail,
                    where: {
                        startDate: {
                            [Op.between]: [startOfDate, endOfDate]
                        }
                    }
                }
            ]
        }
    )
    let roomChoosedId = []
    for(let i = 0, len = roomChoosed.length; i < len; i++)
    {
        roomChoosedId.push(roomChoosed[i].id)
    }
    return roomChoosedId
}

module.exports = {
    roomIdBookedByDate,
    roomBookedByDate
}