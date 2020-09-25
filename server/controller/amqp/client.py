from __future__ import print_function, unicode_literals
import optparse
from proton import Message
from proton.handlers import MessagingHandler
from proton.reactor import Container, DynamicNodeProperties

class Client(MessagingHandler):
    def __init__(self, url, requests):
        super(Client, self).__init__()
        self.url = url
        self.requests = requests

    def on_start(self, event):
        self.sender = event.container.create_sender(self.url)
        # As well as sending requests, we need to be able to get back the responses. We create a receiver for that 
        self.receiver = event.container.create_receiver(self.sender.connection, None, dynamic=True)

    def next_request(self):
        if self.receiver.remote_source.address:
            req = Message(reply_to=self.receiver.remote_source.address, body=self.requests[0])
            self.sender.send(req)

    def on_link_opened(self, event):
        if event.receiver == self.receiver:
            self.next_request()

    def on_message(self, event):
        print("%s => %s" % (self.requests.pop(0), event.message.body))
        if self.requests:
            self.next_request()
        else:
            event.connection.close()

REQUESTS= ["Twas brillig, and the slithy toves",
           "Did gire and gymble in the wabe.",
           "All mimsy were the borogroves,",
           "And the mome raths outgrabe."]

parser = optparse.OptionParser(usage="usage: %prog [options]",
                               description="Send requests to the supplied address and print responses.")
parser.add_option("-a", "--address", default="localhost:5672/examples",
                  help="address to which messages are sent (default %default)")
opts, args = parser.parse_args()

Container(Client(opts.address, args or REQUESTS)).run()
