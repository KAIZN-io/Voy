import arrow


def time_stamp():
    return arrow.utcnow().to("Europe/Berlin").format('DD-MMM-YYYY HH:mm:ss')
