import arrow

def time_stamp():
    return arrow.utcnow().format('DD-MMM-YYYY HH:mm:ss')
