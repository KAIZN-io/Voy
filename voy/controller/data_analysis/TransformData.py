import pandas as pd
import pdfkit


def DictToPdf(query_as_dict={}, file_name=''):
    # read the query data to the dataframe
    query_DataFrame = pd.DataFrame(query_as_dict)

    # query_DataFrame.to_html("/server/.log_files/query_DataFrame.html")
    query_DataFrame.to_html("voy/controller/query_downloads/{}.html".format(file_name))

    # convert the html file into pdf with wkhtmltopdf
    return pdfkit.from_file("voy/controller/query_downloads/{}.html".format(file_name),
                            "voy/controller/query_downloads/{}.pdf".format(file_name))


def DictToExcel(query_as_dict={}, file_name=''):
    # read the query data to the dataframe
    query_DataFrame = pd.DataFrame(query_as_dict)

    return query_DataFrame.to_excel("voy/controller/query_downloads/{}.xlsx".format(file_name))
