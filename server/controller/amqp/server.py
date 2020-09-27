from __future__ import print_function
import optparse
from proton import Message, Url
from proton.handlers import MessagingHandler
from proton.reactor import Container

""" Dummy Test: Server Response task:
Our server will provide a very simple service: 
it will respond with the body of the request converted to uppercase.
"""

"""Servers task: process the request and send the response"""
# NOTE: The code here is not too different from the simple receiver example.

class Server(MessagingHandler):
    def __init__(self, url, address):
        super(Server, self).__init__()
        self.url = url
        self.address = address

    def on_start(self, event):
        print("Listening on", self.url)
        self.container = event.container
        self.conn = event.container.connect(self.url)
        self.receiver = event.container.create_receiver(self.conn, self.address)
        self.server = self.container.create_sender(self.conn, None)

    def on_message(self, event):
        print("Received", event.message)
        self.server.send(Message(address=event.message.reply_to, body=event.message.body.upper(),
                            correlation_id=event.message.correlation_id))

broker="localhost:5672/examples"

# Apache ActiveMQ server address
# Container(Server("localhost:8161", topic="examples")).run()
parser = optparse.OptionParser(usage="usage: %prog [options]")
parser.add_option("-a", "--address", default=broker,
                  help="address from which messages are received (default %default)")
opts, args = parser.parse_args()

url = Url(opts.address)

try:
    Container(Server(url, url.path)).run()
except KeyboardInterrupt: pass
