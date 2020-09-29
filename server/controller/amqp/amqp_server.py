import optparse
from proton import Message, Url, Terminus
from proton.handlers import MessagingHandler
from proton.reactor import Container, ReceiverOption
import logging

import sys
sys.path.append("..")
from python_scripts import TransformData

"""
A durable subscription is a piece of state on the remote server representing a message receiver.
Ordinarily, message receivers are discarded when a client closes. 
However, because durable subscriptions are persistent, clients can detach from them and then re-attach later. 
Any messages received while detached are available when the client re-attaches.
"""

"""Servers task: process the request and send the response"""


class AMQP_Server(MessagingHandler):
    def __init__(self, url, address):
        super(AMQP_Server, self).__init__()
        self.url = url
        self.address = address

    """
    Called only ones
    (Server Client <-> Message Broker) connection

    Initiates the establishment of a link over which messages can be sent.
    """

    def on_start(self, event):

        print("Listening on", self.url)
        # ? to enable multiple message sending
        self.conn = event.container.connect(self.url)

        # beeing able to send message to broker
        self.server = event.container.create_sender(self.conn)

        # self.server = event.container.create_sender(context=self.conn, name="amqp_server")
        # beeing able to receive message from broker
        self.receiver = event.container.create_receiver(
            self.conn, "examples", name="sub-1", options=SubscriptionOptions())

    def on_message(self, event):
        message = event.message

        logging.info("User created a {} file".format(message.annotations['download_type']))

        # transform the data
        if message.annotations['download_type'] == 'pdf':
            TransformData.DictToPdf(message.body)

        elif message.annotations['download_type'] == 'xlsx':
            TransformData.DictToExcel(message.body)

        # TODO: send mail to user
        # TEMP now: save the file to the server directory
        response = Message(body="hey",
                           address=message.reply_to,
                           correlation_id=message.correlation_id
                           )

        self.server.send(response)


# Configure the receiver source for durability
class SubscriptionOptions(ReceiverOption):
    def apply(self, receiver):
        # Preserve unsettled delivery state
        receiver.source.durability = Terminus.DELIVERIES

        # Don't expire the source
        receiver.source.expiry_policy = Terminus.EXPIRE_NEVER


# broker="localhost:8161/examples"
broker = "localhost:5672/examples"

# Apache ActiveMQ server address
# Container(Server("localhost:8161", topic="examples")).run()
parser = optparse.OptionParser(usage="usage: %prog [options]")
parser.add_option("-a", "--address", default=broker,
                  help="address from which messages are received (default %default)")
opts, args = parser.parse_args()

url = Url(opts.address)

try:

    handler = AMQP_Server(url, url.path)
    container = Container(handler)
    # Set the container ID
    container.container_id = "Python_Scripts"
    container.run()

except KeyboardInterrupt:
    pass
