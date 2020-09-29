import pdfkit
import pandas as pd
import sqlite3

def DictToPdf(query_as_dict={}):
    # read the query data to the dataframe
    query_DataFrame = pd.DataFrame(query_as_dict)

    # query_DataFrame.to_html("/server/.log_files/query_DataFrame.html")
    query_DataFrame.to_html("query_DataFrame.html")

    # convert the html file into pdf with wkhtmltopdf
    return pdfkit.from_file('query_DataFrame.html', 'query_DataFrame.pdf')
    # pdfkit.from_url('http://localhost:5000', 'index_page.pdf')


def DictToExcel(query_as_dict={}):
    # read the query data to the dataframe
    query_DataFrame = pd.DataFrame(query_as_dict)

    return query_DataFrame.to_excel("query_DataFrame.xlsx")
