import pandas as pd
import pdfkit
import sqlite3


def DictToPdf(query_as_dict={}, file_name=''):
    # read the query data to the dataframe
    query_DataFrame = pd.DataFrame(query_as_dict)

    # query_DataFrame.to_html("/server/.log_files/query_DataFrame.html")
    query_DataFrame.to_html("server/controller/query_downloads/{}.html".format(file_name))

    # convert the html file into pdf with wkhtmltopdf
    return pdfkit.from_file("server/controller/query_downloads/{}.html".format(file_name),
                            "server/controller/query_downloads/{}.pdf".format(file_name))


def DictToExcel(query_as_dict={}, file_name=''):
    # read the query data to the dataframe
    query_DataFrame = pd.DataFrame(query_as_dict)

    return query_DataFrame.to_excel("server/controller/query_downloads/{}.xlsx".format(file_name))
