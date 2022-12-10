import { Customer } from './../../entity/Customer';
import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';

//Declarar um canal com o Rabbit
let channel: Channel;

const connect = async () => {
    const conn: Connection = await amqp.connect('amqp://localhost');
    channel = await conn.createChannel();
}

//Consome o conteúdo de uma fila
const consumeQueue = 
    async (queue: string, callback: (message: ConsumeMessage | null) => void) => {
    await channel.assertQueue( queue );
    return channel.consume( queue, message => {
        callback(message);

        if (message) {
            channel.ack( message );
        }
    })
}

//Consumir fila de clientes
const consumeCustomer = async () => {
    await consumeQueue('prm-customer', async message => {
        if (message) {
            const customer = JSON.parse(message?.content.toString());
            await Customer.save(customer);
            console.log('Cliente salno no banco')
        }
    })
}

export { connect, consumeCustomer }