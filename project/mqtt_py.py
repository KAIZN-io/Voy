import paho.mqtt.client as mqtt

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    # client.subscribe("$SYS/#")
    client.subscribe("house/light")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    # print("message received " , msg.topic+" "+str(message.payload.decode("utf-8")))

def on_log(client, userdata, level, buf):
    print("log: ",buf)

# Creating a Client Instance
# You should you clean_session = False if you need the QoS 2 guarantee of only one delivery.
client = mqtt.Client(client_id="masterJan", clean_session=False)

# connect to mosquitto broker
client.connect("127.0.0.1",1883,60)

# subscribe 
client.subscribe("house/light")#, qos=2)

# client.on_connect = on_connect
client.publish("house/light", payload="ON")#, qos=2)

# callback to receive message
client.on_message = on_message

# # if  we lose the connection and reconnect then subscriptions will be renewed 
# client.on_connect = on_connect

# To help troubleshoot your applications you can use the built in client logging callback.
client.on_log=on_log

# need to run a loop otherwise we won’t see the callbacks
client.loop_start()

# disconnect
client.disconnect()



