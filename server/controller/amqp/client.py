from __future__ import print_function, unicode_literals
from proton import Message
from proton.handlers import MessagingHandler
from proton.reactor import Container, DynamicNodeProperties


class Client(MessagingHandler):
    def __init__(self, server, requests):
        super(Client, self).__init__()
        self.server = server
        self.requests = requests

    """
    Called only ones
    (Client <-> Message Broker) connection

    Initiates the establishment of a link over which messages can be sent.
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
        if event.receiver == self.receiver:
            self.next_request()

    """
    (next_request -> on_message) loop
    on_start and on_link_opened dont get called again at this point

    clients message content and sending the request
    """

    def next_request(self):
        print("nach on_link_opened")
        if self.receiver.remote_source.address:
            req = Message(priority=4,
                          reply_to=self.receiver.remote_source.address, body=self.requests[0])

            # send the message / request
            self.sender.send(req)

    """
    (Message Broker -> Client) message 
    called when a message is received 

    'on_message()' is a fuction from MessagingHandler
    """

    def on_message(self, event):
        print(event.message.body)
        print("%s => %s" % (self.requests.pop(0), event.message.body))
        if self.requests:
            self.next_request()
        else:
            event.connection.close()


def request_amqp():

    requests = ["Twas brillig, and the slithy toves",
                "hey jude", "zweite Nachricht"]

    broker = "localhost:5672/examples"

    # send the request list to the server
    Container(Client(broker, requests)).run()
    
    return 0


if __name__ == "__main__":
    request_amqp()
