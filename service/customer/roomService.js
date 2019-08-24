const { Room, Order, OrderDetail, Op, logger } = require('../../connection/sequelize')
const uploadImageService = require('../general/uploadImageService')

async function read() {
    let room = await Room.findAll()
    return {
        data: room,
        statusCode: 200,
        message: 'List'
    }
}

async function create(data) {
    
    data.image = await uploadImageService.saveImageUpload(data)

    let room = await Room.create(data)

    logger.log('info',`Room CREATE`, {
        logDate: new Date(),
        type: 'ROOM',
        action: 'CREATE',
        from: 'ADMINISTRATOR',
        roomId: room.id,
        userId: '',
        data: room
    })

    return {
        data: room,
        statusCode: 200,
        message: 'Create succeed'
    }
}

async function update(data) {
    let room = await Room.update(
        data,
        {
            where: { id: data.id } 
        }
    )

    if (!room)
    {
        return {
            data: null,
            statusCode: 100,
            message: 'Update failed'
        }
    } else {

        logger.log('info',`Room UPDATE`, {
            logDate: new Date(),
            type: 'ROOM',
            action: 'UPDATE',
            from: 'ADMINISTRATOR',
            roomId: data.id,
            userId: '',
            data: room
        })

        return {
            data: room,
            statusCode: 200,
            message: 'Update succeed'
        }
    }
}

async function del(data) {
    let room = await Room.update(
        {
            isActive: false,
            isDelete: true
        },
        {
            where: { id: data.id } 
        }
    )

    if (!room)
    {
        return {
            data: null,
            statusCode: 100,
            message: 'Delete failed'
        }
    } else {

        logger.log('info',`Room DELETE`, {
            logDate: new Date(),
            type: 'ROOM',
            action: 'DELETE',
            from: 'ADMINISTRATOR',
            roomId: data.id,
            userId: '',
            data: room
        })

        return {
            data: room,
            statusCode: 200,
            message: 'Delete succeed'
        }
    }
}

///////////////////////////
//  Get list room Available
//
async function roomsAvailable(input) {
    let rooms = null
    let roomChoosedId = await roomBookedByDate(
        input.dateFrom ? input.dateFrom : null,
        input.dateTo ? input.dateTo : null)

    if (input.id)
    {
        rooms = await Room.findAll(
            {
                where: {
                    id: input.id,
                    isActive: true,
                    isDelete: false
                }
            }
        )
    } else {
        rooms = await Room.findAll(
            {
                where: {
                    id: {
                        [Op.notIn]: roomChoosedId
                    },
                    isActive: true,
                    isDelete: false
                }
            }
        )
    }
    return rooms
}

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
async function roomBookedByDate(dateFrom, dateTo) {

    if (!dateFrom)
    {
        return []
    }

    let startOfDate = new Date(dateFrom).setHours(0,0,0,0)
    let endOfDate = new Date(dateFrom).setHours(23,59,59,999)

    if (dateTo)
    {
        endOfDate = new Date(dateTo).setHours(23,59,59,999)
    }

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
                        },
                        isActive: true,
                        isDelete: false
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
    read, create, update, del,
    roomsAvailable,
    roomIdBookedByDate,
    roomBookedByDate
}