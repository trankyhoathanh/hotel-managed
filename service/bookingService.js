let { sequelize, Room, Customer, Order, OrderDetail, Op } = require('../connection/sequelize')
let roomService = require('./roomService')

///////////////////////////
//  Booking room Multi rooms
//  Input : customerId, roomIds [ { id, date (2019-08-21) }, {}, ... ]
//  Output : {data, status, message}
async function bookRoom(body) {

    let transaction
    try {
        // get transaction
        transaction = await sequelize.transaction()

        // step 2 - Insert Order
        let order = await Order.create({
            customerId: body.customerId
        }, {transaction});
      
        // step 3 - Insert Order Details
        let orderDetails = []
        let roomConflicts = []
        if (body.roomIds && body.roomIds.length > 0)
        {
            for(let i = 0, len = body.roomIds.length; i < len; i++)
            {
                // Check room Conflict
                let roomChoosedId = await roomService.roomIdBookedByDate(body.roomIds[i].id, body.roomIds[i].date)
                let roomConflict = await Room.findAll(
                    {
                        where: {
                            id: {
                                [Op.in]: roomChoosedId
                            }
                        }
                    }
                )

                if (roomConflict && roomConflict.length > 0)
                {
                    roomConflicts.push(roomConflict)
                }

                let detail = await OrderDetail.create(
                    {
                        orderId: order.id,
                        roomId: body.roomIds[i].id,
                        startDate: new Date(body.roomIds[i].date)
                    },
                    {transaction}
                );
                orderDetails.push(detail)
            }
        }

        if (roomConflicts && roomConflicts.length > 0)
        {
            await transaction.rollback()
            return {
                data: {
                    roomConflicts : roomConflicts
                },
                status: 100,
                message: 'Any rooms is not available today'
            }
        }

        if (!orderDetails || orderDetails.length < 1)
        {
            await transaction.rollback()
            return {
                data: null,
                status: 100,
                message: `Error, can't save some order details`
            }
        }
        
        // commit
        await transaction.commit();
      
        let booking = await Order.findAll({
            where: {
                id: order.id
            },
            include: [
                {
                    model: OrderDetail
                },
                {
                    model: Customer
                }
            ]
        })

        return {
            data: booking,
            status: 200,
            message: 'Commit Succeed'
        }
    } catch (err) {
        if (!transaction)
        {
            return {
                data: err,
                status: 100,
                message: 'Error have not transaction'
            }
        }
        if (err) {
            await transaction.rollback()
            return {
                data: err,
                status: 100,
                message: 'Error, rollback succeed'
            }
        }
    }
}

///////////////////////////
//  Cancel ORDER booking
//  Input : id (order booking id)
//  Output : {data, status, message}
async function cancel(body) {
    let orderStatus = await Order.update(
        {
            isActive: false,
            isDelete: true
        },
        {
            where: { id: body.id } 
        }
    )

    if (!orderStatus)
    {
        return {
            data: null,
            status: 100,
            message: 'Cancel failed'
        }
    } else {
        return {
            data: orderStatus,
            status: 200,
            message: 'Cancel succeed'
        }
    }     
}

module.exports = {
    bookRoom,
    cancel
}