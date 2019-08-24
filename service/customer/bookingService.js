const { sequelize, Room, Customer, Order, OrderDetail, Op, logger } = prodServiceLocator.get('dataProduction')
const roomService = prodServiceLocator.get('roomService')

async function getAllBooking(body) {
    let order = null

    if (body.id)
    {
        order = await Order.findAll(
            {
                where: {
                    id: body.id
                }
            }
        )
    } else if (body.customerId) {
        order = await Order.findAll(
            {
                where: {
                    customerId: body.customerId,
                    isActive: true,
                    isDelete: false
                },
                include: [
                    { 
                        //attributes:[],
                        model: OrderDetail,
                        where: {
                            isActive: true,
                            isDelete: false
                        }
                    },
                ],
            }
        )
    } else {
        order = await Order.findAll(
            {
                include: [
                    {
                        model: OrderDetail
                    },
                    {
                        model: Customer
                    }
                ]
            }
        )
    }

    // logger.log('info',`Get list booking`, {
    //     logDate: new Date(),
    //     type: 'BOOKING',
    //     from: 'CUSTOMER',
    //     userId: body.customerId,
    //     data: order
    // })
    
    return {
        data: order,
        status: 200,
        message: 'All Booking'
    }
}

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
        }, {transaction})
      
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
                )
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
        await transaction.commit()

        for(let i = 0; i < orderDetails.length; i++)
        {
            logger.log('info',`Room Add`, {
                logDate: new Date(),
                type: 'ROOM',
                action: 'ADD',
                from: 'CUSTOMER',
                roomId: orderDetails[i].id,
                userId: body.customerId,
                data: orderDetails[i]
            })
        }
        
      
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
//  Update booking room Multi rooms
async function updateBookRoom(body) {

    // Check start date
    if (body.order_details)
    {
        for(let i = 0, len = body.order_details.length; i < len; i++)
        {
            let item = await OrderDetail.findOne({
                    where: { id: body.order_details[i].id } 
                }
            )
            if (item.startDate <= new Date())
            {
                return {
                    data: null,
                    status: 100,
                    message: `You can't update order booking, start date is lower current date !`
                }
            }
            
        }
    }

    let transaction
    try {
        // get transaction
        transaction = await sequelize.transaction()

        // step 1 - Update Order
        let order = await Order.findOne({
            where: {
                id: body.id
            }
        })

        await order.update(
            {
                isActive: body.isActive,
                isDelete: body.isDelete 
            }, { transaction }
        )


        // step 2 - Update details
        if (body.order_details)
        {
            for(let i = 0, len = body.order_details.length; i < len; i++)
            {
                let item = await OrderDetail.findOne({
                        where: { id: body.order_details[i].id } 
                    }
                )
                await item.update({
                    isActive: body.order_details[i].isActive,
                    isDelete: body.order_details[i].isDelete 
                }, { transaction })
            }
        }

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
                )
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

        // commit
        await transaction.commit()



        //////////////////////////////////////////////
        //  Logger
        //  START
        //
        //  Room Update
        if (body.order_details)
        {
            for(let i = 0, len = body.order_details.length; i < len; i++)
            {
                if (body.order_details[i].isDelete)
                {
                    logger.log('info',`Room Remove`, {
                        logDate: new Date(),
                        type: 'ROOM',
                        action: 'REMOVE',
                        from: 'CUSTOMER',
                        roomId: body.order_details[i].id,
                        userId: body.customerId,
                        data: body.order_details[i]
                    })
                }
            }
        }
        // Room Add
        for(let i = 0; i < orderDetails.length; i++)
        {
            logger.log('info',`Room Add`, {
                logDate: new Date(),
                type: 'ROOM',
                action: 'ADD',
                from: 'CUSTOMER',
                roomId: orderDetails[i].id,
                userId: body.customerId,
                data: orderDetails[i]
            })
        }
        //
        //  END
        //  Logger
        //////////////////////////////////////////////

        return {
            data: null,
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
        order = await Order.findOne(
            {
                where: {
                    customerId: body.customerId,
                    id: body.id
                },
                include: [
                    {
                        model: OrderDetail
                    },
                ],
            }
        )

        //////////////////////////////////////////////
        //  Logger
        //  START
        //
        //  Room Update
        if (order && order.order_details)
        {
            for(let i = 0, len = order.order_details.length; i < len; i++)
            {
                logger.log('info',`Room Remove`, {
                    logDate: new Date(),
                    type: 'ROOM',
                    action: 'REMOVE',
                    from: 'CUSTOMER',
                    roomId: order.order_details[i].id,
                    userId: order.customerId,
                    data: order.order_details[i]
                })
            }
        }
        //
        //  END
        //  Logger
        //////////////////////////////////////////////

        return {
            data: orderStatus,
            status: 200,
            message: 'Cancel succeed'
        }
    }     
}

module.exports = {
    getAllBooking,
    bookRoom,
    updateBookRoom,
    cancel
}