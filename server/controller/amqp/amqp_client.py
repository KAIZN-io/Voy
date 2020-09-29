from proton import Message
from proton.handlers import MessagingHandler
from proton.reactor import Container, DynamicNodeProperties


class AMQP_Client(MessagingHandler):
    def __init__(self, server, requests, annotation):
        super(AMQP_Client, self).__init__()
        self.server = server
        self.requests = requests
        self.annotation = annotation

    """
    Called only ones
    (Client <-> Message Broker) connection

    Initiates the establishment of a link over which messages can be sent.
    'on_start()' is a function from MessagingHandler
    """

    def on_start(self, event):
        # create_sender() method returns an instance of Sender.
        # context (proton.Connection or str) – A connection object or a URL (=Server URL).
        self.sender = event.container.create_sender(
            context=self.server, name="amqp_client")

        # As well as sending requests, we need to be able to get back the responses. We create a receiver for that
        self.receiver = event.container.create_receiver(
            self.sender.connection, None, dynamic=True)

    """
    called when the link is opened
    """

    def on_link_opened(self, event):
        print("SEND: Opened sender for target address")

    """
    (Message Broker -> Client) message
    called when a message is received

    """

    def on_sendable(self, event):
        # body (bytes | unicode | dict | list | int | long | float | UUID) – message body
        message = Message(body=self.requests,
                          reply_to=self.receiver.remote_source.address,
                          annotations=self.annotation
                          )

        # NOTE: is it the same as: 'self.sender.send(message)' ?
        event.sender.send(message)
        event.sender.close()
        event.connection.close()


def request_amqp(requests, annotation):

    broker = "localhost:5672/examples"

    handler = AMQP_Client(broker, requests, annotation)
    container = Container(handler)
    container.run()

    return 0
